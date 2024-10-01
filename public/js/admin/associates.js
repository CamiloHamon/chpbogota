// public/js/admin/associates.js

import { showLoading, hideLoading } from '../../modules/loader/index.js';
import FormBuilder from '../../components/form.js';

// Configuración de FilePond en español
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
    const addCompanyButton = document.getElementById('add-company-btn');
    const addPersonButton = document.getElementById('add-person-btn');
    const submitButton = document.createElement('button');
    submitButton.classList.add('form-button', 'color-primary');
    submitButton.textContent = 'Guardar';

    // Botón de confirmación
    const confirmBtn = document.createElement('button');
    confirmBtn.id = 'modal-confirm-btn';
    confirmBtn.className = 'confirm-btn color-primary';
    confirmBtn.textContent = 'Confirmar';

    let companiesTable = null;
    let personsTable = null;
    let formBuilder = null;
    let filePondInstance = null;
    let currentMode = null; // 'add' or 'edit'
    let currentId = null;
    let associateType = null; // 'Company' or 'Natural Person'
    let urlImage = null;
    let newStatus = null;
    let imageChanged = false; // Flag para determinar si la imagen ha sido cambiada

    const formConfigCompany = [
        { label: 'Nombre', id: 'name', type: 'text', required: true },
        { label: 'Imagen', id: 'urlImage', type: 'file', required: true }
    ];

    const formConfigPerson = [
        { label: 'Nombre', id: 'name', type: 'text', required: true }
    ];

    init();

    function init() {
        initializeTables();
        initializeFilters();
        initializeEventHandlers();
    }

    function initializeTables() {
        // Tabla para Companies
        companiesTable = new Tabulator("#companiesTable", {
            ajaxURL: "/api/admin/associates",
            ajaxParams: { type: 'Company' },
            pagination: true,
            paginationSize: 7,
            paginationSizeSelector: [7, 10, 15, 20],
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
                    minWidth: 200,
                    hozAlign: "center",
                    vertAlign: "middle",
                    resizable: false,
                    frozen: true
                },
                {
                    title: "Imagen",
                    field: "urlImage",
                    formatter: "image",
                    width: 120,
                    headerSort: false,
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
                                <button class="toggle-status-btn w-100 sm" data-id="${rowData._id}" data-active="${rowData.active}">${rowData.active ? 'Desactivar' : 'Activar'}</button>
                            </div>
                        `;
                    },
                    width: 150,
                    hozAlign: "center",
                    vertAlign: "middle",
                    resizable: false,
                    frozen: true,
                    headerSort: false
                }
            ],
            ajaxResponse: function (url, params, response) {
                return response.data.filter(item => item.type === 'Company');
            },
            layoutColumnsOnNewData: true,
            movableColumns: true,
            selectable: 1,
        });

        // Tabla para Natural Persons
        personsTable = new Tabulator("#personsTable", {
            ajaxURL: "/api/admin/associates",
            ajaxParams: { type: 'Natural Person' },
            pagination: true,
            paginationSize: 7,
            paginationSizeSelector: [7, 10, 15, 20],
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
                    minWidth: 200,
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
                                <button class="toggle-status-btn w-100 sm" data-id="${rowData._id}" data-active="${rowData.active}">${rowData.active ? 'Desactivar' : 'Activar'}</button>
                            </div>
                        `;
                    },
                    width: 150,
                    hozAlign: "center",
                    vertAlign: "middle",
                    resizable: false,
                    frozen: true,
                    headerSort: false
                }
            ],
            ajaxResponse: function (url, params, response) {
                return response.data.filter(item => item.type === 'Natural Person');
            },
            layoutColumnsOnNewData: true,
            movableColumns: true,
            selectable: 1,
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

            const filterFunction = (data) => {
                let passesSearch = false;

                for (let key in data) {
                    const normalizedData = String(data[key]).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    if (normalizedData.includes(normalizedValue)) {
                        passesSearch = true;
                        break;
                    }
                }

                return passesSearch && (!isActiveFilter || data.active);
            };

            companiesTable.setFilter(filterFunction);
            personsTable.setFilter(filterFunction);
        }
    }

    function initializeEventHandlers() {
        document.getElementById('companiesTable').addEventListener('click', handleTableClick);
        document.getElementById('personsTable').addEventListener('click', handleTableClick);
        addCompanyButton.addEventListener('click', () => openModal('add', { type: 'Company' }));
        addPersonButton.addEventListener('click', () => openModal('add', { type: 'Natural Person' }));
        closeModalBtn.addEventListener('click', closeModal);
        submitButton.addEventListener('click', handleFormSubmit);
        confirmBtn.addEventListener('click', handleConfirm);
    }

    function handleTableClick(event) {
        const target = event.target;

        if (target.classList.contains('edit-btn')) {
            const id = target.getAttribute('data-id');
            fetch(`/api/admin/associates/${id}`)
                .then(response => response.json())
                .then(data => {
                    openModal('edit', data.associate);
                })
                .catch(error => console.error('Error fetching data:', error));
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

        associateType = mode === 'edit' ? data.type : (mode === 'add' ? (data.type || 'Company') : null);

        modalTitle.textContent = mode === 'edit' ? 'Editar Asociado' : (associateType === 'Company' ? 'Agregar Nueva Empresa' : 'Agregar Nueva Persona Natural');
        modalBody.innerHTML = '';

        if (associateType === 'Company') {
            formBuilder = new FormBuilder(formConfigCompany, 'itemForm');
        } else if (associateType === 'Natural Person') {
            formBuilder = new FormBuilder(formConfigPerson, 'itemForm');
        } else {
            // Default to Company form if type is not specified
            formBuilder = new FormBuilder(formConfigCompany, 'itemForm');
        }

        const formElement = formBuilder.createForm();
        modalBody.appendChild(formElement);
        formElement.appendChild(submitButton);

        const imageInput = document.getElementById('urlImage');
        if (imageInput) {
            initializeFilePond(imageInput, data);
        }

        if (mode === 'edit') {
            document.getElementById('name').value = data.name;
            if (associateType === 'Company' && data.urlImage) {
                // Image will be handled by FilePond
            }
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
                url: '/api/admin/upload-image/associates',
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
                fetch(`/api/admin/delete-image/associates`, {
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
                            error('Error deleting file');
                        }
                    })
                    .catch(err => {
                        error('Error deleting file');
                        console.error('Error:', err);
                    });
            }
        };

        const serverOptionsEdit = {
            load: (source, load, error, progress, abort, headers) => {
                fetch(source)
                    .then(response => response.blob())
                    .then(blob => {
                        load(blob);
                    })
                    .catch(err => {
                        console.error('Error loading image:', err);
                        error('Error loading image');
                    });
                return {
                    abort: () => {
                        abort();
                    }
                };
            },
        };

        filePondInstance = FilePond.create(inputElement, {
            ...filePondLabelsES,
            allowMultiple: false,
            maxFileSize: '1MB',
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
            filePondInstance.addFile(`/images/associates/${data.urlImage}`)
                .catch(err => {
                    console.error('Error loading image:', err);
                });
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        if (currentMode === 'add' || currentMode === 'edit') {
            const name = document.getElementById('name').value;
            let data = { name };

            if (currentMode === 'add') {
                data.type = associateType;
                if (associateType === 'Company') {
                    data.urlImage = urlImage;
                }
            } else if (currentMode === 'edit') {
                data.type = associateType; // Type should not change during edit
                if (urlImage) {
                    data.urlImage = urlImage;
                }
            }

            // Validación de imagen para Companies
            if ((currentMode === 'add' && associateType === 'Company') || (currentMode === 'edit' && associateType === 'Company')) {
                if (!urlImage) {
                    const errorUrlImage = document.getElementById('error-urlImage');
                    if (errorUrlImage) {
                        errorUrlImage.textContent = 'La imagen es obligatoria.';
                    } else {
                        alert('La imagen es obligatoria.');
                    }
                    return;
                } else {
                    const errorUrlImage = document.getElementById('error-urlImage');
                    if (errorUrlImage) {
                        errorUrlImage.textContent = '';
                    }
                }
            }

            showLoading();

            let fetchOptions = {
                method: currentMode === 'edit' ? 'PUT' : 'POST',
                body: JSON.stringify(data),
                headers: {
                    'CSRF-Token': csrfToken,
                    'Content-Type': 'application/json',
                }
            };

            let endpoint = currentMode === 'edit' ? `/api/admin/associates/${currentId}` : '/api/admin/associates/add';

            fetch(endpoint, fetchOptions)
                .then(response => response.json())
                .then(responseData => {
                    if (responseData.success) {
                        if (associateType === 'Company') {
                            companiesTable.setData();
                        } else if (associateType === 'Natural Person') {
                            personsTable.setData();
                        }
                        closeModal();
                    } else {
                        alert(responseData.message || 'Error al guardar el asociado.');
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
        modalBody.innerHTML = `<p>¿Estás seguro que deseas <b>${isActive ? 'desactivar' : 'activar'}</b> este ítem?</p>`;
        modalBody.appendChild(confirmBtn);

        confirmModal.style.display = 'flex';
    }

    async function handleConfirm() {
        if (currentId !== null) {
            showLoading();

            try {
                const response = await fetch(`/api/admin/associates/${currentId}/toggle-status`, {
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
                    // Actualizar la tabla correspondiente
                    if (data.data.type === 'Company') {
                        companiesTable.setData();
                    } else if (data.data.type === 'Natural Person') {
                        personsTable.setData();
                    }
                    closeModal();
                } else {
                    alert('Error al actualizar el estado.');
                    closeModal();
                }
            } catch (error) {
                hideLoading();
                console.error('Error updating status:', error);
                alert('Error al actualizar el estado.');
                closeModal();
            }
        }

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
