// contactUs.js

import { showLoading, hideLoading } from '../modules/loader/index.js';

document.addEventListener('DOMContentLoaded', function () {
  // Obtener el formulario y sus campos
  const form = document.getElementById('myForm');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const subjectField = document.getElementById('subject');
  const messageField = document.getElementById('message');

  // Obtener los elementos para mostrar mensajes de error
  const errorName = document.getElementById('errorName');
  const errorEmail = document.getElementById('errorEmail');
  const errorSubject = document.getElementById('errorSubject');
  const errorMessage = document.getElementById('errorMessage');

  // Obtener el botón de envío
  const submitButton = document.querySelector('.form-button');

  // Expresión regular para validar el formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Obtener el token CSRF desde el meta tag
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // **Obtener elementos del modal**
  const modal = document.getElementById('message-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = modal.querySelector('.close');

  // Agregar evento al botón de cerrar del modal
  modalClose.addEventListener('click', function() {
    closeModal();
  });

  // Cerrar el modal al hacer clic fuera del contenido
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Agregar evento al enviar el formulario
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir el envío del formulario hasta que se valide
    let isFormValid = true;

    // Limpiar mensajes de error anteriores
    clearErrors();

    // Validar campo Nombre
    if (nameField.value.trim() === '') {
      showError(nameField, errorName, 'El nombre es obligatorio.');
      isFormValid = false;
    }

    // Validar campo Correo Electrónico
    if (emailField.value.trim() === '') {
      showError(emailField, errorEmail, 'El correo es obligatorio.');
      isFormValid = false;
    } else if (!emailRegex.test(emailField.value.trim())) {
      showError(emailField, errorEmail, 'El formato del correo no es válido.');
      isFormValid = false;
    }

    // Validar campo Asunto
    if (subjectField.value.trim() === '') {
      showError(subjectField, errorSubject, 'El asunto es obligatorio.');
      isFormValid = false;
    }

    // Validar campo Mensaje
    if (messageField.value.trim() === '') {
      showError(messageField, errorMessage, 'El mensaje es obligatorio.');
      isFormValid = false;
    }

    // Enviar el formulario si es válido
    if (isFormValid) {
      showLoading();
      // Deshabilitar inputs y botón
      disableForm();

      // Preparar datos para enviar
      const formData = {
        userName: nameField.value.trim(),
        email: emailField.value.trim(),
        subject: subjectField.value.trim(),
        message: messageField.value.trim()
      };

      // Enviar solicitud POST a la API
      fetch('/api/contact/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken // Incluir el token CSRF en el header
        },
        credentials: 'same-origin', // Asegura que las cookies se envíen en la solicitud
        body: JSON.stringify(formData)
      })
        .then(response => {
          // Rehabilitar inputs y botón
          enableForm();

          if (response.ok) {
            // Si la respuesta es exitosa
            // Mostrar el modal con el mensaje de éxito
            showModal('Mensaje enviado', 'Tu mensaje ha sido enviado correctamente.');

            // Reiniciar el formulario
            form.reset();
          } else {
            // Si hay un error en la respuesta
            return response.json().then(data => {
              if (data.errors) {
                // Manejar errores de validación desde el servidor
                handleServerErrors(data.errors);
              } else {
                // Mostrar el modal con el mensaje de error
                showModal('Error', 'Ocurrió un error al enviar tu mensaje. Por favor, intenta de nuevo más tarde.');
              }
            });
          }
        })
        .catch(error => {
          // Rehabilitar inputs y botón
          enableForm();

          console.error('Error:', error);
          // Mostrar el modal con el mensaje de error
          showModal('Error', 'Ocurrió un error al enviar tu mensaje. Por favor, intenta de nuevo más tarde.');
        })
        .finally(() => {
          hideLoading();
        });
    }
  });

  // Función para mostrar el modal
  function showModal(title, message) {
    modalTitle.textContent = title;
    modalBody.innerHTML = `<p>${message}</p>`;
    modal.style.display = 'flex';
  }

  // Función para cerrar el modal
  function closeModal() {
    modal.style.display = 'none';
  }

  // Función para mostrar errores
  function showError(field, errorElement, message) {
    field.classList.add('error'); // Agregar clase de error al campo
    errorElement.textContent = message; // Mostrar mensaje de error
    field.setAttribute('aria-invalid', 'true'); // Atributo de accesibilidad
  }

  // Función para limpiar errores
  function clearErrors() {
    // Remover clases de error de los campos
    nameField.classList.remove('error');
    emailField.classList.remove('error');
    subjectField.classList.remove('error');
    messageField.classList.remove('error');

    // Limpiar mensajes de error
    errorName.textContent = '';
    errorEmail.textContent = '';
    errorSubject.textContent = '';
    errorMessage.textContent = '';

    // Remover atributo aria-invalid
    nameField.removeAttribute('aria-invalid');
    emailField.removeAttribute('aria-invalid');
    subjectField.removeAttribute('aria-invalid');
    messageField.removeAttribute('aria-invalid');
  }

  // Función para deshabilitar inputs y botón
  function disableForm() {
    nameField.disabled = true;
    emailField.disabled = true;
    subjectField.disabled = true;
    messageField.disabled = true;
    submitButton.disabled = true;
  }

  // Función para habilitar inputs y botón
  function enableForm() {
    nameField.disabled = false;
    emailField.disabled = false;
    subjectField.disabled = false;
    messageField.disabled = false;
    submitButton.disabled = false;
  }

  // Función para manejar errores del servidor
  function handleServerErrors(errors) {
    // Iterar sobre los errores y mostrarlos
    for (let key in errors) {
      if (errors.hasOwnProperty(key)) {
        let field = null;
        let errorElement = null;

        switch (key) {
          case 'userName':
            field = nameField;
            errorElement = errorName;
            break;
          case 'email':
            field = emailField;
            errorElement = errorEmail;
            break;
          case 'subject':
            field = subjectField;
            errorElement = errorSubject;
            break;
          case 'message':
            field = messageField;
            errorElement = errorMessage;
            break;
          default:
            break;
        }

        if (field && errorElement) {
          showError(field, errorElement, errors[key].message || 'Entrada inválida.');
        }
      }
    }
  }
});
