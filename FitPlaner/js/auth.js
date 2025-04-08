const passwordField = document.getElementById("password");
const signupPasswordField = document.getElementById("signup-password");

// Form switching functionality
const showLoginLink = document.getElementById("show-login");
const showSignupLink = document.getElementById("show-signup");
const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");

showSignupLink.addEventListener("click", (event) => {
    event.preventDefault();
    loginForm.style.display = "none";
    signupForm.style.display = "flex";
    signupForm.style.flexDirection = "column";
    signupForm.style.alignItems = "center";
    signupForm.style.justifyContent = "center";
});

showLoginLink.addEventListener("click", (event) => {
    event.preventDefault();
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

// Event listeners for password interactions
document.addEventListener("mousemove", event => handleMouseMove(event));
passwordField.addEventListener('focus', event => handleFocusPassword(event));
passwordField.addEventListener('focusout', event => handleFocusOutPassword(event));

// Signup password field interactions
signupPasswordField.addEventListener('focus', event => handleFocusPassword(event));
signupPasswordField.addEventListener('focusout', event => handleFocusOutPassword(event));

// Submit button interactions
const loginSubmit = document.getElementById('login-submit');
const signupSubmit = document.getElementById('signup-submit');

loginSubmit.addEventListener("mouseover", event => document.getElementById('ball').classList.toggle('look_at'));
loginSubmit.addEventListener("mouseout", event => document.getElementById('ball').classList.toggle('look_at'));

signupSubmit.addEventListener("mouseover", event => document.getElementById('ball').classList.toggle('look_at'));
signupSubmit.addEventListener("mouseout", event => document.getElementById('ball').classList.toggle('look_at'));

// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
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

// Form Elements
const loginEmailInput = document.querySelector('.login-form input[type="email"]');
const loginPasswordInput = document.querySelector('.login-form #password');
const loginButton = document.getElementById('login-submit');
const signupNameInput = document.querySelector('.signup-form input[type="text"]');
const signupEmailInput = document.querySelector('.signup-form input[type="email"]');
const signupPasswordInput = document.querySelector('.signup-form #signup-password');
const signupButton = document.getElementById('signup-submit');

// Login Event Listener
loginButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        window.location.href = 'main.html'; 
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
            email: email
        });

        signupNameInput.value = '';
        signupEmailInput.value = '';
        signupPasswordInput.value = '';
        alert('Account created successfully!');
        signupForm.style.display = 'none';
        loginForm.style.display = 'flex';
    } catch (error) {
        console.error('Signup Error:', error);
        alert('Signup failed. Please try again.');
    }
});

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