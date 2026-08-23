  const themeToggle = document.getElementById('themeToggle');
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ascend-theme', theme);
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  const savedTheme = localStorage.getItem('ascend-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  const toggleEye = document.getElementById('toggleEye');
  const passwordInput = document.getElementById('password');
  toggleEye.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleEye.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    document.getElementById('eyeIcon').innerHTML = isPassword
      ? '<path d="M3 3l18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10.6 5.1A11 11 0 0 1 12 5c7 0 11 7 11 7a17.9 17.9 0 0 1-4 4.6M6.5 6.6C3.6 8.5 1 12 1 12s4 7 11 7a10.7 10.7 0 0 0 4.2-.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M9.5 9.7a3 3 0 0 0 4.2 4.2" stroke="currentColor" stroke-width="1.8"/>'
      : '<path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>';
  });

  const form = document.getElementById('loginForm');
  const emailField = document.getElementById('emailField');
  const passwordField = document.getElementById('passwordField');
  const statusMsg = document.getElementById('statusMsg');

  function isValidEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    if(!isValidEmail(document.getElementById('email').value.trim())){
      emailField.classList.add('has-error');
      document.getElementById('email').classList.add('error');
      valid = false;
    } else {
      emailField.classList.remove('has-error');
      document.getElementById('email').classList.remove('error');
    }

    if(passwordInput.value.trim().length === 0){
      passwordField.classList.add('has-error');
      passwordInput.classList.add('error');
      valid = false;
    } else {
      passwordField.classList.remove('has-error');
      passwordInput.classList.remove('error');
    }

    if(valid){
      form.reset();
      passwordInput.type = 'password';
      document.getElementById('eyeIcon').innerHTML = '<path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>';
      statusMsg.classList.add('show');
      setTimeout(() => statusMsg.classList.remove('show'), 3500);
    }
  });
