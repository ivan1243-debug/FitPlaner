// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    sendEmailVerification,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBaRsWgsulD9Od1BdReu7tYtmRDdhCqgKI",
    authDomain: "fitplaner-8f6e0.firebaseapp.com",
    projectId: "fitplaner-8f6e0",
    storageBucket: "fitplaner-8f6e0.firebasestorage.app",
    messagingSenderId: "143564039650",
    appId: "1:143564039650:web:383f7263719b4d639385bb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const passwordField = document.getElementById("password");
const signupPasswordField = document.getElementById("signup-password");

// Form Elements
const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");
const loginEmailInput = document.querySelector('.login-form input[type="email"]');
const loginPasswordInput = document.querySelector('.login-form #password');
const loginButton = document.getElementById('login-submit');
const signupNameInput = document.querySelector('.signup-form input[type="text"]');
const signupEmailInput = document.querySelector('.signup-form input[type="email"]');
const signupPasswordInput = document.querySelector('.signup-form #signup-password');
const signupButton = document.getElementById('signup-submit');

// Create verification message container
const verificationMessage = document.createElement('div');
verificationMessage.className = 'verification-message';

// Form switching functionality
const showLoginLink = document.getElementById("show-login");
const showSignupLink = document.getElementById("show-signup");

showSignupLink.addEventListener("click", (event) => {
    event.preventDefault();
    // Remove any verification messages when switching forms
    if (loginForm.contains(verificationMessage)) {
        loginForm.removeChild(verificationMessage);
    }
    loginForm.style.display = "none";
    signupForm.style.display = "flex";
    signupForm.style.flexDirection = "column";
    signupForm.style.alignItems = "center";
    signupForm.style.justifyContent = "center";
});

showLoginLink.addEventListener("click", (event) => {
    event.preventDefault();
    // Remove any verification messages when switching forms
    if (signupForm.contains(verificationMessage)) {
        signupForm.removeChild(verificationMessage);
    }
    signupForm.style.display = "none";
    loginForm.style.display = "flex";
    loginForm.style.flexDirection = "column";
    loginForm.style.alignItems = "center";
    loginForm.style.justifyContent = "center";
});

// Eyes tracking functionality
const handleMouseMove = event => {
    if (!document.querySelector("#password:is(:focus)") && !document.querySelector("#password:is(:user-invalid)")) {
        const eyes = document.getElementsByClassName('eye');
        for (let eye of eyes) {
            const x = eye.getBoundingClientRect().left + 10;
            const y = eye.getBoundingClientRect().top + 10;
            const rad = Math.atan2(event.pageX - x, event.pageY - y);
            const rot = (rad * (180 / Math.PI) * -1) + 180;
            eye.style.transform = `rotate(${rot}deg)`;
        }
    }
};

const handleFocusPassword = event => {
    document.getElementById('face').style.transform = 'translateX(30px)';
    const eyes = document.getElementsByClassName('eye');
    for (let eye of eyes) {
        eye.style.transform = `rotate(100deg)`;
    }
};

const handleFocusOutPassword = event => {
    document.getElementById('face').style.transform = 'translateX(0)';
    if(event.target.checkValidity()) {
        document.getElementById('ball').classList.toggle('sad');
    } else {
        document.getElementById('ball').classList.toggle('sad');
        const eyes = document.getElementsByClassName('eye');
        for (let eye of eyes) {
            eye.style.transform = `rotate(215deg)`;
        }
    }
};

// Check if user is already logged in and verified
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.emailVerified) {
            // User is verified, redirect to main page
            window.location.href = 'main.html';
        } else {
            // User is logged in but not verified
            // Show verification message
            const message = `
                <div class="alert alert-warning">
                    Your email is not verified. Please check your inbox and verify your email.
                    <button id="resend-verification" class="resend-btn">Resend verification email</button>
                </div>
            `;
            verificationMessage.innerHTML = message;
            
            // Check which form is visible and add message
            if (loginForm.style.display !== 'none') {
                if (!loginForm.contains(verificationMessage)) {
                    loginForm.insertBefore(verificationMessage, loginForm.querySelector('form'));
                }
            }
            
            // Add event listener for resend button
            document.getElementById('resend-verification')?.addEventListener('click', async () => {
                try {
                    await sendEmailVerification(user);
                    alert('Verification email sent! Please check your inbox.');
                } catch (error) {
                    console.error('Error sending verification email:', error);
                    alert('Failed to send verification email. Please try again later.');
                }
            });
        }
    }
});

// Login Event Listener
loginButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (!user.emailVerified) {
            // Show verification required message
            const message = `
                <div class="alert alert-warning">
                    Your email is not verified. Please check your inbox and verify your email.
                    <button id="resend-verification" class="resend-btn">Resend verification email</button>
                </div>
            `;
            verificationMessage.innerHTML = message;
            
            // Remove existing message if present
            if (loginForm.contains(verificationMessage)) {
                loginForm.removeChild(verificationMessage);
            }
            
            // Add new message
            loginForm.insertBefore(verificationMessage, loginForm.querySelector('form'));
            
            // Add event listener for resend button
            document.getElementById('resend-verification').addEventListener('click', async () => {
                try {
                    await sendEmailVerification(user);
                    alert('Verification email sent! Please check your inbox.');
                } catch (error) {
                    console.error('Error sending verification email:', error);
                    alert('Failed to send verification email. Please try again later.');
                }
            });
            
            // Sign out the user since we don't want unverified users to be logged in
            await signOut(auth);
        } else {
            // User is verified, redirect to main page
            window.location.href = 'main.html';
        }
    } catch (error) {
        console.error('Login Error:', error);
        alert('Login failed. Please check your credentials.');
    }
});

// Signup Event Listener
signupButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const name = signupNameInput.value;
    const email = signupEmailInput.value;
    const password = signupPasswordInput.value;
    
    if (password.length < 6) {
        alert('Password should be at least 6 characters long.');
        return;
    }
    
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save user's name in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            emailVerified: false
        });
        
        // Send verification email
        await sendEmailVerification(user);
        
        signupNameInput.value = '';
        signupEmailInput.value = '';
        signupPasswordInput.value = '';
        
        // Show verification message
        const message = `
            <div class="alert alert-success">
                Account created successfully! A verification email has been sent to ${email}.
                Please check your inbox and verify your email before logging in.
            </div>
        `;
        verificationMessage.innerHTML = message;
        
        // Remove existing message if present
        if (signupForm.contains(verificationMessage)) {
            signupForm.removeChild(verificationMessage);
        }
        
        // Add new message
        signupForm.insertBefore(verificationMessage, signupForm.querySelector('form'));
        
        // Switch to login form after a delay
        setTimeout(() => {
            // Remove the message from signup form
            if (signupForm.contains(verificationMessage)) {
                signupForm.removeChild(verificationMessage);
            }
            
            signupForm.style.display = 'none';
            loginForm.style.display = 'flex';
            loginForm.style.flexDirection = "column";
            loginForm.style.alignItems = "center";
            loginForm.style.justifyContent = "center";
            
            // Add message to login form
            loginForm.insertBefore(verificationMessage, loginForm.querySelector('form'));
        }, 5000);
        
    } catch (error) {
        console.error('Signup Error:', error);
        alert('Signup failed. ' + error.message);
    }
});

// Submit button interactions for animation
const loginSubmit = document.getElementById('login-submit');
const signupSubmit = document.getElementById('signup-submit');

loginSubmit.addEventListener("mouseover", event => document.getElementById('ball').classList.toggle('look_at'));
loginSubmit.addEventListener("mouseout", event => document.getElementById('ball').classList.toggle('look_at'));

signupSubmit.addEventListener("mouseover", event => document.getElementById('ball').classList.toggle('look_at'));
signupSubmit.addEventListener("mouseout", event => document.getElementById('ball').classList.toggle('look_at'));

// Event listeners for password interactions
document.addEventListener("mousemove", event => handleMouseMove(event));
passwordField.addEventListener('focus', event => handleFocusPassword(event));
passwordField.addEventListener('focusout', event => handleFocusOutPassword(event));

// Signup password field interactions
signupPasswordField.addEventListener('focus', event => handleFocusPassword(event));
signupPasswordField.addEventListener('focusout', event => handleFocusOutPassword(event));

// Logout functionality - Check if the element exists before adding event listener
const logoutButton = document.querySelector('.nav-item.logout');
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            // Redirect to authentication page after logout
            window.location.href = 'auth.html';
        } catch (error) {
            console.error('Logout Error:', error);
            alert('Failed to log out. Please try again.');
        }
    });
}

// Add CSS for verification messages
const style = document.createElement('style');
style.textContent = `
.verification-message {
  width: 100%;
  max-width: 420px;
  margin-bottom: 20px;
}

.alert {
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.5;
}

.alert-success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert-warning {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.alert-error {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.resend-btn {
  background: none;
  border: none;
  color: #0875e4;
  font-weight: 500;
  padding: 0;
  margin-top: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  text-decoration: underline;
  display: block;
}
`;
document.head.appendChild(style);