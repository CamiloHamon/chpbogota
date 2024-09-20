class FormBuilder {
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

    // Método de validación de URL mejorado
    validateURL(value) {
        try {
            new URL(value);
            return true;
        } catch (_) {
            return false;  
        }
    }

    validateForm() {
        let isValid = true;
        this.config.forEach(field => {
            const input = document.getElementById(field.id);
            const errorElement = document.getElementById(`error-${field.id}`);

            if (field.required) {
                if (field.type === 'file') {
                    // La validación del archivo se maneja por FilePond
                    return;
                } else if (field.id === 'url') {
                    // Validar si es un campo URL
                    if (!this.validateURL(input.value.trim())) {
                        input.classList.add('error');
                        errorElement.textContent = 'Ingresa una URL válida.';
                        isValid = false;
                    } else {
                        input.classList.remove('error');
                        errorElement.textContent = '';
                    }
                } else {
                    // Validar otros tipos de inputs (ej. texto, textarea)
                    if (input.value.trim() === '') {
                        input.classList.add('error');
                        errorElement.textContent = `${field.label} es obligatorio.`;
                        isValid = false;
                    } else {
                        input.classList.remove('error');
                        errorElement.textContent = '';
                    }
                }
            }
        });
        return isValid;
    }
}

export default FormBuilder;
