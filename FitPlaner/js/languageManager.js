import { translations } from './translations.js';

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = translations;
        this.init();
    }

    init() {
        // Add language toggle button to the navigation
        const navMenu = document.querySelector('.nav-menu');
        const languageToggle = document.createElement('li');
        languageToggle.className = 'nav-item language-toggle';
        languageToggle.innerHTML = `
            <span class="material-icons" aria-hidden="true">translate</span>
            <span class="nav-text">${this.currentLang === 'en' ? 'BG' : 'EN'}</span>
        `;
        
        // Insert before logout button
        const logoutButton = document.querySelector('.nav-item.logout');
        navMenu.insertBefore(languageToggle, logoutButton);

        // Add click event listener
        languageToggle.addEventListener('click', () => this.toggleLanguage());

        // Initial translation
        this.translatePage();
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'bg' : 'en';
        localStorage.setItem('language', this.currentLang);
        this.translatePage();
        
        // Update button text
        const languageToggle = document.querySelector('.language-toggle .nav-text');
        languageToggle.textContent = this.currentLang === 'en' ? 'BG' : 'EN';
    }

    translatePage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });

        // Update placeholders
        const inputs = document.querySelectorAll('input[data-translate-placeholder]');
        inputs.forEach(input => {
            const key = input.getAttribute('data-translate-placeholder');
            if (this.translations[this.currentLang][key]) {
                input.placeholder = this.translations[this.currentLang][key];
            }
        });

        // Update help text
        const helpTexts = document.querySelectorAll('[data-translate-help]');
        helpTexts.forEach(element => {
            const key = element.getAttribute('data-translate-help');
            if (this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });

        // Update aria-labels
        const ariaLabels = document.querySelectorAll('[data-translate-aria-label]');
        ariaLabels.forEach(element => {
            const key = element.getAttribute('data-translate-aria-label');
            if (this.translations[this.currentLang][key]) {
                element.setAttribute('aria-label', this.translations[this.currentLang][key]);
            }
        });
    }
}

export const languageManager = new LanguageManager(); 