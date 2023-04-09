import '@babel/polyfill';
import { login, logout } from './login';

// DOM ELEMENTS
const loginForm = document.querySelector('.form');
const logoutclass = document.querySelector('.nav__el--logout');

// VALUES

// DELIGATIONS

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutclass) logoutclass.addEventListener('click', logout);
