import { showLoading, hideLoading } from '../../modules/loader/index.js';
import FormBuilder from '../../components/form.js';

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
        { label: 'Título', id: 'title', type: 'text', required: true },
        { label: 'Descripción', id: 'description', type: 'textarea', required: true },
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
        table = new Tabulator("#videosTable", {
            ajaxURL: "/api/admin/videos",
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
                    title: "Descripción",
                    field: "description",
                    hozAlign: "center",
                    vertAlign: "middle",
                    resizable: false,
                    frozen: true,
                    minWidth: 200,
                    formatter: (cell) => {
                        return `<div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${cell.getValue()}</div>`;
                    }
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
                    title: "Mostrar",
                    field: "showInHome",
                    width: 70,
                    formatter: (cell) => {
                        const isChecked = cell.getValue();
                        return `
                            <label class="switch">
                                <input type="checkbox" class="show-home-checkbox" data-id="${cell.getRow().getData()._id}" ${isChecked ? 'checked' : ''}>
                                <span class="slider round"></span>
                            </label>
                        `;
                    },
                    hozAlign: "center",
                    vertAlign: "middle",
                    resizable: false,
                    frozen: true,
                    headerSort: false
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
                    frozen: true,
                    headerSort: false

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
        const videosTable = document.getElementById('videosTable');

        // Listener para capturar el estado previo del checkbox antes de cambiar
        videosTable.addEventListener('mousedown', function(event) {
            const target = event.target;
            if (target.classList.contains('show-home-checkbox')) {
                const checkbox = target;
                const videoId = checkbox.getAttribute('data-id');
                checkboxStates[videoId] = checkbox.checked;
            }
        });

        // Listener para manejar los clics en los botones de la tabla (edit y toggle-status)
        videosTable.addEventListener('click', handleTableClick);

        // Listener para manejar los clics en los checkboxes de "Mostrar en Home"
        videosTable.addEventListener('click', handleShowInHomeClick);

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
            fetch(`/api/admin/videos/${id}`)
                .then(response => response.json())
                .then(data => {
                    openModal('edit', data.video);
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

    function handleShowInHomeClick(event) {
        const target = event.target;

        if (target.classList.contains('show-home-checkbox')) {
            event.preventDefault(); // Prevenir el cambio inmediato del checkbox
            modalContent.classList.add('modal-sm')

            const videoId = target.getAttribute('data-id');
            const isChecked = target.checked;
            const previousState = checkboxStates[videoId];

            // Revertir el checkbox al estado previo
            target.checked = previousState;

            // Mostrar el modal de confirmación para showInHome
            modalTitle.textContent = 'Confirmación';
            modalBody.innerHTML = `<p>¿Estás seguro de ${isChecked ? 'mostrar' : 'remover'} este video en la página de inicio?${isChecked ? ' Solo puede haber uno.' : ''}</p>`;
            modalBody.appendChild(confirmBtn);
            confirmModal.style.display = 'flex';

            // Guardar el ID y referencia al checkbox para la confirmación
            currentId = videoId;
            newStatus = isChecked;
            currentCheckbox = target;

            // Indicar que la acción es para showInHome
            confirmBtn.dataset.action = 'showInHome';
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

        if (action === 'showInHome') {
            // Manejo de confirmación para showInHome
            if (currentId !== null && currentCheckbox !== null) {
                try {
                    showLoading();
                    const response = await fetch(`/api/admin/videos/${currentId}/toggle-showInHome`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'CSRF-Token': csrfToken
                        },
                        body: JSON.stringify({ showInHome: newStatus })
                    });

                    const result = await response.json();
                    hideLoading();

                    if (result.success) {
                        // Actualizar el estado del checkbox
                        currentCheckbox.checked = newStatus;
                        table.setData();
                        closeModal();
                    } else {
                        alert('Error al actualizar el estado del video.');
                        // Revertir el checkbox al estado previo
                        currentCheckbox.checked = !newStatus;
                        closeModal();
                    }
                } catch (error) {
                    hideLoading();
                    console.error('Error al actualizar showInHome:', error);
                    alert('Error al actualizar el estado del video.');
                    // Revertir el checkbox al estado previo
                    currentCheckbox.checked = !newStatus;
                    closeModal();
                }
            }
        }
        else if (action === 'toggleStatus') {
            // Manejo de confirmación para toggle-status
            if (currentId !== null) {
                showLoading();

                try {
                    const response = await fetch(`/api/admin/videos/${currentId}/toggle-status`, {
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
                        alert('Error al actualizar el estado del video.');
                        closeModal();
                    }
                } catch (error) {
                    hideLoading();
                    console.error('Error al actualizar el estado del video:', error);
                    alert('Error al actualizar el estado del video.');
                    closeModal();
                }
            }
        }

        // Limpiar el atributo de acción después de la confirmación
        delete confirmBtn.dataset.action;
    }

    function openModal(mode, data = {}) {
        modalContent.classList.remove('modal-sm')
        currentMode = mode;
        currentId = data._id || null;

        modalTitle.textContent = mode === 'edit' ? 'Editar video' : 'Agregar nuevo video';
        modalBody.innerHTML = '';

        formBuilder = new FormBuilder(formConfig, 'itemForm');
        const formElement = formBuilder.createForm();
        modalBody.appendChild(formElement);
        formElement.appendChild(submitButton);

        const imageInput = document.getElementById('urlImage');
        initializeFilePond(imageInput, data);

        if (mode === 'edit') {
            document.getElementById('title').value = data.title;
            document.getElementById('description').value = data.description;
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
                url: '/api/admin/upload-image/videos',
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
                fetch(`/api/admin/delete-image/videos`, {
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
            filePondInstance.addFile(`/images/videos/${data.urlImage}`)
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
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
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

            const endpoint = currentMode === 'edit' ? `/api/admin/videos/${currentId}` : '/api/admin/videos/add';

            fetch(endpoint, fetchOptions)
                .then(response => response.json())
                .then(responseData => {
                    if (responseData.success) {
                        table.setData();
                        closeModal();
                    } else {
                        alert('Error al guardar el video.');
                    }
                })
                .catch(error => console.error('Error:', error))
                .finally(() => hideLoading());
        }
    }

    function openConfirmModal(id, status, isActive) {
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

        if (action === 'showInHome') {
            // Manejo de confirmación para showInHome
            if (currentId !== null && currentCheckbox !== null) {
                try {
                    showLoading();
                    const response = await fetch(`/api/admin/videos/${currentId}/toggle-showInHome`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'CSRF-Token': csrfToken
                        },
                        body: JSON.stringify({ showInHome: newStatus })
                    });

                    const result = await response.json();
                    hideLoading();

                    if (result.success) {
                        // Actualizar el estado del checkbox
                        currentCheckbox.checked = newStatus;
                        table.setData();
                        closeModal();
                    } else {
                        alert('Error al actualizar el estado del video.');
                        // Revertir el checkbox al estado previo
                        currentCheckbox.checked = !newStatus;
                        closeModal();
                    }
                } catch (error) {
                    hideLoading();
                    console.error('Error al actualizar showInHome:', error);
                    alert('Error al actualizar el estado del video.');
                    // Revertir el checkbox al estado previo
                    currentCheckbox.checked = !newStatus;
                    closeModal();
                }
            }
        }
        else if (action === 'toggleStatus') {
            // Manejo de confirmación para toggle-status
            if (currentId !== null) {
                showLoading();

                try {
                    const response = await fetch(`/api/admin/videos/${currentId}/toggle-status`, {
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
                        alert('Error al actualizar el estado del video.');
                        closeModal();
                    }
                } catch (error) {
                    hideLoading();
                    console.error('Error al actualizar el estado del video:', error);
                    alert('Error al actualizar el estado del video.');
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
