// assets/js/admin-ui.js

class AdminUIManager {
    constructor() {
        this.toastContainer = null;
        this.confirmModalInstance = null;
        this.confirmResolver = null;
        this.initContainers();
    }

    initContainers() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createDOMStructures());
        } else {
            this.createDOMStructures();
        }
    }

    createDOMStructures() {
        // Create Toast Container if not exists
        if (!document.getElementById('admin-toast-container')) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.id = 'admin-toast-container';
            this.toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            this.toastContainer.style.zIndex = '99999';
            document.body.appendChild(this.toastContainer);
        } else {
            this.toastContainer = document.getElementById('admin-toast-container');
        }

        // Create Confirm Modal if not exists
        if (!document.getElementById('admin-confirm-modal')) {
            const modalHTML = `
                <div class="modal fade" id="admin-confirm-modal" tabindex="-1" aria-hidden="true" style="z-index: 100000;">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content border-0 shadow-lg">
                            <div class="modal-header border-0 pb-0">
                                <h5 class="modal-title font-weight-bold d-flex align-items-center gap-2" id="admin-confirm-title">
                                    <i class="material-symbols-rounded text-warning" id="admin-confirm-icon">warning</i>
                                    <span>Confirm Action</span>
                                </h5>
                                <button type="button" class="btn-close text-dark" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body py-3">
                                <p class="text-sm text-secondary mb-0" id="admin-confirm-message">
                                    Are you sure you want to proceed?
                                </p>
                            </div>
                            <div class="modal-footer border-0 pt-0">
                                <button type="button" class="btn btn-outline-secondary btn-sm mb-0" id="admin-confirm-cancel-btn" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="button" class="btn bg-gradient-danger btn-sm mb-0" id="admin-confirm-ok-btn">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const div = document.createElement('div');
            div.innerHTML = modalHTML.trim();
            document.body.appendChild(div.firstChild);
        }
    }

    /**
     * Show a Material Dashboard styled Toast message
     * @param {string} message - Message text
     * @param {'success'|'danger'|'warning'|'info'} type - Toast type
     * @param {string} [title] - Optional custom title
     */
    showToast(message, type = 'success', title = '') {
        this.createDOMStructures();

        const typeConfig = {
            success: { bg: 'bg-gradient-success', icon: 'check_circle', defaultTitle: 'Success' },
            danger: { bg: 'bg-gradient-danger', icon: 'error', defaultTitle: 'Error' },
            warning: { bg: 'bg-gradient-warning', icon: 'warning', defaultTitle: 'Warning' },
            info: { bg: 'bg-gradient-info', icon: 'info', defaultTitle: 'Information' }
        };

        const config = typeConfig[type] || typeConfig.info;
        const toastTitle = title || config.defaultTitle;
        const toastId = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white ${config.bg} border-0 show shadow-lg mb-2" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex p-2">
                    <div class="toast-body d-flex align-items-center gap-2 py-1 text-white text-sm" style="flex: 1;">
                        <i class="material-symbols-rounded text-lg">${config.icon}</i>
                        <div>
                            <strong class="d-block text-white text-xs">${toastTitle}</strong>
                            <span>${message}</span>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = toastHTML.trim();
        const toastEl = wrapper.firstChild;
        this.toastContainer.appendChild(toastEl);

        setTimeout(() => {
            if (toastEl && toastEl.parentNode) {
                toastEl.classList.remove('show');
                setTimeout(() => toastEl.remove(), 300);
            }
        }, 3800);
    }

    /**
     * Show a Material Dashboard styled confirmation modal
     * @param {Object} options
     * @param {string} [options.title] - Modal title
     * @param {string} [options.message] - Modal message text
     * @param {string} [options.confirmText] - Text for confirm button
     * @param {string} [options.cancelText] - Text for cancel button
     * @param {string} [options.confirmClass] - CSS class for confirm button (default: bg-gradient-danger)
     * @param {string} [options.icon] - Material icon name (default: warning)
     * @returns {Promise<boolean>}
     */
    showConfirm({
        title = 'Confirm Action',
        message = 'Are you sure you want to proceed?',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        confirmClass = 'bg-gradient-danger',
        icon = 'warning'
    } = {}) {
        this.createDOMStructures();

        return new Promise((resolve) => {
            const modalEl = document.getElementById('admin-confirm-modal');
            const titleEl = document.getElementById('admin-confirm-title');
            const iconEl = document.getElementById('admin-confirm-icon');
            const messageEl = document.getElementById('admin-confirm-message');
            const confirmBtn = document.getElementById('admin-confirm-ok-btn');
            const cancelBtn = document.getElementById('admin-confirm-cancel-btn');

            titleEl.querySelector('span').textContent = title;
            iconEl.textContent = icon;
            messageEl.textContent = message;
            confirmBtn.textContent = confirmText;
            cancelBtn.textContent = cancelText;

            confirmBtn.className = `btn ${confirmClass} btn-sm mb-0`;

            const modalInstance = new bootstrap.Modal(modalEl);

            let resolved = false;

            const handleConfirm = () => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    modalInstance.hide();
                    resolve(true);
                }
            };

            const handleDismiss = () => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    resolve(false);
                }
            };

            const cleanup = () => {
                confirmBtn.removeEventListener('click', handleConfirm);
                modalEl.removeEventListener('hidden.bs.modal', handleDismiss);
            };

            confirmBtn.addEventListener('click', handleConfirm);
            modalEl.addEventListener('hidden.bs.modal', handleDismiss, { once: true });

            modalInstance.show();
        });
    }

    /**
     * Display field-level validation errors inside a form
     * @param {HTMLFormElement} formElement 
     * @param {Object} fieldErrors - Map of field names to error message strings
     */
    showFormErrors(formElement, fieldErrors) {
        if (!formElement) return;

        // Clear existing feedback
        formElement.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        formElement.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        if (!fieldErrors) return;

        Object.keys(fieldErrors).forEach(fieldName => {
            const input = formElement.querySelector(`[name="${fieldName}"], #${fieldName}, [id="admin${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}"], [id="customer${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}"]`);
            if (input) {
                input.classList.add('is-invalid');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'invalid-feedback d-block text-xs mt-1';
                errorDiv.textContent = fieldErrors[fieldName];
                const inputGroup = input.closest('.input-group') || input.parentElement;
                inputGroup.appendChild(errorDiv);
            }
        });
    }

    /**
     * Clear field-level validation errors inside a form
     * @param {HTMLFormElement} formElement 
     */
    clearFormErrors(formElement) {
        if (!formElement) return;
        formElement.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        formElement.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }
}

export const AdminUI = new AdminUIManager();
window.AdminUI = AdminUI;
