document.addEventListener('DOMContentLoaded', () => {
  const authCard = document.getElementById('authCard');
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const mobileTabs = document.querySelectorAll('.mobile-tab');
  const tabIndicator = document.getElementById('tabIndicator');
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  const forgotModal = document.getElementById('forgotModal');
  const forgotClose = document.getElementById('forgotClose');
  const toast = document.getElementById('toast');

  // Switch between login and register panels
  function switchPanel(target) {
    if (window.innerWidth >= 720) {
      // Desktop: toggle class on authCard
      if (target === 'register') {
        authCard.classList.add('register-active');
        loginPanel.setAttribute('aria-hidden', 'true');
        registerPanel.setAttribute('aria-hidden', 'false');
      } else {
        authCard.classList.remove('register-active');
        loginPanel.setAttribute('aria-hidden', 'false');
        registerPanel.setAttribute('aria-hidden', 'true');
      }
    } else {
      // Mobile: toggle visible panel and tabs
      mobileTabs.forEach(tab => {
        const isActive = tab.dataset.switch === target;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive.toString());
      });
      if (target === 'register') {
        loginPanel.setAttribute('aria-hidden', 'true');
        registerPanel.setAttribute('aria-hidden', 'false');
        tabIndicator.style.transform = 'translateX(100%)';
      } else {
        loginPanel.setAttribute('aria-hidden', 'false');
        registerPanel.setAttribute('aria-hidden', 'true');
        tabIndicator.style.transform = 'translateX(0)';
      }
    }
  }

  // Initialize state
  function adaptToViewport() {
    if (window.innerWidth >= 720) {
      // Desktop default to login
      switchPanel('login');
    } else {
      // Mobile default to login
      switchPanel('login');
    }
  }
  adaptToViewport();

  window.addEventListener('resize', adaptToViewport);

  // Mobile tab click handlers
  mobileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchPanel(tab.dataset.switch);
    });
  });

  // Switch buttons on form panels and overlay
  document.querySelectorAll('[data-switch]').forEach(btn => {
    btn.addEventListener('click', () => {
      switchPanel(btn.dataset.switch);
    });
  });

  // Toggle password visibility
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
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

  // Avatar image upload preview and remove for register form
  const regAvatarInput = document.getElementById('reg-avatar');
  const regAvatarPreview = document.getElementById('regAvatarPreview');
  const regAvatarInitials = document.getElementById('regAvatarInitials');
  const regAvatarRemoveBtn = document.getElementById('regAvatarRemove');

  function updateAvatarPreview(file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        regAvatarPreview.style.backgroundImage = `url('${e.target.result}')`;
        regAvatarPreview.textContent = '';
      };
      reader.readAsDataURL(file);
      regAvatarRemoveBtn.style.display = 'inline-block';
    } else {
      regAvatarPreview.style.backgroundImage = 'none';
      regAvatarPreview.textContent = 'FO';
      regAvatarRemoveBtn.style.display = 'none';
    }
  }

  regAvatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    updateAvatarPreview(file);
  });

  regAvatarRemoveBtn.addEventListener('click', () => {
    regAvatarInput.value = '';
    updateAvatarPreview(null);
  });

  // Password strength meter for register password
  const regPasswordInput = document.getElementById('reg-password');
  const passwordStrength = document.getElementById('passwordStrength');
  const strengthBars = passwordStrength.querySelectorAll('.strength-bars span');
  const strengthLabel = passwordStrength.querySelector('.strength-label');

  function evaluatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    return score;
  }

  regPasswordInput.addEventListener('input', () => {
    const pwd = regPasswordInput.value;
    const score = evaluatePasswordStrength(pwd);
    strengthBars.forEach((bar, idx) => {
      bar.classList.toggle('filled', idx < score);
    });
    const strengthTexts = ['Very weak', 'Weak', 'Medium', 'Strong', 'Very strong'];
    strengthLabel.textContent = pwd ? `Password strength: ${strengthTexts[score]}` : 'Password strength';
  });

  // Form validation and submission (fake) for login
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.elements['email'];
    const password = loginForm.elements['password'];
    let valid = true;

    // Clear errors
    loginForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');

    if (!email.value || !email.checkValidity()) {
      loginForm.querySelector('[data-error-for="login-email"]').textContent = 'Please enter a valid email.';
      valid = false;
    }

    if (!password.value || password.value.length < 8) {
      loginForm.querySelector('[data-error-for="login-password"]').textContent = 'Password must be at least 8 characters.';
      valid = false;
    }

    if (valid) {
      showToast('Successfully signed in!');
      loginForm.reset();
    }
  });

  // Form validation and submission (fake) for register
  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = registerForm.elements['firstName'];
    const lastName = registerForm.elements['lastName'];
    const email = registerForm.elements['email'];
    const password = registerForm.elements['password'];
    const terms = registerForm.elements['terms'];
    let valid = true;

    // Clear errors
    registerForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');

    if (!firstName.value.trim()) {
      registerForm.querySelector('[data-error-for="reg-first"]').textContent = 'First name is required.';
      valid = false;
    }

    if (!lastName.value.trim()) {
      registerForm.querySelector('[data-error-for="reg-last"]').textContent = 'Last name is required.';
      valid = false;
    }

    if (!email.value || !email.checkValidity()) {
      registerForm.querySelector('[data-error-for="reg-email"]').textContent = 'Please enter a valid email.';
      valid = false;
    }

    if (!password.value || password.value.length < 8) {
      registerForm.querySelector('[data-error-for="reg-password"]').textContent = 'Password must be at least 8 characters.';
      valid = false;
    }

    if (!terms.checked) {
      terms.focus();
      showToast('You must agree to the Terms & Privacy Policy.');
      valid = false;
    }

    if (valid) {
      showToast('Account created successfully!');
      registerForm.reset();
      regAvatarPreview.style.backgroundImage = 'none';
      regAvatarPreview.textContent = 'FO';
      regAvatarRemoveBtn.style.display = 'none';
      passwordStrength.querySelectorAll('.strength-bars span').forEach(bar => bar.classList.remove('filled'));
      strengthLabel.textContent = 'Password strength';
    }
  });

  // Forgot password modal toggling
  forgotPasswordBtn.addEventListener('click', () => {
    forgotModal.hidden = false;
    forgotModal.querySelector('[name=email]').focus();
  });

  forgotClose.addEventListener('click', () => {
    forgotModal.hidden = true;
    clearForgotForm();
  });

  forgotModal.addEventListener('click', (e) => {
    if (e.target === forgotModal) {
      forgotModal.hidden = true;
      clearForgotForm();
    }
  });

  // Forgot form submission (fake)
  const forgotForm = document.getElementById('forgotForm');
  forgotForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = forgotForm.elements['email'];
    const errorEl = forgotForm.querySelector('[data-error-for="forgot-email"]');
    errorEl.textContent = '';
    if (!email.value || !email.checkValidity()) {
      errorEl.textContent = 'Please enter a valid email.';
      email.focus();
      return;
    }
    showToast('Reset link sent! Please check your email.');
    forgotModal.hidden = true;
    forgotForm.reset();
  });

  function clearForgotForm() {
    forgotForm.reset();
    forgotForm.querySelector('[data-error-for="forgot-email"]').textContent = '';
  }

  // Toast notification
  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.hidden = true;
      }, 300);
    }, 3500);
  }

  // Theme toggle
  const themeToggleBtn = document.querySelector('.theme-toggle');
  const htmlElement = document.documentElement;

  // Set initial theme
  let currentTheme = localStorage.getItem('theme') || 'light';
  htmlElement.setAttribute('data-theme', currentTheme);
  themeToggleBtn.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
  updateThemeToggleIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    currentTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    themeToggleBtn.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
    updateThemeToggleIcon(currentTheme);
    localStorage.setItem('theme', currentTheme);
  });

  function updateThemeToggleIcon(theme) {
    if (theme === 'dark') {
      themeToggleBtn.title = 'Switch to light theme';
    } else {
      themeToggleBtn.title = 'Switch to dark theme';
    }
  }

});
