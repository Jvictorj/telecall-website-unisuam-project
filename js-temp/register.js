/**
 * Registration Manager
 * Gerencia validação de formulário de cadastro com máscara de entrada e integração com API ViaCEP
 */

const RegistrationManager = (() => {
  const CONFIG = {
    FIELDS: {
      firstName: 'nome',
      motherName: 'nomematerno',
      cpf: 'cpf',
      email: 'email',
      phone: 'telfix',
      birthDate: 'nasc',
      cep: 'cep',
      address: 'logradouro',
      state: 'estado',
      city: 'cidade',
      neighborhood: 'bairro',
      complement: 'comp',
      login: 'login',
      password: 'senha',
      passwordConfirm: 'senhaconfirm',
      cellPhone: 'telcel'
    },
    ERROR_CONTAINER_ID: 'errorContainer',
    ERROR_MESSAGE_ID: 'mensagemErro',
    SUCCESS_MESSAGE_ID: 'mensagemCadastro',
    STORAGE_KEY: 'usuario',
    MESSAGE_TIMEOUT: 3000,
    REDIRECT_DELAY: 3000,
    REDIRECT_URL: 'login.html',
    VIACEP_URL: 'https://viacep.com.br/ws'
  };

  const VALIDATION_RULES = {
    firstName: { minLength: 15, required: true },
    motherName: { required: true },
    email: { required: true, pattern: /^[A-Za-z0-9._%+-]+@(gmail|hotmail|outlook)\.(com|com\.br)$/ },
    phone: { required: true, minLength: 10 },
    birthDate: { required: true },
    cep: { required: true, minLength: 8 },
    address: { required: true },
    state: { required: true },
    city: { required: true },
    neighborhood: { required: true },
    complement: { required: true },
    login: { required: true, minLength: 6, pattern: /^[a-zA-Z]+$/ },
    password: { required: true, minLength: 8, pattern: /^[a-zA-Z]+$/ },
    passwordConfirm: { required: true },
    cellPhone: { required: true, minLength: 11 }
  };

  const MESSAGES = {
    firstNameTooShort: 'Nome deve ter no mínimo 15 caracteres',
    motherNameRequired: 'Digite um nome materno válido',
    emailInvalid: 'Digite um email válido',
    phoneRequired: 'Digite um telefone fixo válido contendo apenas números',
    phoneTooShort: 'Digite um telefone fixo válido',
    birthDateRequired: 'Digite uma data de nascimento válida',
    cepTooShort: 'Digite um CEP válido',
    addressRequired: 'Digite um logradouro válido',
    stateRequired: 'Digite um estado válido',
    cityRequired: 'Digite uma cidade válida',
    neighborhoodRequired: 'Digite um bairro válido',
    complementRequired: 'Digite um complemento válido',
    loginAlphabeticOnly: 'Login deve conter apenas caracteres alfabéticos',
    passwordAlphabeticOnly: 'Senha deve conter apenas caracteres alfabéticos',
    loginTooShort: 'Login deve ter no mínimo 6 caracteres',
    passwordTooShort: 'Senha deve ter no mínimo 8 caracteres',
    passwordMismatch: 'As senhas não coincidem',
    cellPhoneRequired: 'Digite um telefone celular válido contendo apenas números',
    cellPhoneTooShort: 'Digite um telefone celular válido',
    validationFailed: 'O cadastro não foi validado. Corrija os erros e tente novamente.',
    registrationSuccess: 'Cadastro realizado com sucesso!'
  };

  /**
   * Inicializa o gerenciador
   */
  function init() {
    attachEventListeners();
    attachFormSubmit();
  }

  /**
   * Anexa event listeners aos campos de entrada
   */
  function attachEventListeners() {
    const cpfField = document.getElementById(CONFIG.FIELDS.cpf);
    const cellPhoneField = document.getElementById(CONFIG.FIELDS.cellPhone);
    const cepField = document.getElementById(CONFIG.FIELDS.cep);

    if (cpfField) {
      cpfField.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        maskCPF(e.target);
      });
    }

    if (cellPhoneField) {
      cellPhoneField.addEventListener('input', (e) => {
        maskCellPhone(e.target);
      });
    }

    if (cepField) {
      cepField.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
      });
      cepField.addEventListener('change', fillAddressByCEP);
    }
  }

  /**
   * Anexa o evento de submit do formulário
   */
  function attachFormSubmit() {
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        performRegistration();
      });
    }
  }

  /**
   * Realiza o cadastro do usuário
   */
  function performRegistration() {
    const formData = getFormData();
    const errors = validateFormData(formData);

    if (errors.length > 0) {
      displayErrors(errors);
    } else {
      saveUserAndRedirect(formData);
    }
  }

  /**
   * Obtém dados do formulário
   * @returns {Object} Dados do formulário
   */
  function getFormData() {
    const data = {};
    Object.entries(CONFIG.FIELDS).forEach(([key, fieldId]) => {
      const field = document.getElementById(fieldId);
      data[key] = field ? field.value.trim() : '';
    });
    return data;
  }

  /**
   * Valida os dados do formulário
   * @param {Object} data - Dados do formulário
   * @returns {Array} Array de erros
   */
  function validateFormData(data) {
    const errors = [];

    // Validação de primeiro nome
    if (data.firstName.length < VALIDATION_RULES.firstName.minLength) {
      errors.push(MESSAGES.firstNameTooShort);
    }

    // Validação de nome materno
    if (!data.motherName) {
      errors.push(MESSAGES.motherNameRequired);
    }

    // Validação de email
    if (!VALIDATION_RULES.email.pattern.test(data.email)) {
      errors.push(MESSAGES.emailInvalid);
    }

    // Validação de telefone fixo
    if (!isValidPhoneNumber(data.phone)) {
      errors.push(MESSAGES.phoneRequired);
    }
    if (data.phone.length < VALIDATION_RULES.phone.minLength) {
      errors.push(MESSAGES.phoneTooShort);
    }

    // Validação de data de nascimento
    if (!data.birthDate) {
      errors.push(MESSAGES.birthDateRequired);
    }

    // Validação de CEP
    if (data.cep.length < VALIDATION_RULES.cep.minLength) {
      errors.push(MESSAGES.cepTooShort);
    }

    // Validação de endereço
    if (!data.address) errors.push(MESSAGES.addressRequired);
    if (!data.state) errors.push(MESSAGES.stateRequired);
    if (!data.city) errors.push(MESSAGES.cityRequired);
    if (!data.neighborhood) errors.push(MESSAGES.neighborhoodRequired);
    if (!data.complement) errors.push(MESSAGES.complementRequired);

    // Validação de login
    if (!VALIDATION_RULES.login.pattern.test(data.login)) {
      errors.push(MESSAGES.loginAlphabeticOnly);
    }
    if (data.login.length < VALIDATION_RULES.login.minLength) {
      errors.push(MESSAGES.loginTooShort);
    }

    // Validação de senha
    if (!VALIDATION_RULES.password.pattern.test(data.password)) {
      errors.push(MESSAGES.passwordAlphabeticOnly);
    }
    if (data.password.length < VALIDATION_RULES.password.minLength) {
      errors.push(MESSAGES.passwordTooShort);
    }

    // Validação de confirmação de senha
    if (data.password !== data.passwordConfirm) {
      errors.push(MESSAGES.passwordMismatch);
    }

    // Validação de celular
    if (!isValidPhoneNumber(data.cellPhone)) {
      errors.push(MESSAGES.cellPhoneRequired);
    }
    if (data.cellPhone.length < VALIDATION_RULES.cellPhone.minLength) {
      errors.push(MESSAGES.cellPhoneTooShort);
    }

    return errors;
  }

  /**
   * Verifica se o telefone é válido
   * @param {string} phone - Número de telefone
   * @returns {boolean} True se válido
   */
  function isValidPhoneNumber(phone) {
    const regex = /^[\d()+-]+$/;
    const cleanNumber = phone.replace(/[()-\s]/g, '');
    return regex.test(cleanNumber);
  }

  /**
   * Exibe os erros de validação
   * @param {Array} errors - Array de mensagens de erro
   */
  function displayErrors(errors) {
    const container = document.getElementById(CONFIG.ERROR_CONTAINER_ID);
    const messageElement = document.getElementById(CONFIG.ERROR_MESSAGE_ID);

    if (container) {
      container.innerHTML = '';
      errors.forEach(error => {
        const p = document.createElement('p');
        p.textContent = error;
        p.setAttribute('role', 'alert');
        container.appendChild(p);
      });
    }

    if (messageElement) {
      messageElement.textContent = MESSAGES.validationFailed;
      messageElement.style.display = 'block';
      messageElement.setAttribute('role', 'alert');
      messageElement.setAttribute('aria-live', 'assertive');

      setTimeout(() => {
        messageElement.style.display = 'none';
      }, CONFIG.MESSAGE_TIMEOUT);
    }
  }

  /**
   * Salva o usuário e redireciona
   * @param {Object} data - Dados do formulário
   */
  function saveUserAndRedirect(data) {
    const user = {
      login: data.login,
      senha: data.password
    };

    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user));

    const successElement = document.getElementById(CONFIG.SUCCESS_MESSAGE_ID);
    if (successElement) {
      successElement.textContent = MESSAGES.registrationSuccess;
      successElement.style.display = 'block';
      successElement.setAttribute('role', 'alert');
      successElement.setAttribute('aria-live', 'polite');
    }

    setTimeout(() => {
      window.location.href = CONFIG.REDIRECT_URL;
    }, CONFIG.REDIRECT_DELAY);
  }

  /**
   * Formata CPF
   * @param {HTMLElement} element - Campo de CPF
   */
  function maskCPF(element) {
    const value = element.value;
    if (value.length === 11) {
      const formatted = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
      element.value = formatted;
    }
  }

  /**
   * Formata telefone celular
   * @param {HTMLElement} element - Campo de telefone celular
   */
  function maskCellPhone(element) {
    const value = element.value.replace(/\D/g, '');
    
    if (value.length === 11) {
      const formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      element.value = formatted;
    } else {
      element.value = value;
    }
  }

  /**
   * Preenche endereço automaticamente via ViaCEP
   */
  async function fillAddressByCEP() {
    const cepField = document.getElementById(CONFIG.FIELDS.cep);
    const cep = cepField.value.replace(/\D/g, '');

    if (cep.length !== 8) return;

    try {
      const response = await fetch(`${CONFIG.VIACEP_URL}/${cep}/json/`);
      
      if (!response.ok) throw new Error('Erro na requisição');

      const data = await response.json();

      if (data.erro) {
        console.warn('CEP não encontrado');
        return;
      }

      document.getElementById(CONFIG.FIELDS.address).value = data.logradouro || '';
      document.getElementById(CONFIG.FIELDS.state).value = data.uf || '';
      document.getElementById(CONFIG.FIELDS.city).value = data.localidade || '';
      document.getElementById(CONFIG.FIELDS.neighborhood).value = data.bairro || '';
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    }
  }

  return {
    init
  };
})();

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', RegistrationManager.init);
} else {
  RegistrationManager.init();
}
