const emailPanel = document.getElementById('emailPanel');
const passwordPanel = document.getElementById('passwordPanel');
const email = document.getElementById('email');
const password = document.getElementById('password');
const form = document.querySelector('form');


// Check for valid inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('click', () => {
        document.querySelectorAll('.form-floating').forEach(element => {
            element.classList.remove('is-invalid');
        });
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    
});