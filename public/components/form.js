// components/form.js
export default class FormBuilder {
    constructor(config, formId) {
        this.config = config;
        this.formId = formId;
    }

    createForm() {
        const form = document.createElement('form');
        form.id = this.formId;
        form.classList.add('contact-form');

        this.config.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.classList.add('form-group');

            const label = document.createElement('label');
            label.setAttribute('for', field.id);
            label.textContent = field.label;
            label.classList.add('form-label');
            formGroup.appendChild(label);

            let input;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
            } else if (field.type === 'select') {
                input = document.createElement('select');
                // Añadir opción por defecto deshabilitada
                if (field.placeholder) {
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = field.placeholder;
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    input.appendChild(defaultOption);
                }
                // Añadir opciones al select
                field.options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option.value;
                    opt.textContent = option.text;
                    input.appendChild(opt);
                });
            } else {
                input = document.createElement('input');
                input.type = field.type;
            }
            input.id = field.id;
            input.name = field.id;
            input.classList.add('form-input');
            if (field.required) {
                input.setAttribute('aria-required', 'true');
                input.setAttribute('aria-describedby', `error-${field.id}`);
            }
            formGroup.appendChild(input);

            const errorSpan = document.createElement('span');
            errorSpan.id = `error-${field.id}`;
            errorSpan.classList.add('error-message');
            formGroup.appendChild(errorSpan);

            form.appendChild(formGroup);
        });

        return form;
    }

    validateURL(value) {
        try {
            new URL(value);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Método de validación de email
    validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    // Método de validación de contraseña
    validatePassword(value) {
        // Expresión regular para validar la contraseña
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{6,}$/;
        return passwordRegex.test(value);
    }

    validateForm(mode) {
        let isValid = true;
        this.config.forEach(field => {
            const input = document.getElementById(field.id);
            const errorElement = document.getElementById(`error-${field.id}`);

            if (field.type === 'file') {
                // La validación del archivo se maneja por FilePond
                return;
            }

            // Resetear mensajes de error
            input.classList.remove('error');
            errorElement.textContent = '';

            // Validación general de campos requeridos
            if (field.required) {
                if (!input.value) {
                    input.classList.add('error');
                    errorElement.textContent = `${field.label} es obligatorio.`;
                    isValid = false;
                    return; // Saltar a la siguiente iteración
                }
                if (input.value.trim() === '') {
                    input.classList.add('error');
                    errorElement.textContent = `${field.label} es obligatorio.`;
                    isValid = false;
                    return; // Saltar a la siguiente iteración
                }
            }

            // Validaciones específicas por tipo de campo
            if (input.value.trim() !== '') {
                if (field.type === 'file') {
                    // La validación del archivo se maneja por FilePond
                    return;
                }
                if (field.type === 'email') {
                    if (!this.validateEmail(input.value.trim())) {
                        input.classList.add('error');
                        errorElement.textContent = 'Ingresa un email válido.';
                        isValid = false;
                    }
                } else if (field.type === 'select') {
                    if (input.value === '') {
                        input.classList.add('error');
                        errorElement.textContent = `${field.label} es obligatorio.`;
                        isValid = false;
                    }
                } else if (field.id === 'url') {
                    if (!this.validateURL(input.value.trim())) {
                        input.classList.add('error');
                        errorElement.textContent = 'Ingresa una URL válida.';
                        isValid = false;
                    }
                }
            }
        });

        // Validar contraseñas
        const passwordInput = document.getElementById('password');
        const passwordConfirmInput = document.getElementById('passwordConfirm');
        const passwordErrorElement = document.getElementById(`error-password`);
        const passwordConfirmErrorElement = document.getElementById(`error-passwordConfirm`);

        if (passwordInput) {
            passwordInput.classList.remove('error');
        }

        if (passwordErrorElement) {
            passwordErrorElement.classList.remove('error');
        }

        if (passwordConfirmInput) {
            passwordConfirmInput.classList.remove('error');
        }

        if (passwordConfirmErrorElement) {
            passwordConfirmErrorElement.classList.remove('error');
        }

        if (mode === 'add') {
            // En modo agregar, las contraseñas son obligatorias
            if (passwordInput.value.trim() === '') {
                passwordInput.classList.add('error');
                passwordErrorElement.textContent = 'La contraseña es obligatoria.';
                isValid = false;
            } else if (!this.validatePassword(passwordInput.value.trim())) {
                passwordInput.classList.add('error');
                passwordErrorElement.textContent = 'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, un número y un carácter especial.';
                isValid = false;
            }

            if (passwordConfirmInput.value.trim() === '') {
                passwordConfirmInput.classList.add('error');
                passwordConfirmErrorElement.textContent = 'Confirma tu contraseña.';
                isValid = false;
            } else if (passwordInput.value !== passwordConfirmInput.value) {
                passwordConfirmInput.classList.add('error');
                passwordConfirmErrorElement.textContent = 'Las contraseñas no coinciden.';
                isValid = false;
            }
        } else if (mode === 'edit') {
            // En modo edición, las contraseñas son opcionales
            if (passwordInput.value.trim() !== '' || passwordConfirmInput.value.trim() !== '') {
                // Si uno de los dos campos tiene valor, ambos son requeridos y deben coincidir
                if (passwordInput.value.trim() === '') {
                    passwordInput.classList.add('error');
                    passwordErrorElement.textContent = 'La contraseña es obligatoria.';
                    isValid = false;
                } else if (!this.validatePassword(passwordInput.value.trim())) {
                    passwordInput.classList.add('error');
                    passwordErrorElement.textContent = 'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, un número y un carácter especial.';
                    isValid = false;
                }

                if (passwordConfirmInput.value.trim() === '') {
                    passwordConfirmInput.classList.add('error');
                    passwordConfirmErrorElement.textContent = 'Confirma tu contraseña.';
                    isValid = false;
                } else if (passwordInput.value !== passwordConfirmInput.value) {
                    passwordConfirmInput.classList.add('error');
                    passwordConfirmErrorElement.textContent = 'Las contraseñas no coinciden.';
                    isValid = false;
                }
            }
        }

        return isValid;
    }
}
