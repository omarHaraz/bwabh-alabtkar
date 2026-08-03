// assets/js/dashboard/admin-management.js

import { API_BASE } from "../../../../assets/js/api-config.js";

const API_BASE_URL = `${API_BASE}/api/admin/management`;

const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.token) {
    window.location.href = "../../auth/login.html";
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

// Reactivate Admin
async function reactivateAdmin(id) {

    if (!confirm("Are you sure you want to reactivate this administrator?")) {
        return;
    }

    try {

        const response = await fetch(`${API_BASE_URL}/${id}/reactivate`, {
            method: "PATCH",
            headers: authHeader
        });

        if (response.ok || response.status === 204) {

            alert("Administrator reactivated successfully.");

            loadAdmins();

        } else {

            alert("Failed to reactivate administrator.");

        }

    } catch (error) {

        console.error(error);

    }

}

Object.assign(window, {
    openCreateModal,
    openEditModal,
    deactivateAdmin,
    reactivateAdmin
});

