document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    // Configurar Tabulator para la tabla
    const table = new Tabulator("#commonAreasTable", {
        ajaxURL: "/api/admin/common-areas", // Ruta del servidor para obtener datos
        pagination: true, //enable pagination
        paginationMode: "remote", //enable remote pagination
        layout: "fitColumns", // Ajustar las columnas al ancho de la tabla
        responsiveLayout: "collapse",
        rowHeader: { formatter: "responsiveCollapse", width: 30, minWidth: 30, hozAlign: "center", resizable: false, headerSort: false },
        columns: [
            {
                title: "Título", field: "title", minWidth: 200, hozAlign: "center", vertAlign: "middle",
                resizable: false, frozen: true
            },
            {
                title: "Edición", field: "edition", hozAlign: "center", vertAlign: "middle",
                resizable: false, frozen: true, minWidth: 200
            },
            {
                title: "Fecha de creación",
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
                resizable: false, frozen: true
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
                resizable: false, frozen: true
            },
            {
                title: "Acciones",
                field: "_id",
                formatter: (cell) => {
                    const rowData = cell.getData();
                    return `<button class="edit-btn" data-id="${rowData._id}">Editar</button> 
                            <button class="toggle-status-btn" data-id="${rowData._id}" data-active="${rowData.active}">${rowData.active ? 'Inactivar' : 'Activar'}</button>`;
                },
                width: 150,
                hozAlign: "center",
                vertAlign: "middle",
                resizable: false, frozen: true
            }
        ]
    });

    // Manejar clic en el botón "Editar"
    document.getElementById('commonAreasTable').addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-btn')) {
            const id = event.target.getAttribute('data-id');
            window.location.href = `/admin/common-areas/edit/${id}`;
        }
    });

    // Manejar clic en el botón "Inactivar/Activar"
    document.getElementById('commonAreasTable').addEventListener('click', function (event) {
        if (event.target.classList.contains('toggle-status-btn')) {
            const id = event.target.getAttribute('data-id');
            const isActive = event.target.getAttribute('data-active') === 'true';
            const newStatus = !isActive;

            // Enviar la solicitud AJAX para inactivar/activar
            fetch(`/api/admin/common-areas/${id}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken // Incluir el token CSRF en el header
                },
                body: JSON.stringify({ active: newStatus })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        table.setData(); // Recargar la tabla después del cambio
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    });
});
