/**
 * I-Stream — login.js
 * Handles all login page logic: tab switching,
 * form validation, authentication, and guest access.
 */

'use strict';

// Redirect if already logged in
if (localStorage.getItem('is_session')) {
  window.location.href = 'index.html';
}

// ── Tab Switching ────────────────────────────────────────

function switchTab(tab) {
  const isLogin = tab === 'login';

  document.getElementById('form-login').classList.toggle('hidden', !isLogin);
  document.getElementById('form-register').classList.toggle('hidden', isLogin);

  document.getElementById('tab-login').className =
    `tab-btn flex-1 py-2.5 rounded-xl text-sm font-600 transition-all ${isLogin ? 'active-tab' : 'inactive-tab'}`;
  document.getElementById('tab-register').className =
    `tab-btn flex-1 py-2.5 rounded-xl text-sm font-600 transition-all ${!isLogin ? 'active-tab' : 'inactive-tab'}`;

  document.getElementById('auth-heading').textContent = isLogin ? 'Welcome back' : 'Create account';
  document.getElementById('auth-sub').textContent = isLogin
    ? 'Sign in to continue watching'
    : 'Join I-Stream and start watching';

  clearErrors();
}

// ── Error helpers ────────────────────────────────────────

function showError(id, message) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.classList.remove('hidden');
}

function clearErrors() {
  document.getElementById('login-err').classList.add('hidden');
  document.getElementById('reg-err').classList.add('hidden');
}

// ── Password visibility toggle ───────────────────────────

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.textContent = isHidden ? 'Hide' : 'Show';
}

// ── Login ────────────────────────────────────────────────

function doLogin() {
  clearErrors();
  const email = document.getElementById('li-email').value.trim();
  const pass  = document.getElementById('li-pass').value;

  if (!email || !pass) {
    showError('login-err', 'Please fill in all fields.');
    return;
  }
  if (!email.includes('@')) {
    showError('login-err', 'Enter a valid email address.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('is_users') || '[]');
  let user = users.find(u => u.email === email);

  if (user && user.pass !== pass) {
    showError('login-err', 'Incorrect password.');
    return;
  }

  if (!user) {
    // Auto-create account on first login
    user = { name: email.split('@')[0], email, pass };
    users.push(user);
    localStorage.setItem('is_users', JSON.stringify(users));
  }

  localStorage.setItem('is_session', JSON.stringify({ ...user, guest: false }));
  window.location.href = 'index.html';
}

// ── Register ─────────────────────────────────────────────

function doRegister() {
  clearErrors();
  const name  = document.getElementById('rg-name').value.trim();
  const email = document.getElementById('rg-email').value.trim();
  const pass  = document.getElementById('rg-pass').value;

  if (!name || !email || !pass) {
    showError('reg-err', 'Please fill in all fields.');
    return;
  }
  if (!email.includes('@')) {
    showError('reg-err', 'Enter a valid email address.');
    return;
  }
  if (pass.length < 6) {
    showError('reg-err', 'Password must be at least 6 characters.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('is_users') || '[]');
  if (users.find(u => u.email === email)) {
    showError('reg-err', 'An account with this email already exists.');
    return;
  }

  const user = { name, email, pass };
  users.push(user);
  localStorage.setItem('is_users', JSON.stringify(users));
  localStorage.setItem('is_session', JSON.stringify({ ...user, guest: false }));
  window.location.href = 'index.html';
}

// ── Guest access ─────────────────────────────────────────

function guestIn() {
  localStorage.setItem('is_session', JSON.stringify({ name: 'Guest', email: '', guest: true }));
  window.location.href = 'index.html';
}

// ── Event listeners ──────────────────────────────────────

document.getElementById('tab-login').addEventListener('click', () => switchTab('login'));
document.getElementById('tab-register').addEventListener('click', () => switchTab('register'));
document.getElementById('btn-login').addEventListener('click', doLogin);
document.getElementById('btn-register').addEventListener('click', doRegister);
document.getElementById('btn-guest').addEventListener('click', guestIn);

document.getElementById('li-toggle').addEventListener('click', function () {
  togglePassword('li-pass', this);
});
document.getElementById('rg-toggle').addEventListener('click', function () {
  togglePassword('rg-pass', this);
});

// Enter key support
document.getElementById('li-pass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
document.getElementById('li-email').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
document.getElementById('rg-pass').addEventListener('keydown', e => { if (e.key === 'Enter') doRegister(); });