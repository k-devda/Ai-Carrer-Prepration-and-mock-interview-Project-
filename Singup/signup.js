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

  function wireEye(btnId, iconId, inputId){
    const btn = document.getElementById(btnId);
    const icon = document.getElementById(iconId);
    const input = document.getElementById(inputId);
    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      icon.innerHTML = isPassword
        ? '<path d="M3 3l18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10.6 5.1A11 11 0 0 1 12 5c7 0 11 7 11 7a17.9 17.9 0 0 1-4 4.6M6.5 6.6C3.6 8.5 1 12 1 12s4 7 11 7a10.7 10.7 0 0 0 4.2-.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M9.5 9.7a3 3 0 0 0 4.2 4.2" stroke="currentColor" stroke-width="1.8"/>'
        : '<path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>';
    });
  }
  wireEye('toggleEye1','eyeIcon1','password');
  wireEye('toggleEye2','eyeIcon2','confirmPassword');

  const passwordInput = document.getElementById('password');
  const bars = document.querySelectorAll('.strength-bar');
  const strengthLabel = document.getElementById('strengthLabel');
  const strengthColors = ['#D6432F', '#E08A2B', '#E0C22B', '#1F9D74'];
  const strengthWords = ['Weak', 'Fair', 'Good', 'Strong'];

  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let score = 0;
    if(val.length >= 8) score++;
    if(/[0-9]/.test(val)) score++;
    if(/[^A-Za-z0-9]/.test(val)) score++;
    if(/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    bars.forEach((bar, i) => {
      bar.style.background = i < score ? strengthColors[Math.max(score - 1, 0)] : 'var(--border)';
    });
    strengthLabel.textContent = val.length === 0
      ? 'Use 8+ characters with a number and a symbol.'
      : strengthWords[Math.max(score - 1, 0)] + ' password';
  });

  const form = document.getElementById('signupForm');
  const nameField = document.getElementById('nameField');
  const emailField = document.getElementById('emailField');
  const passwordField = document.getElementById('passwordField');
  const confirmField = document.getElementById('confirmField');
  const termsRow = document.getElementById('termsRow');
  const statusMsg = document.getElementById('statusMsg');

  function isValidEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nameVal = document.getElementById('fullName').value.trim();
    if(nameVal.length === 0){
      nameField.classList.add('has-error');
      document.getElementById('fullName').classList.add('error');
      valid = false;
    } else {
      nameField.classList.remove('has-error');
      document.getElementById('fullName').classList.remove('error');
    }

    const emailVal = document.getElementById('email').value.trim();
    if(!isValidEmail(emailVal)){
      emailField.classList.add('has-error');
      document.getElementById('email').classList.add('error');
      valid = false;
    } else {
      emailField.classList.remove('has-error');
      document.getElementById('email').classList.remove('error');
    }

    const pwVal = passwordInput.value;
    if(pwVal.length < 8){
      passwordField.classList.add('has-error');
      passwordInput.classList.add('error');
      valid = false;
    } else {
      passwordField.classList.remove('has-error');
      passwordInput.classList.remove('error');
    }

    const confirmInput = document.getElementById('confirmPassword');
    if(confirmInput.value !== pwVal || confirmInput.value.length === 0){
      confirmField.classList.add('has-error');
      confirmInput.classList.add('error');
      valid = false;
    } else {
      confirmField.classList.remove('has-error');
      confirmInput.classList.remove('error');
    }

    if(!document.getElementById('terms').checked){
      termsRow.classList.add('has-error');
      valid = false;
    } else {
      termsRow.classList.remove('has-error');
    }

    if(valid){
      let toastTimer;
      form.reset();
      passwordInput.dispatchEvent(new Event('input'));
      [document.getElementById('password'), confirmInput].forEach(inp => { inp.type = 'password'; });
      document.getElementById('eyeIcon1').innerHTML = '<path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>';
      document.getElementById('eyeIcon2').innerHTML = '<path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>';
      clearTimeout(toastTimer);
      statusMsg.classList.add('show');
      toastTimer = setTimeout(() => statusMsg.classList.remove('show'), 3500);
    }
  });
