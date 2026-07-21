// assets/js/dashboard/admin-management.js

const API_BASE_URL = 'http://localhost:8080/api/admin/management';
const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.token) {
    window.location.href = "../../customer/login.html";
}

const authHeader = {
    Authorization: `Bearer ${user.token}`,
    "Content-Type": "application/json"
};

// State cache array to store fetched records temporarily for quick form population
let activeAdminsList = [];
let bootstrapModalInstance = null;

// Initialize layout elements
document.addEventListener('DOMContentLoaded', () => {
    loadAdmins();
    bootstrapModalInstance = new bootstrap.Modal(document.getElementById('adminModal'));
    
    // Attach form submit interceptor
    document.getElementById('adminForm').addEventListener('submit', saveAdminForm);
});

// 1. Fetch and Display Administrators
async function loadAdmins() {
    try {


        const response = await fetch(API_BASE_URL, { method: 'GET', headers: authHeader });
        if (!response.ok) throw new Error('Failed to fetch administrators');


        activeAdminsList = await response.json();
        const tableBody = document.getElementById('admins-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';

        activeAdminsList.forEach(admin => {
            const statusBadge = admin.enabled 
                ? '<span class="badge badge-sm bg-gradient-success">Active</span>' 
                : '<span class="badge badge-sm bg-gradient-danger">Deactivated</span>';

            const actionButton = admin.enabled
                ? `<a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;" onclick="deactivateAdmin(${admin.id})">
                     <i class="material-icons text-sm me-2">delete</i>Deactivate
                   </a>`
                : `<span class="text-xs text-muted px-3">No actions available</span>`;

            const row = `
                <tr>
                    <td><div class="d-flex px-2 py-1"><h6 class="mb-0 text-sm">${admin.name}</h6></div></td>
                    <td><p class="text-xs font-weight-bold mb-0">${admin.email}</p></td>
                    <td><span class="badge badge-sm bg-gradient-dark">${admin.roles.join(', ')}</span></td>
                    <td>${statusBadge}</td>
                    <td>
                        <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;" onclick="openEditModal(${admin.id})">
                            <i class="material-icons text-sm me-2">edit</i>Edit
                        </a>
                        ${actionButton}
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Could not load administrative list.');
    }
}

// 2. Open Modal for Create Flow
function openCreateModal() {
    document.getElementById('adminForm').reset();
    document.getElementById('adminId').value = '';
    document.getElementById('adminModalLabel').innerText = 'Add New Administrator';
    
    // Make email editable, password required, and hide helper hint text
    document.getElementById('adminEmail').disabled = false;
    document.getElementById('adminPassword').required = true;
    document.getElementById('passwordHelp').classList.add('d-none');
    
    // Clear template CSS active styles on input wrappers if necessary
    document.querySelectorAll('.input-group').forEach(el => el.classList.remove('is-filled', 'is-focused'));
    
    bootstrapModalInstance.show();
}

// 3. Open Modal for Edit/Update Flow
function openEditModal(id) {
    const admin = activeAdminsList.find(a => a.id === id);
    if (!admin) return;

    document.getElementById('adminId').value = admin.id;
    document.getElementById('adminName').value = admin.name;
    document.getElementById('adminEmail').value = admin.email;
    document.getElementById('adminRoles').value = admin.roles.includes('ROLE_SUPER_ADMIN') ? 'ROLE_SUPER_ADMIN' : 'ROLE_ADMIN';
    
    // Backend constraints: Email cannot change on updates. Password becomes optional.
    document.getElementById('adminEmail').disabled = true;
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminPassword').required = false;
    document.getElementById('passwordHelp').classList.remove('d-none');
    document.getElementById('adminModalLabel').innerText = 'Edit Administrator';

    // Force material layout framework to reposition input floating text labels
    document.querySelectorAll('.input-group').forEach(el => el.classList.add('is-filled'));

    bootstrapModalInstance.show();
}

// 4. Combined Submit Handler (Routes cleanly between POST and PUT endpoints)
async function saveAdminForm(e) {
    e.preventDefault();

    const id = document.getElementById('adminId').value;
    const name = document.getElementById('adminName').value;
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const selectedRole = document.getElementById('adminRoles').value;
    
    // Format payload cleanly for Spring Boot AdminCreateRequest DTO matching Option 1
    const payload = {
        name: name,
        email: email,
        password: password,
        roles: [selectedRole]
    };

    const isUpdate = id !== '';
    const endpoint = isUpdate ? `${API_BASE_URL}/${id}` : API_BASE_URL;
    const httpMethod = isUpdate ? 'PUT' : 'POST';

    try {
        const response = await fetch(endpoint, {
            method: httpMethod,
            headers: authHeader,
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(isUpdate ? 'Admin successfully modified.' : 'New administrator created successfully.');
            bootstrapModalInstance.hide();
            loadAdmins();
        } else {
            const errorMessage = await response.text();
            alert(`Execution failed: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error processing form:', error);
    }
}

// 5. Deactivate Admin (Soft Delete Operation)
async function deactivateAdmin(id) {
    if (confirm('Are you sure you want to deactivate this administrator?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE', headers: authHeader });
            if (response.ok || response.status === 204) {
                alert('Administrator successfully deactivated.');
                loadAdmins();
            } else {
                alert('Failed to update administrator status.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}