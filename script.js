// Main Application JavaScript
class PakRecharge {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Amount selection
        document.querySelectorAll('.amount-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectAmount(e.target));
        });

        // Network selection
        document.querySelectorAll('.network-logo').forEach(logo => {
            logo.addEventListener('click', (e) => this.selectNetwork(e.currentTarget));
        });

        // Payment method selection
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectPaymentMethod(e.currentTarget));
        });

        // Custom amount input
        document.getElementById('customAmount').addEventListener('input', (e) => {
            this.handleCustomAmount(e.target.value);
        });

        // Form submission
        document.getElementById('topupForm').addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Phone number formatting
        document.getElementById('phone').addEventListener('input', (e) => {
            this.formatPhoneNumber(e.target);
        });

        // Network select change
        document.getElementById('network').addEventListener('change', (e) => {
            this.updateNetworkSelection(e.target.value);
        });
    }

    setupMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const nav = document.querySelector('nav');

        mobileMenu.addEventListener('click', () => {
            nav.classList.toggle('show');
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('show');
            });
        });
    }

    setupFormValidation() {
        const form = document.getElementById('topupForm');
        
        form.addEventListener('input', (e) => {
            this.validateField(e.target);
        });

        // Real-time validation for custom amount
        document.getElementById('customAmount').addEventListener('blur', (e) => {
            this.validateAmount(e.target.value);
        });
    }

    selectAmount(element) {
        // Remove selected class from all amount options
        document.querySelectorAll('.amount-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selected class to clicked option
        element.classList.add('selected');

        // Set the amount value
        const amount = element.getAttribute('data-amount');
        document.getElementById('amount').value = amount;

        // Clear custom amount
        document.getElementById('customAmount').value = '';

        // Update success message preview
        this.updateSuccessPreview();
    }

    selectNetwork(element) {
        // Remove selected class from all network logos
        document.querySelectorAll('.network-logo').forEach(logo => {
            logo.classList.remove('selected');
        });

        // Add selected class to clicked logo
        element.classList.add('selected');

        // Update network select
        const network = element.getAttribute('data-network');
        document.getElementById('network').value = network;

        // Update success message preview
        this.updateSuccessPreview();
    }

    selectPaymentMethod(element) {
        // Remove selected class from all payment options
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selected class to clicked option
        element.classList.add('selected');

        // Set the payment method value
        const method = element.getAttribute('data-method');
        document.getElementById('paymentMethod').value = method;
    }

    handleCustomAmount(value) {
        if (value) {
            // Clear selected amount options
            document.querySelectorAll('.amount-option').forEach(opt => {
                opt.classList.remove('selected');
            });

            // Set the amount value
            document.getElementById('amount').value = value;

            // Update success message preview
            this.updateSuccessPreview();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const formData = this.getFormData();
        
        if (this.validateForm(formData)) {
            this.submitForm(formData);
        }
    }

    getFormData() {
        return {
            network: document.getElementById('network').value,
            phone: document.getElementById('phone').value.replace(/\D/g, ''),
            amount: document.getElementById('amount').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            customAmount: document.getElementById('customAmount').value
        };
    }

    validateForm(data) {
        let isValid = true;

        // Reset all errors
        this.clearErrors();

        // Validate network
        if (!data.network) {
            this.showError('network', 'Please select a network');
            isValid = false;
        }

        // Validate phone number
        if (!data.phone) {
            this.showError('phone', 'Phone number is required');
            isValid = false;
        } else if (data.phone.length !== 11 || !data.phone.startsWith('03')) {
            this.showError('phone', 'Please enter a valid 11-digit Pakistani number starting with 03');
            isValid = false;
        }

        // Validate amount
        if (!data.amount) {
            this.showError('amount', 'Please select or enter an amount');
            isValid = false;
        } else if (data.amount < 10) {
            this.showError('customAmount', 'Minimum top-up amount is Rs. 10');
            isValid = false;
        } else if (data.amount > 10000) {
            this.showError('customAmount', 'Maximum top-up amount is Rs. 10,000');
            isValid = false;
        }

        // Validate payment method
        if (!data.paymentMethod) {
            this.showError('paymentMethod', 'Please select a payment method');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const fieldId = field.id;
        const value = field.value;

        this.clearFieldError(fieldId);

        switch (fieldId) {
            case 'phone':
                if (value && (value.replace(/\D/g, '').length !== 11 || !value.replace(/\D/g, '').startsWith('03'))) {
                    this.showError(fieldId, 'Please enter a valid 11-digit Pakistani number');
                }
                break;
            case 'customAmount':
                if (value) {
                    this.validateAmount(value);
                }
                break;
        }
    }

    validateAmount(amount) {
        if (amount < 10) {
            this.showError('customAmount', 'Minimum top-up amount is Rs. 10');
        } else if (amount > 10000) {
            this.showError('customAmount', 'Maximum top-up amount is Rs. 10,000');
        }
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        // Remove existing error
        this.clearFieldError(fieldId);

        // Add error class
        field.classList.add('error');

        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--danger)';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.textContent = message;

        formGroup.appendChild(errorElement);
    }

    clearErrors() {
        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        field.classList.remove('error');
        
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    formatPhoneNumber(input) {
        // Remove all non-digits
        let numbers = input.value.replace(/\D/g, '');
        
        // Format as 03XX-XXXXXXX
        if (numbers.length <= 4) {
            input.value = numbers;
        } else {
            input.value = numbers.substring(0, 4) + '-' + numbers.substring(4, 11);
        }
    }

    updateNetworkSelection(network) {
        // Update network logo selection
        document.querySelectorAll('.network-logo').forEach(logo => {
            logo.classList.remove('selected');
            if (logo.getAttribute('data-network') === network) {
                logo.classList.add('selected');
            }
        });
    }

    updateSuccessPreview() {
        const phone = document.getElementById('phone').value;
        const amount = document.getElementById('amount').value;
        
        if (phone && amount) {
            document.getElementById('successNumber').textContent = phone;
            document.getElementById('successAmount').textContent = 'Rs. ' + amount;
        }
    }

    async submitForm(formData) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'block';
        submitBtn.classList.add('loading');

        try {
            // Simulate API call delay
            await this.simulatePaymentProcessing(formData);
            
            // Show success message
            this.showSuccessMessage(formData);
            
            // Reset form
            setTimeout(() => {
                this.resetForm();
                submitBtn.disabled = false;
                btnText.style.display = 'block';
                btnLoading.style.display = 'none';
                submitBtn.classList.remove('loading');
            }, 5000);

        } catch (error) {
            this.showError('submit', 'Payment failed. Please try again.');
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            submitBtn.classList.remove('loading');
        }
    }

    simulatePaymentProcessing(formData) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // 90% success rate for demo
                if (Math.random() > 0.1) {
                    resolve(formData);
                } else {
                    reject(new Error('Payment processing failed'));
                }
            }, 2000);
        });
    }

    showSuccessMessage(formData) {
        const successMessage = document.getElementById('successMessage');
        
        // Update success details
        document.getElementById('successNumber').textContent = formData.phone;
        document.getElementById('successAmount').textContent = 'Rs. ' + formData.amount;
        
        // Show success message
        successMessage.classList.add('show');
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    resetForm() {
        document.getElementById('topupForm').reset();
        document.querySelectorAll('.amount-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelectorAll('.network-logo').forEach(logo => {
            logo.classList.remove('selected');
        });
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.getElementById('successMessage').classList.remove('show');
        this.clearErrors();
    }
}

// Bundle Package Handler
class BundleManager {
    constructor() {
        this.setupBundleEvents();
    }

    setupBundleEvents() {
        document.querySelectorAll('.bundle-card .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleBundlePurchase(e);
            });
        });
    }

    handleBundlePurchase(e) {
        const bundleCard = e.target.closest('.bundle-card');
        const bundleName = bundleCard.querySelector('h3').textContent;
        const bundlePrice = bundleCard.querySelector('.bundle-price').textContent;

        // Fill the top-up form with bundle details
        document.getElementById('amount').value = bundlePrice.replace('Rs. ', '');
        document.getElementById('customAmount').value = bundlePrice.replace('Rs. ', '');
        
        // Clear amount options selection
        document.querySelectorAll('.amount-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Show notification
        this.showNotification(`"${bundleName}" bundle selected! Please complete the top-up form.`);

        // Scroll to top-up form
        document.getElementById('topupForm').scrollIntoView({ behavior: 'smooth' });
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: var(--box-shadow);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .error {
        border-color: var(--danger) !important;
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PakRecharge();
    new BundleManager();
    
    // Add any additional initialization here
    console.log('PakRecharge website initialized successfully!');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
