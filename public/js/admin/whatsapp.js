document.addEventListener('DOMContentLoaded', () => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  const form = document.getElementById('whatsapp-form');
  const urlInput = document.getElementById('whatsapp-url');
  const messageInput = document.getElementById('whatsapp-message');
  const activeCheckbox = document.getElementById('whatsapp-active');

  // Cargar la configuración de WhatsApp existente
  fetch('/api/admin/whatsapp')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const { url, message, active } = data.data;
        urlInput.value = url || '';
        messageInput.value = message || '';
        activeCheckbox.checked = active;
      } else {
        console.error('No se encontró una configuración activa de WhatsApp');
      }
    })
    .catch((error) => console.error('Error al obtener la configuración de WhatsApp:', error));

  // Enviar la configuración actualizada
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const url = urlInput.value.trim();
    const message = messageInput.value.trim();
    const active = activeCheckbox.checked;

    // Validación simple antes de enviar
    if (!url || !message) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    fetch('/api/admin/whatsapp', {
      method: 'PUT',  // Asegúrate de que se está utilizando el método PUT
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken
      },
      body: JSON.stringify({ url, message, active })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Configuración de WhatsApp actualizada correctamente');
        } else {
          console.error('Error al actualizar la configuración de WhatsApp:', data.error);
          alert('Error al actualizar la configuración de WhatsApp');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error al actualizar la configuración de WhatsApp');
      });
  });
});
