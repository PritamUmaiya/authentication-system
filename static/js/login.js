const emailPanel = document.getElementById('emailPanel');
const passwordPanel = document.getElementById('passwordPanel');
const email = document.getElementById('email');
const password = document.getElementById('password');
const form = document.querySelector('form');

// Clear error messages every time user start typing
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('click', () => {
        document.querySelectorAll('.form-floating').forEach(element => {
            element.classList.remove('is-invalid');
        });
    });
});

function validateForm() {
    let isValid = true;
    
    //  Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value === "") {
        emailPanel.classList.add('is-invalid');
        document.querySelector('#emailPanel ~ .form-feedback').innerHTML = 'Please enter your email!';
        isValid = false;
    }
    else if (emailRegex.test(email.value) == false) {
        emailPanel.classList.add('is-invalid');
        document.querySelector('#emailPanel ~ .form-feedback').innerHTML = 'Please enter a valid email!';
        isValid = false;
    }

    // Validate Password
    if (password.value === "") {
        passwordPanel.classList.add('is-invalid');
        document.querySelector('#passwordPanel ~ .form-feedback').innerHTML = 'Please enter your password!';
        isValid = false;
    }
    
    return isValid;
}

form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    if (validateForm()) {
        form.submit();
    }
});