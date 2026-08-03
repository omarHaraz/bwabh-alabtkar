// assets/js/dashboard/customer-management.js

import { API_BASE } from "../../../../assets/js/api-config.js";

const API_BASE_URL = `${API_BASE}/api/customer/management`;

const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.token) {
    window.location.href = "../../customer/login.html";
}

const authHeader = {
    Authorization: `Bearer ${user.token}`,
    "Content-Type": "application/json"
};

let activeCustomersList = [];
let bootstrapModalInstance = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
    bootstrapModalInstance = new bootstrap.Modal(document.getElementById('customerModal'));

    document.getElementById('customerForm').addEventListener('submit', saveCustomerForm);
});

// Load Customers
async function loadCustomers() {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: authHeader
        });

        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }

        activeCustomersList = await response.json();

        const tableBody = document.getElementById('customers-table-body');

        if (!tableBody) return;

        tableBody.innerHTML = '';

        activeCustomersList.forEach(customer => {

            const statusBadge = customer.enabled
                ? '<span class="badge badge-sm bg-gradient-success">Active</span>'
                : '<span class="badge badge-sm bg-gradient-danger">Deactivated</span>';

            const row = `
             <tr>                      

                 <td>
                     <div class="d-flex px-3 py-1 align-items-center">
                         <h6 class="mb-0 text-sm">${customer.name}</h6>
                     </div>
                 </td>                      

                 <td>
                     <p class="text-sm font-weight-bold mb-0">${customer.email}</p>
                 </td>                      

                 <td class="align-middle text-center">
                     ${statusBadge}
                 </td>                      

                 <td class="align-middle text-center">
                     <a class="btn btn-link text-dark px-2 mb-0"
                        href="javascript:;"
                        onclick="openEditModal(${customer.id})">
                         <i class="material-symbols-rounded text-sm">edit</i>
                         Edit
                     </a>                      

                ${customer.enabled ? `
                <a class="btn btn-link text-danger px-2 mb-0"
                   href="javascript:;"
                   onclick="deactivateCustomer(${customer.id})">
                    <i class="material-symbols-rounded text-sm">delete</i>
                    Deactivate
                </a>
                ` : `
                <a class="btn btn-link text-success px-2 mb-0"
                   href="javascript:;"
                   onclick="reactivateCustomer(${customer.id})">
                    <i class="material-symbols-rounded text-sm">restore</i>
                    Reactivate
                </a>
                `}
                 </td>                      

             </tr>
             `;

            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error(error);
        alert("Could not load customer list.");
    }
}

// Open Edit Modal
function openEditModal(id) {

    const customer = activeCustomersList.find(c => c.id === id);

    if (!customer) return;

    document.getElementById('customerId').value = customer.id;
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerEmail').value = customer.email;

    document.getElementById('customerEmail').disabled = false;

    document.getElementById('customerPassword').value = '';
    document.getElementById('customerPassword').required = false;

    document.getElementById('passwordHelp').classList.remove('d-none');

    document.getElementById('customerModalLabel').innerText = 'Edit Customer';

    document.querySelectorAll('.input-group').forEach(el => {
        el.classList.add('is-filled');
    });

    bootstrapModalInstance.show();
}

// Save Customer
async function saveCustomerForm(e) {

    e.preventDefault();

    const id = document.getElementById('customerId').value;

    const payload = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        password: document.getElementById('customerPassword').value
    };

    try {

        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: authHeader,
            body: JSON.stringify(payload)
        });

        if (response.ok) {

            alert("Customer updated successfully.");

            bootstrapModalInstance.hide();

            loadCustomers();

        } else {

            const message = await response.text();

            alert(message);
        }

    } catch (error) {
        console.error(error);
    }
}

// Deactivate Customer
async function deactivateCustomer(id) {

    if (!confirm("Are you sure you want to deactivate this customer?")) {
        return;
    }

    try {

        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: authHeader
        });

        if (response.ok || response.status === 204) {

            alert("Customer deactivated successfully.");

            loadCustomers();

        } else {

            alert("Failed to deactivate customer.");

        }

    } catch (error) {

        console.error(error);

    }
}


// Reactivate Customer
async function reactivateCustomer(id) {

    if (!confirm("Are you sure you want to reactivate this customer?")) {
        return;
    }

    try {

        const response = await fetch(`${API_BASE_URL}/${id}/reactivate`, {
            method: "PATCH",
            headers: authHeader
        });

        if (response.ok || response.status === 204) {

            alert("Customer reactivated successfully.");

            loadCustomers();

        } else {

            alert("Failed to reactivate customer.");

        }

    } catch (error) {

        console.error(error);

    }
}