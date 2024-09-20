// public/js/profile.js

import { showLoading, hideLoading } from '../../modules/loader/index.js';
import FormBuilder from '../../components/form.js';

document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const modal = document.getElementById('message-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const submitButton = document.createElement('button');
    submitButton.classList.add('form-button', 'color-primary');
    submitButton.textContent = 'Guardar';

    let formBuilder = null;

    const formConfig = [
        { label: 'Nombre', id: 'name', type: 'text', required: true },
        { label: 'Contraseña actual', id: 'currentPassword', type: 'password', required: false },
        { label: 'Nueva contraseña', id: 'password', type: 'password', required: false },
        { label: 'Confirmar nueva contraseña', id: 'passwordConfirm', type: 'password', required: false },
    ];

    init();

    function init() {
        fetchProfile();
        editProfileBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        submitButton.addEventListener('click', handleFormSubmit);
    }

    function fetchProfile() {
        fetch('/api/admin/profile')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('profile-name').value = data.data.name;
                    document.getElementById('profile-email').value = data.data.email;
                    document.getElementById('profile-rol').value = data.data.role;
                } else {
                    alert('Error al obtener el perfil');
                }
            })
            .catch(error => console.error('Error al obtener el perfil:', error));
    }

    function openModal() {
        modalTitle.textContent = 'Editar Perfil';
        modalBody.innerHTML = '';

        formBuilder = new FormBuilder(formConfig, 'profileForm');
        const formElement = formBuilder.createForm();
        modalBody.appendChild(formElement);
        formElement.appendChild(submitButton);

        // Prellenar el campo 'Nombre' con el valor actual
        document.getElementById('name').value = document.getElementById('profile-name').value;

        modal.style.display = 'flex';
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        if (formBuilder.validateForm('add')) {
            const data = {
                name: document.getElementById('name').value.trim(),
                currentPassword: document.getElementById('currentPassword').value,
                password: document.getElementById('password').value,
                passwordConfirm: document.getElementById('passwordConfirm').value,
            };

            showLoading();

            fetch('/api/admin/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'CSRF-Token': csrfToken,
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(responseData => {
                    if (responseData.success) {
                        fetchProfile();
                        closeModal();
                        alert('Perfil actualizado exitosamente');
                    } else {
                        alert(responseData.message);
                    }
                })
                .catch(error => console.error('Error al actualizar el perfil:', error))
                .finally(() => hideLoading());
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        modalBody.innerHTML = '';
    }
});
