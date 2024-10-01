import { showLoading, hideLoading } from '../../modules/loader/index.js';
import FormBuilder from '../../components/form.js';

// Configuración de etiquetas en español para FilePond
const filePondLabelsES = {
    labelIdle: 'Arrastra tu imagen o <span class="filepond--label-action"> Sube una imagen </span>',
    labelFileLoading: 'Cargando...',
    labelFileLoadError: 'Error al cargar el archivo',
    labelFileProcessing: 'Subiendo...',
    labelFileProcessingComplete: 'Subida completada',
    labelFileProcessingAborted: 'Subida cancelada',
    labelFileProcessingError: 'Error al subir el archivo',
    labelTapToCancel: 'Toca para cancelar',
    labelTapToRetry: 'Toca para reintentar',
    labelTapToUndo: 'Toca para deshacer',
    labelButtonRemoveItem: 'Eliminar',
    labelButtonAbortItemLoad: 'Abortar',
    labelButtonRetryItemLoad: 'Reintentar',
    labelButtonAbortItemProcessing: 'Cancelar',
    labelButtonUndoItemProcessing: 'Deshacer',
    labelButtonRetryItemProcessing: 'Reintentar',
    labelButtonProcessItem: 'Subir',
};

document.addEventListener('DOMContentLoaded', () => {
    FilePond.registerPlugin(FilePondPluginImagePreview);

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
    let filePondInstance = null;
    let currentMode = null; // 'add' o 'edit'
    let currentId = null;
    let urlImage = null;
    let newStatus = null;
    let imageChanged = false; // Flag para determinar si la imagen ha sido cambiada
    let currentCheckbox = null; // Referencia al checkbox actual para "Mostrar en Home"

    const formConfig = [
        { label: 'Nombre', id: 'name', type: 'text', required: true },
        { label: 'URL', id: 'url', type: 'text', required: true },
        { label: 'Imagen', id: 'urlImage', type: 'file', required: true }
    ];

    // Objeto para almacenar el estado previo de cada checkbox
    const checkboxStates = {};

    init();

    function init() {
        initializeTable();
        initializeFilters();
        initializeEventHandlers();
    }

    function initializeTable() {
        table = new Tabulator("#linksTable", {
            ajaxURL: "/api/admin/links",
            pagination: true,
            paginationSize: 10,
            paginationSizeSelector: [10, 15, 20],
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
                    title: "Nombre",
                    field: "name",
                    minWidth: 150,
                    hozAlign: "center",
                    vertAlign: "middle",
                    resizable: false,
                    frozen: true
                },
                {
                    title: "URL",
                    field: "url",
                    hozAlign: "center",
                    vertAlign: "middle",
                    resizable: false,
                    frozen: true,
                    formatter: (cell) => {
                        const url = cell.getValue();
                        return `<a href="${url}" target="_blank">${url}</a>`;
                    }
                },
                {
                    title: "Imagen",
                    field: "urlImage",
                    formatter: "image",
                    width: 120,
                    formatterParams: {
                        height: "100%",
                        width: "100%",
                        fit: "cover"
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
            layoutColumnsOnNewData: true,
            movableColumns: true,
            selectable: 1,
            // Añade otros parámetros según sea necesario
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
        const linksTable = document.getElementById('linksTable');

        // Listener para capturar el estado previo del checkbox antes de cambiar
        linksTable.addEventListener('mousedown', function(event) {
            const target = event.target;
            if (target.classList.contains('show-home-checkbox')) {
                const checkbox = target;
                const linkId = checkbox.getAttribute('data-id');
                checkboxStates[linkId] = checkbox.checked;
            }
        });

        // Listener para manejar los clics en los botones de la tabla (edit y toggle-status)
        linksTable.addEventListener('click', handleTableClick);

        // Otros listeners
        addButton.addEventListener('click', () => openModal('add'));
        closeModalBtn.addEventListener('click', closeModal);
        submitButton.addEventListener('click', handleFormSubmit);
        confirmBtn.addEventListener('click', handleConfirm);
    }

    function handleTableClick(event) {
        const target = event.target;

        // Manejar el clic en el botón de editar
        if (target.classList.contains('edit-btn')) {
            const id = target.getAttribute('data-id');
            fetch(`/api/admin/links/${id}`)
                .then(response => response.json())
                .then(data => {
                    openModal('edit', data.link);
                })
                .catch(error => console.error('Error al obtener datos:', error));
        }

        // Manejar el clic en el botón de activar/inactivar
        else if (target.classList.contains('toggle-status-btn')) {
            const id = target.getAttribute('data-id');
            const isActive = target.getAttribute('data-active') === 'true';
            const status = !isActive;
            openConfirmToggleStatusModal(id, status, isActive);
        }
    }

    function openModal(mode, data = {}) {
        modalContent.classList.remove('modal-sm')
        currentMode = mode;
        currentId = data._id || null;

        modalTitle.textContent = mode === 'edit' ? 'Editar enlace de interés' : 'Agregar nuevo enlace de interés';
        modalBody.innerHTML = '';

        formBuilder = new FormBuilder(formConfig, 'itemForm');
        const formElement = formBuilder.createForm();
        modalBody.appendChild(formElement);
        formElement.appendChild(submitButton);

        const imageInput = document.getElementById('urlImage');
        initializeFilePond(imageInput, data);

        if (mode === 'edit') {
            document.getElementById('name').value = data.name;
            document.getElementById('url').value = data.url;
        }

        confirmModal.style.display = 'flex';
    }

    function initializeFilePond(inputElement, data) {
        if (filePondInstance) {
            filePondInstance.destroy();
        }

        urlImage = null;
        imageChanged = false;

        const serverOptions = {
            process: {
                url: '/api/admin/upload-image/links',
                method: 'POST',
                headers: {
                    'CSRF-Token': csrfToken
                },
                onload: (response) => {
                    const res = JSON.parse(response);
                    urlImage = res.filePath;
                }
            },
            revert: (uniqueFileId, load, error) => {
                if (!urlImage) {
                    load();
                    return;
                }
                fetch(`/api/admin/delete-image/links`, {
                    method: 'DELETE',
                    headers: {
                        'CSRF-Token': csrfToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ filePath: urlImage })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            urlImage = null;
                            load();
                        } else {
                            error('Error al eliminar archivo');
                        }
                    })
                    .catch(err => {
                        error('Error al eliminar archivo');
                        console.error('Error:', err);
                    });
            }
        };

        const serverOptionsEdit = {
            load: (source, load, error, progress, abort, headers) => {
                fetch(source)
                    .then(function (response) {
                        return response.blob();
                    })
                    .then(function (blob) {
                        load(blob);
                    })
                    .catch(function (err) {
                        console.error('Error al cargar la imagen:', err);
                        error('Error al cargar la imagen');
                    });
                return {
                    abort: () => {
                        abort(); // Manejar la cancelación de la carga
                    }
                };
            },
        };

        filePondInstance = FilePond.create(inputElement, {
            ...filePondLabelsES,
            allowMultiple: false,
            maxFileSize: '2MB',
            acceptedFileTypes: ['image/*'],
            server: currentMode === 'add' ? serverOptions : serverOptionsEdit
        });

        filePondInstance.on('addfile', () => {
            imageChanged = true;
            filePondInstance.setOptions({ server: serverOptions });
        });

        filePondInstance.on('removefile', () => {
            imageChanged = true;
            filePondInstance.setOptions({ server: serverOptions });
            urlImage = null;
        });

        if (currentMode === 'edit' && data.urlImage) {
            urlImage = data.urlImage;
            filePondInstance.addFile(`/images/links/${data.urlImage}`)
            .catch(err => {
                console.error('Error al cargar la imagen:', err);
            });
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        const errorUrlImage = document.getElementById('error-urlImage');
        if (!urlImage) {
            errorUrlImage.textContent = 'La imagen es obligatoria.';
        } else {
            errorUrlImage.textContent = '';
        }

        if (formBuilder.validateForm() && urlImage) {
            const data = {
                name: document.getElementById('name').value,
                url: document.getElementById('url').value,
                urlImage: urlImage
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

            const endpoint = currentMode === 'edit' ? `/api/admin/links/${currentId}` : '/api/admin/links/add';

            fetch(endpoint, fetchOptions)
                .then(response => response.json())
                .then(responseData => {
                    if (responseData.success) {
                        table.setData();
                        closeModal();
                    } else {
                        alert('Error al guardar el enlace de interés.');
                    }
                })
                .catch(error => console.error('Error:', error))
                .finally(() => hideLoading());
        }
    }

    function openConfirmToggleStatusModal(id, status, isActive) {
        modalContent.classList.add('modal-sm')
        currentId = id;
        newStatus = status;

        modalTitle.textContent = 'Confirmación';
        modalBody.innerHTML = `<p>¿Estás seguro que deseas <b>${isActive ? 'inactivar' : 'activar'}</b> este ítem?</p>`;
        modalBody.appendChild(confirmBtn);

        confirmModal.style.display = 'flex';

        // Indicar que la acción es para toggle-status
        confirmBtn.dataset.action = 'toggleStatus';
    }

    async function handleConfirm() {
        const action = confirmBtn.dataset.action;

        if (action === 'toggleStatus') {
            // Manejo de confirmación para toggle-status
            if (currentId !== null) {
                showLoading();

                try {
                    const response = await fetch(`/api/admin/links/${currentId}/toggle-status`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'CSRF-Token': csrfToken
                        },
                        body: JSON.stringify({ active: newStatus })
                    });

                    const data = await response.json();
                    hideLoading();

                    if (data.success) {
                        table.setData();
                        closeModal();
                    } else {
                        alert('Error al actualizar el estado del enlace de interés.');
                        closeModal();
                    }
                } catch (error) {
                    hideLoading();
                    console.error('Error al actualizar el estado del enlace de interés:', error);
                    alert('Error al actualizar el estado del enlace de interés.');
                    closeModal();
                }
            }
        }

        // Limpiar el atributo de acción después de la confirmación
        delete confirmBtn.dataset.action;
    }

    function closeModal() {
        confirmModal.style.display = 'none';
        modalBody.innerHTML = '';
        if (filePondInstance) {
            filePondInstance.destroy();
            filePondInstance = null;
        }
    }
});
