// public/js/admin/users.js
import { showLoading, hideLoading } from '../../modules/loader/index.js';
import FormBuilder from '../../components/form.js';

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
    let currentMode = null; // 'add' o 'edit'
    let currentId = null;

    const formConfig = [
        { label: 'Nombre', id: 'name', type: 'text', required: true },
        { label: 'Correo', id: 'email', type: 'email', required: true },
        { label: 'Contraseña', id: 'password', type: 'password', required: false },
        { label: 'Confirmar Contraseña', id: 'passwordConfirm', type: 'password', required: false },
        {
            label: 'Rol',
            id: 'role',
            type: 'select',
            required: true,
            placeholder: 'Seleccione un rol', // Agregamos placeholder
            options: [
                { value: 'admin', text: 'Admin' },
                { value: 'superadmin', text: 'SuperAdmin' }
            ]
        }
    ];    

    init();

    function init() {
        initializeTable();
        initializeFilters();
        initializeEventHandlers();
    }

    function initializeTable() {
        table = new Tabulator("#usersTable", {
            ajaxURL: "/api/admin/users",
            pagination: true,
            paginationSize: 5,
            paginationSizeSelector: [5, 10, 15, 20],
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
                "es-ES": {
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
            locale: "es-ES",
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
                    title: "Correo",
                    field: "email",
                    minWidth: 200,
                    hozAlign: "center",
                    vertAlign: "middle",
                    resizable: false,
                    frozen: true
                },
                {
                    title: "Rol",
                    field: "role",
                    maxWidth: 100,
                    hozAlign: "center",
                    vertAlign: "middle",
                    resizable: false,
                    frozen: true
                },
                {
                    title: "Acciones",
                    maxWidth: 100,
                    field: "_id",
                    hozAlign: "center",
                    vertAlign: "middle",
                    resizable: false,
                    frozen: true,
                    formatter: (cell) => {
                        const rowData = cell.getData();
                        return `
                            <div class='d-flex flex-direction-column'>
                                <button class="edit-btn w-100 sm" data-id="${rowData._id}">Editar</button>
                                <button class="delete-btn w-100 sm color-primary" data-id="${rowData._id}">Eliminar</button>
                            </div>
                        `;
                    },
                }
            ],
            ajaxResponse: function (url, params, response) {
                return response.data;
            },
        });
    }

    function initializeFilters() {
        document.getElementById("search-all").addEventListener("input", applyFilters);

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

                return passesSearch;
            });
        }
    }

    function initializeEventHandlers() {
        document.getElementById('usersTable').addEventListener('click', handleTableClick);
        addButton.addEventListener('click', () => openModal('add'));
        closeModalBtn.addEventListener('click', closeModal);
        submitButton.addEventListener('click', handleFormSubmit);
        confirmBtn.addEventListener('click', handleConfirm);
    }

    function handleTableClick(event) {
        const target = event.target;

        if (target.classList.contains('edit-btn')) {
            const id = target.getAttribute('data-id');
            fetch(`/api/admin/users/${id}`)
                .then(response => response.json())
                .then(data => {
                    openModal('edit', data.user);
                })
                .catch(error => console.error('Error al obtener datos:', error));
        } else if (target.classList.contains('delete-btn')) {
            const id = target.getAttribute('data-id');
            openConfirmModal(id);
        }
    }

    function openModal(mode, data = {}) {
        modalContent.classList.remove('modal-sm')
        currentMode = mode;
        currentId = data._id || null;

        modalTitle.textContent = mode === 'edit' ? 'Editar Usuario' : 'Agregar Usuario';
        modalBody.innerHTML = '';

        formBuilder = new FormBuilder(formConfig, 'userForm');
        const formElement = formBuilder.createForm();
        modalBody.appendChild(formElement);
        formElement.appendChild(submitButton);

        if (mode === 'edit') {
            document.getElementById('name').value = data.name;
            document.getElementById('email').value = data.email;
            document.getElementById('role').value = data.role;

            // En modo edición, las contraseñas son opcionales
            document.getElementById('password').required = false;
            document.getElementById('passwordConfirm').required = false;
        } else {
            // En modo agregar, las contraseñas son obligatorias
            document.getElementById('password').required = true;
            document.getElementById('passwordConfirm').required = true;
        }

        confirmModal.style.display = 'flex';
    }

    function handleFormSubmit(event) {
        event.preventDefault();
    
        if (formBuilder.validateForm(currentMode)) {
            const data = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                role: document.getElementById('role').value,
            };
    
            // Campos de contraseña
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('passwordConfirm').value;
    
            if (password || currentMode === 'add') {
                data.password = password;
                data.passwordConfirm = passwordConfirm;
            }
    
            showLoading();
    
            const fetchOptions = {
                method: currentMode === 'edit' ? 'PUT' : 'POST',
                body: JSON.stringify(data),
                headers: {
                    'CSRF-Token': csrfToken,
                    'Content-Type': 'application/json',
                }
            };
    
            const endpoint = currentMode === 'edit' ? `/api/admin/users/${currentId}` : '/api/admin/users/add';
    
            fetch(endpoint, fetchOptions)
                .then(response => response.json())
                .then(responseData => {
                    if (responseData.success) {
                        table.setData();
                        closeModal();
                    } else {
                        alert(responseData.message);
                    }
                })
                .catch(error => console.error('Error:', error))
                .finally(() => hideLoading());
        }
    }

    function openConfirmModal(id) {
        currentId = id;

        modalTitle.textContent = 'Confirmación';
        modalBody.innerHTML = `<p>¿Estás seguro que deseas eliminar este usuario?</p>`;
        modalContent.classList.add('modal-sm')
        modalBody.appendChild(confirmBtn);

        confirmModal.style.display = 'flex';
    }

    function handleConfirm() {
        if (currentId !== null) {
            showLoading();

            fetch(`/api/admin/users/${currentId}`, {
                method: 'DELETE',
                headers: {
                    'CSRF-Token': csrfToken,
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        table.setData();
                        closeModal();
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error('Error:', error))
                .finally(() => hideLoading());
        }
    }

    function closeModal() {
        confirmModal.style.display = 'none';
        modalBody.innerHTML = '';
    }
});
