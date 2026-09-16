document.addEventListener('DOMContentLoaded', function () {
  const themeToggleBtn = document.querySelector('[data-theme-toggle]');
  const htmlElement = document.documentElement;
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const authCard = document.getElementById('authCard');
  const switchButtons = document.querySelectorAll('[data-switch]');
  const mobileTabs = document.querySelectorAll('.mobile-tab');
  const tabIndicator = document.getElementById('tabIndicator');
  const forgotModal = document.getElementById('forgotModal');
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  const forgotCloseBtn = document.getElementById('forgotClose');
  const toast = document.getElementById('toast');

  // Initialize theme based on localStorage or system preference
  function initTheme() {
    const savedTheme = localStorage.getItem('flowopz-theme');
    if (savedTheme) {
      htmlElement.setAttribute('data-theme', savedTheme);
      themeToggleBtn.setAttribute('aria-label', savedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggleBtn.setAttribute('aria-pressed', savedTheme === 'dark');
    } else {
      // Default to light
      htmlElement.setAttribute('data-theme', 'light');
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      themeToggleBtn.setAttribute('aria-pressed', false);
    }
  }

  // Toggle theme and save to localStorage
  function toggleTheme() {
    const current = htmlElement.getAttribute('data-theme');
    const nextTheme = current === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('flowopz-theme', nextTheme);
    themeToggleBtn.setAttribute('aria-label', nextTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    themeToggleBtn.setAttribute('aria-pressed', nextTheme === 'dark');
  }

  themeToggleBtn.addEventListener('click', toggleTheme);

  // Switch form panel function
  function switchForm(target) {
    if (target === 'login') {
      loginPanel.classList.add('active');
      registerPanel.classList.remove('active');
      setMobileTabActive('login');
    } else if (target === 'register') {
      registerPanel.classList.add('active');
      loginPanel.classList.remove('active');
      setMobileTabActive('register');
    }
  }

  // Set active mobile tab and indicator
  function setMobileTabActive(target) {
    mobileTabs.forEach((tab) => {
      const isActive = tab.dataset.switch === target;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });
    if (target === 'login') {
      tabIndicator.style.transform = 'translateX(0%)';
    } else {
      tabIndicator.style.transform = 'translateX(100%)';
    }
  }

  switchButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.switch;
      switchForm(target);
    });
  });

  mobileTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchForm(tab.dataset.switch);
    });
  });

  // Initialize default visible form
  switchForm('login');

  // Toggle password visibility
  document.querySelectorAll('.toggle-password').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input.type === 'password') {
        input.type = 'text';
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        btn.setAttribute('aria-label', 'Show password');
      }
    });
  });

  // Password strength meter for register form
  const passwordField = document.getElementById('reg-password');
  const strengthBars = document.querySelectorAll('#passwordStrength .strength-bars span');
  const strengthLabel = document.querySelector('#passwordStrength .strength-label');

  function evaluatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }

  function updateStrengthMeter(score) {
    strengthBars.forEach((bar, index) => {
      bar.classList.remove('active', 'weak', 'medium', 'strong');
      if (index < score) {
        bar.classList.add('active');
        if (score <= 1) bar.classList.add('weak');
        else if (score <= 3) bar.classList.add('medium');
        else bar.classList.add('strong');
      }
    });

    if (score === 0) strengthLabel.textContent = 'Password strength';
    else if (score <= 1) strengthLabel.textContent = 'Weak';
    else if (score <= 3) strengthLabel.textContent = 'Medium';
    else strengthLabel.textContent = 'Strong';
  }

  if (passwordField) {
    passwordField.addEventListener('input', () => {
      const score = evaluatePasswordStrength(passwordField.value);
      updateStrengthMeter(score);
    });
  }

  // Avatar upload preview
  const avatarInput = document.getElementById('reg-avatar');
  const avatarPreview = document.getElementById('regAvatarPreview');
  const avatarInitials = document.getElementById('regAvatarInitials');
  const avatarRemoveBtn = document.getElementById('regAvatarRemove');

  avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview.style.backgroundImage = `url('${e.target.result}')`;
        avatarPreview.textContent = '';
        avatarInitials.style.display = 'none';
      };
      reader.readAsDataURL(file);
      avatarRemoveBtn.style.display = 'inline';
    }
  });

  avatarRemoveBtn.addEventListener('click', () => {
    avatarInput.value = '';
    avatarPreview.style.backgroundImage = 'none';
    avatarInitials.style.display = 'flex';
    avatarPreview.textContent = '';
    avatarRemoveBtn.style.display = 'none';
  });

  avatarRemoveBtn.style.display = 'none';

  // Forgot Password modal logic
  forgotPasswordBtn.addEventListener('click', () => {
    forgotModal.classList.add('active');
  });

  forgotCloseBtn.addEventListener('click', () => {
    forgotModal.classList.remove('active');
  });

  forgotModal.addEventListener('click', (e) => {
    if (e.target === forgotModal) {
      forgotModal.classList.remove('active');
    }
  });

  // Form validation and submission stubs
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Basic validation
    const emailField = e.target.email;
    const passwordField = e.target.password;
    let valid = true;

    if (!emailField.value || !emailField.checkValidity()) {
      setFieldError('login-email', 'Please enter a valid email address');
      valid = false;
    } else {
      clearFieldError('login-email');
    }

    if (!passwordField.value || passwordField.value.length < 8) {
      setFieldError('login-password', 'Please enter a password with at least 8 characters');
      valid = false;
    } else {
      clearFieldError('login-password');
    }

    if (valid) {
      showToast('Signed in successfully (mock)');
      e.target.reset();
    }
  });

  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    let valid = true;

    function validateField(id, message) {
      const input = form.querySelector(`[name="${id}"]`);
      if (!input || !input.value || !input.checkValidity()) {
        setFieldError(input.id, message);
        valid = false;
      } else {
        clearFieldError(input.id);
      }
    }

    validateField('firstName', 'First name is required');
    validateField('lastName', 'Last name is required');
    validateField('email', 'Please enter a valid email address');

    const passwordInput = form.querySelector('input[name="password"]');
    if (!passwordInput || passwordInput.value.length < 8) {
      setFieldError('reg-password', 'Password must be at least 8 characters');
      valid = false;
    } else {
      clearFieldError('reg-password');
    }

    const termsCheckbox = form.querySelector('#reg-terms');
    if (!termsCheckbox.checked) {
      setFieldError('reg-terms', 'You must agree to the terms');
      valid = false;
    } else {
      clearFieldError('reg-terms');
    }

    if (valid) {
      showToast('Account created successfully (mock)');
      form.reset();
      switchForm('login');
    }
  });

  document.getElementById('forgotForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const emailField = e.target.email;
    if (!emailField.value || !emailField.checkValidity()) {
      setFieldError('forgot-email', 'Please enter your registered email');
    } else {
      clearFieldError('forgot-email');
      showToast('Password reset link sent (mock)');
      forgotModal.classList.remove('active');
      e.target.reset();
    }
  });

  function setFieldError(id, message) {
    const el = document.querySelector(`[data-error-for="${id}"]`);
    if (el) {
      el.textContent = message;
    }
  }

  function clearFieldError(id) {
    const el = document.querySelector(`[data-error-for="${id}"]`);
    if (el) {
      el.textContent = '';
    }
  }

});
