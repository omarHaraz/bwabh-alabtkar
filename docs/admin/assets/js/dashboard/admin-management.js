import { API_BASE } from "../../../../assets/js/api-config.js";
import { AdminUI } from "../admin-ui.js";

const API_BASE_URL = `${API_BASE}/api/admin/management`;

const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.token) {
    window.location.href = "../../auth/login.html";
}

const authHeader = {
    Authorization: `Bearer ${user.token}`,
    "Content-Type": "application/json"
};

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
                ? `<a class="btn btn-link text-danger text-gradient px-3 mb-0"
                        href="javascript:;"
                        onclick="deactivateAdmin(${admin.id})">
                        <i class="material-icons text-sm me-2">delete</i>Deactivate
                   </a>`
                : `<a class="btn btn-link text-success px-3 mb-0"
                        href="javascript:;"
                        onclick="reactivateAdmin(${admin.id})">
                        <i class="material-icons text-sm me-2">restore</i>Reactivate
                   </a>`;           

           const row = `
           <tr>           
               <td>
                   <div class="d-flex px-3 py-1 align-items-center">
                       <h6 class="mb-0 text-sm">${admin.name}</h6>
                   </div>
               </td>           
               <td>
                   <p class="text-sm font-weight-bold mb-0">${admin.email}</p>
               </td>           
               <td class="align-middle">
                   <span class="badge badge-sm bg-gradient-dark">
                       ${admin.roles.join(', ')}
                   </span>
               </td>           
               <td class="align-middle text-center">
                   ${statusBadge}
               </td>           
               <td class="align-middle text-center">           
                   <a class="btn btn-link text-dark px-2 mb-0"
                      href="javascript:;"
                      onclick="openEditModal(${admin.id})">
                       <i class="material-symbols-rounded text-sm">edit</i>
                       Edit
                   </a>           
                   ${actionButton}           
               </td>           
           </tr>
           `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error:', error);
        AdminUI.showToast('Could not load administrative list.', 'danger');
    }
}

// 2. Open Modal for Create Flow
function openCreateModal() {
    const form = document.getElementById('adminForm');
    form.reset();
    AdminUI.clearFormErrors(form);
    document.getElementById('adminId').value = '';
    document.getElementById('adminModalLabel').innerText = 'Add New Administrator';
    
    document.getElementById('adminEmail').disabled = false;
    document.getElementById('adminPassword').required = true;
    document.getElementById('passwordHelp').classList.add('d-none');
    
    document.querySelectorAll('.input-group').forEach(el => el.classList.remove('is-filled', 'is-focused'));
    
    bootstrapModalInstance.show();
}

// 3. Open Modal for Edit/Update Flow
function openEditModal(id) {
    const admin = activeAdminsList.find(a => a.id === id);
    if (!admin) return;

    const form = document.getElementById('adminForm');
    AdminUI.clearFormErrors(form);

    document.getElementById('adminId').value = admin.id;
    document.getElementById('adminName').value = admin.name;
    document.getElementById('adminEmail').value = admin.email;
    document.getElementById('adminRoles').value = admin.roles.includes('ROLE_SUPER_ADMIN') ? 'ROLE_SUPER_ADMIN' : 'ROLE_ADMIN';
    
    document.getElementById('adminEmail').disabled = true;
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminPassword').required = false;
    document.getElementById('passwordHelp').classList.remove('d-none');
    document.getElementById('adminModalLabel').innerText = 'Edit Administrator';

    document.querySelectorAll('.input-group').forEach(el => el.classList.add('is-filled'));

    bootstrapModalInstance.show();
}

// 4. Combined Submit Handler
async function saveAdminForm(e) {
    e.preventDefault();
    const form = document.getElementById('adminForm');
    AdminUI.clearFormErrors(form);

    const id = document.getElementById('adminId').value;
    const name = document.getElementById('adminName').value;
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const selectedRole = document.getElementById('adminRoles').value;
    
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
            AdminUI.showToast(isUpdate ? 'Admin successfully modified.' : 'New administrator created successfully.', 'success');
            bootstrapModalInstance.hide();
            loadAdmins();
        } else {
            let errorText = 'Execution failed.';
            try {
                const resData = await response.json();
                if (resData && resData.fieldErrors) {
                    AdminUI.showFormErrors(form, resData.fieldErrors);
                    errorText = resData.message || 'Please fix validation errors in the form.';
                } else if (resData && resData.message) {
                    errorText = resData.message;
                }
            } catch (_) {
                errorText = await response.text();
            }
            AdminUI.showToast(errorText, 'danger');
        }
    } catch (error) {
        console.error('Error processing form:', error);
        AdminUI.showToast('Network error processing request.', 'danger');
    }
}

// 5. Deactivate Admin
async function deactivateAdmin(id) {
    const confirmed = await AdminUI.showConfirm({
        title: 'Deactivate Administrator',
        message: 'Are you sure you want to deactivate this administrator? They will no longer be able to log in.',
        confirmText: 'Deactivate',
        confirmClass: 'bg-gradient-danger',
        icon: 'person_off'
    });

    if (confirmed) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE', headers: authHeader });
            if (response.ok || response.status === 204) {
                AdminUI.showToast('Administrator successfully deactivated.', 'success');
                loadAdmins();
            } else {
                AdminUI.showToast('Failed to deactivate administrator.', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            AdminUI.showToast('Network error updating administrator status.', 'danger');
        }
    }
}

// 6. Reactivate Admin
async function reactivateAdmin(id) {
    const confirmed = await AdminUI.showConfirm({
        title: 'Reactivate Administrator',
        message: 'Are you sure you want to reactivate this administrator account?',
        confirmText: 'Reactivate',
        confirmClass: 'bg-gradient-success',
        icon: 'restore'
    });

    if (!confirmed) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${id}/reactivate`, {
            method: "PATCH",
            headers: authHeader
        });

        if (response.ok || response.status === 204) {
            AdminUI.showToast('Administrator reactivated successfully.', 'success');
            loadAdmins();
        } else {
            AdminUI.showToast('Failed to reactivate administrator.', 'danger');
        }
    } catch (error) {
        console.error(error);
        AdminUI.showToast('Network error reactivating administrator.', 'danger');
    }
}

Object.assign(window, {
    openCreateModal,
    openEditModal,
    deactivateAdmin,
    reactivateAdmin
});


