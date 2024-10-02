// /js/admin/news.js
import { showLoading, hideLoading } from '../../modules/loader/index.js';
import FormBuilder from '../../components/form.js';

// Asegúrate de que ClassicEditor está disponible globalmente
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Font,
  FileRepository,
  Link,
  MediaEmbed,
  Heading,
  List,
  Indent,
  Table,
  TableToolbar,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageUpload,
  Alignment,
  BlockQuote // Asegúrate de importar BlockQuote
} from 'ckeditor5';
document.addEventListener('DOMContentLoaded', () => {
  // Variables globales
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  const confirmModal = document.getElementById('message-modal');
  const modalContent = document.getElementById('modal-content');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeModalBtn = document.querySelector('.close');
  const addButton = document.getElementById('add-btn');
  const submitButton = document.createElement('button');
  submitButton.classList.add('form-button', 'color-primary');
  submitButton.textContent = 'Guardar';

  // Botón de confirmación
  const confirmBtn = document.createElement('button');
  confirmBtn.id = 'modal-confirm-btn';
  confirmBtn.className = 'confirm-btn color-primary';
  confirmBtn.textContent = 'Confirmar';

  let table = null;
  let formBuilder = null;
  let editorInstance = null;
  let currentMode = null; // 'add' o 'edit'
  let currentId = null;
  let newStatus = null;

  // Configuraciones del formulario para 'Agregar' y 'Editar'
  const formConfigAdd = [
    { label: 'Título', id: 'title', type: 'text', required: true },
    { label: 'Subtítulo', id: 'subtitle', type: 'text', required: false },
    { label: 'Autor', id: 'author', type: 'text', required: true },
    { label: 'Contenido', id: 'content', type: 'textarea', required: true }, // No requerido al agregar
  ];

  const formConfigEdit = [
    { label: 'Título', id: 'title', type: 'text', required: true },
    { label: 'Subtítulo', id: 'subtitle', type: 'text', required: false },
    { label: 'Autor', id: 'author', type: 'text', required: true },
    { label: 'Contenido', id: 'content', type: 'textarea', required: true }, // Requerido al editar
  ];

  init();

  function init() {
    initializeTable();
    initializeFilters();
    initializeEventHandlers();
  }

  function initializeTable() {
    table = new Tabulator("#newsTable", {
      ajaxURL: "/api/admin/news",
      pagination: true,
      paginationSize: 8,
      paginationSizeSelector: [8, 10, 15, 20],
      layout: "fitColumns",
      responsiveLayout: "collapse",
      rowHeader: {
        formatter: "responsiveCollapse",
        width: 30,
        minWidth: 30,
        hozAlign: "center",
        resizable: false,
        headerSort: false
      },
      langs: {
        "es-CO": {
          "pagination": {
            "first": "Primero",
            "first_title": "Primera página",
            "last": "Último",
            "last_title": "Última página",
            "prev": "Anterior",
            "prev_title": "Página anterior",
            "next": "Siguiente",
            "next_title": "Página siguiente",
            "page_size": "Cantidad"
          },
          "data": {
            "loading": "Cargando...",
            "error": "Error"
          }
        }
      },
      locale: "es-CO",
      columns: [
        {
          title: "Título",
          field: "title",
          minWidth: 200,
          hozAlign: "center",
          vertAlign: "middle",
          resizable: false,
          frozen: true
        },
        {
          title: "Autor",
          field: "author",
          hozAlign: "center",
          vertAlign: "middle",
          resizable: false,
          frozen: true,
          minWidth: 150
        },
        {
          title: "Creación",
          field: "insert",
          formatter: (cell) => {
            const date = new Date(cell.getValue());
            return date.toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          hozAlign: "center",
          vertAlign: "middle",
          resizable: false,
          frozen: true
        },
        {
          title: "Acciones",
          field: "_id",
          formatter: (cell) => {
            const rowData = cell.getData();
            return `
              <div class='d-flex flex-direction-column'>
                <button class="edit-btn w-100 sm" data-id="${rowData._id}">Editar</button>  
                <button class="toggle-status-btn w-100 sm" data-id="${rowData._id}" data-active="${rowData.active}">${rowData.active ? 'Inactivar' : 'Activar'}</button>
              </div>
            `;
          },
          width: 150,
          hozAlign: "center",
          vertAlign: "middle",
          resizable: false,
          frozen: true
        }
      ],
      ajaxResponse: function (url, params, response) {
        return response.data;
      },
    });
  }

  function initializeFilters() {
    let isActiveFilter = false;

    document.getElementById("search-all").addEventListener("input", applyFilters);
    document.getElementById("toggle-status").addEventListener("change", (e) => {
      isActiveFilter = e.target.checked;
      applyFilters();
    });

    function applyFilters() {
      const value = document.getElementById("search-all").value;
      const normalizedValue = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      table.setFilter((data) => {
        let passesSearch = false;

        for (let key in data) {
          const normalizedData = String(data[key]).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          if (normalizedData.includes(normalizedValue)) {
            passesSearch = true;
            break;
          }
        }

        return passesSearch && (!isActiveFilter || data.active);
      });
    }
  }

  function initializeEventHandlers() {
    document.getElementById('newsTable').addEventListener('click', handleTableClick);
    addButton.addEventListener('click', () => openModal('add'));
    closeModalBtn.addEventListener('click', closeModal);
    submitButton.addEventListener('click', handleFormSubmit);
    confirmBtn.addEventListener('click', handleConfirm);
  }

  function handleTableClick(event) {
    const target = event.target;

    if (target.classList.contains('edit-btn')) {
      const id = target.getAttribute('data-id');
      fetch(`/api/admin/news/${id}`)
        .then(response => response.json())
        .then(data => {
          openModal('edit', data.data);
        })
        .catch(error => console.error('Error al obtener datos:', error));
    } else if (target.classList.contains('toggle-status-btn')) {
      const id = target.getAttribute('data-id');
      const isActive = target.getAttribute('data-active') === 'true';
      const status = !isActive;
      openConfirmModal(id, status, isActive);
    }
  }

  function openModal(mode, data = {}) {
    modalContent.classList.remove('modal-sm');
    currentMode = mode;
    currentId = data._id || null;

    modalTitle.textContent = mode === 'edit' ? 'Editar noticia' : 'Agregar nueva noticia';
    modalBody.innerHTML = '';

    // Seleccionar la configuración correcta
    const currentFormConfig = mode === 'edit' ? formConfigEdit : formConfigAdd;

    formBuilder = new FormBuilder(currentFormConfig, 'newsForm');
    const formElement = formBuilder.createForm();
    modalBody.appendChild(formElement);
    formElement.appendChild(submitButton);

    if (mode === 'edit') {
      document.getElementById('title').value = data.title;
      document.getElementById('subtitle').value = data.subtitle || '';
      document.getElementById('author').value = data.author;
      // El contenido se asignará después de inicializar el editor
    }

    ClassicEditor.create(document.querySelector('#content'), {
      language: 'es', // Configuración en español
      plugins: [
        Essentials, Bold, Italic, Font, FileRepository,
        Link, MediaEmbed, Heading, List, Indent, Table, TableToolbar,
        Image, ImageToolbar, ImageCaption, ImageStyle, ImageUpload,
        Alignment, BlockQuote // Agregar BlockQuote
      ],
      toolbar: [
        'undo', 'redo', '|', 'heading', 'fontSize', 'fontFamily', 'fontColor',
        'fontBackgroundColor', 'bold', 'italic', 'alignment', '|', 'link',
        'imageUpload', 'mediaEmbed', '|', 'bulletedList', 'numberedList',
        'outdent', 'indent', '|', 'insertTable', 'blockQuote' // Asegurarse de que BlockQuote esté aquí
      ],
      heading: {
        options: [
          { model: 'paragraph', title: 'Párrafo', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Encabezado 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Encabezado 2', class: 'ck-heading_heading2' },
          { model: 'heading3', view: 'h3', title: 'Encabezado 3', class: 'ck-heading_heading3' }
        ]
      },
      image: {
        resizeOptions: [
          {
            name: 'resizeImage:original',
            label: 'Default image width',
            value: null,
          },
          {
            name: 'resizeImage:50',
            label: '50% page width',
            value: '50',
          },
          {
            name: 'resizeImage:75',
            label: '75% page width',
            value: '75',
          },
        ],
        toolbar: [
          'imageTextAlternative',
          'toggleImageCaption',
          '|',
          'imageStyle:inline',
          'imageStyle:wrapText',
          'imageStyle:breakText',
          '|',
          'resizeImage',
        ],
      },
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
      },
      link: {
        decorators: {
          isExternal: {
            mode: 'manual',
            label: 'Abrir en nueva pestaña',
            attributes: {
              target: '_blank',
              rel: 'noopener noreferrer'
            }
          }
        }
      },
      mediaEmbed: {
        previewsInData: true
      }
    })
      .then(editor => {
        editorInstance = editor;
        if (mode === 'edit') {
          editor.setData(data.content);
        }

        // Implementar el adaptador de subida personalizado
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
          return new MyUploadAdapter(loader);
        };
      })
      .catch(error => {
        console.error('Error al inicializar el editor:', error);
      });


    confirmModal.style.display = 'flex';
  }

  // Definir la clase del adaptador de subida personalizado
  class MyUploadAdapter {
    constructor(loader) {
      this.loader = loader;
      this.url = `/api/admin/upload-image/news`; // Ajusta el folder según corresponda
    }

    // Método para subir el archivo
    upload() {
      return this.loader.file
        .then(file => new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('urlImage', file); // Nombre del campo según tu configuración de Multer

          fetch(this.url, {
            method: 'POST',
            body: formData,
            headers: {
              'CSRF-Token': csrfToken, // Asegúrate de incluir el token CSRF si es necesario
            },
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                resolve({
                  default: `/images/news/${data.filePath}`, // Ajusta la ruta según tu estructura
                });
              } else {
                reject(data.message || 'Error al subir la imagen.');
              }
            })
            .catch(error => {
              console.error('Error al subir la imagen:', error);
              reject('Error al subir la imagen.');
            });
        }));
    }

    // Método para abortar la subida (opcional)
    abort() {
      // Implementar si necesitas soportar la cancelación de subidas
    }
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    // Sincronizar el contenido de CKEditor con el <textarea>
    const contentTextarea = document.getElementById('content');
    contentTextarea.value = editorInstance.getData();

    // Validación adicional si es necesario
    if (currentMode === 'edit') {
      const content = contentTextarea.value.trim();
      if (content === '') {
        alert('Contenido es requerido');
        return;
      }
    }

    if (formBuilder.validateForm()) {
      const data = {
        title: document.getElementById('title').value,
        subtitle: document.getElementById('subtitle').value,
        author: document.getElementById('author').value,
        content: contentTextarea.value,
      };

      showLoading();

      const fetchOptions = {
        method: currentMode === 'edit' ? 'PUT' : 'POST',
        body: JSON.stringify(data),
        headers: {
          'CSRF-Token': csrfToken,
          'Content-Type': 'application/json',
        }
      };

      const endpoint = currentMode === 'edit' ? `/api/admin/news/${currentId}` : '/api/admin/news/add';

      fetch(endpoint, fetchOptions)
        .then(response => response.json())
        .then(responseData => {
          if (responseData.success) {
            table.setData();
            closeModal();
          }
        })
        .catch(error => console.error('Error:', error))
        .finally(() => hideLoading());
    }
  }

  function openConfirmModal(id, status, isActive) {
    modalContent.classList.add('modal-sm');
    currentId = id;
    newStatus = status;

    modalTitle.textContent = 'Confirmación';
    modalBody.innerHTML = `<p>¿Estás seguro que deseas <b>${isActive ? 'inactivar' : 'activar'}</b> esta noticia?</p>`;
    modalBody.appendChild(confirmBtn);

    confirmModal.style.display = 'flex';
  }

  function handleConfirm() {
    if (currentId !== null) {
      showLoading();

      fetch(`/api/admin/news/${currentId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken
        },
        body: JSON.stringify({ active: newStatus })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            table.setData();
            closeModal();
          }
        })
        .catch(error => console.error('Error:', error))
        .finally(() => hideLoading());
    }
  }

  function closeModal() {
    confirmModal.style.display = 'none';
    modalBody.innerHTML = '';
    if (editorInstance) {
      editorInstance.destroy()
        .then(() => {
          editorInstance = null;
        })
        .catch(error => {
          console.error('Error al destruir el editor:', error);
        });
    }
  }
});
