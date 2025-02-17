
export class Auth {
  constructor() {
    this.sessionDuration = 30 * 60 * 1000; // 30 minutos
    this.init();
  }

  init() {
    this.checkSession();
    this.setupListeners();
  }

  setupListeners() {
    const passwordInput = document.getElementById('adminPassword');
    if (passwordInput) {
      passwordInput.addEventListener('input', (e) => this.validatePassword(e.target.value));
    }
  }

  validatePassword(password) {
    const feedback = document.querySelector('.password-feedback');
    if (!feedback) return;

    if (password.length < 8) {
      feedback.textContent = 'La contraseña debe tener al menos 8 caracteres';
      feedback.classList.add('error');
    } else {
      feedback.textContent = '';
      feedback.classList.remove('error');
    }
  }

  async login(password) {
    if (password === 'Samuel123') {
      this.startSession();
      await this.showLoader();
      return true;
    }
    this.showError('Contraseña incorrecta');
    return false;
  }

  startSession() {
    const session = {
      timestamp: Date.now(),
      expires: Date.now() + this.sessionDuration
    };
    localStorage.setItem('adminSession', JSON.stringify(session));
  }

  checkSession() {
    const session = JSON.parse(localStorage.getItem('adminSession'));
    if (session && Date.now() < session.expires) {
      return true;
    }
    localStorage.removeItem('adminSession');
    return false;
  }

  async showLoader() {
    const loader = document.createElement('div');
    loader.className = 'loader-overlay';
    loader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loader);

    return new Promise(resolve => {
      setTimeout(() => {
        loader.remove();
        resolve();
      }, 1500);
    });
  }

  showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }, 100);
  }
}
