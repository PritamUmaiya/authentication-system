let otp_sent = false;
let full_name = document.getElementById('name');
let email = document.getElementById('email');
let password = document.getElementById('password');
let confirmPassword = document.getElementById('confirm_password');
let otp = document.getElementById('otp');

// Clear error messages every time user start typing
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        document.querySelectorAll('.has-validation').forEach(element => {
            element.classList.remove('is-invalid');
        });
    });
});

// Function to send otp 
async function send_opt() {
    // Send otp to email
    await fetch('/send_otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email.value})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            otp_sent = true;
        }
        else {
            console.log(data.error)
            alert('Error sending OTP. Please try again later.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function email_taken(email) {
    // Check if email has already been taken
    fetch('/email_exists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email})
    })
    .then(response => response.json())
    .then(data => {
        if (data.email_exists) {
            return true;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    return false;
}

function openTab(tabName) {
    // Hide all tabs
    var tabs = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.add('d-none');
    }

    // Show the selected tab if user provides valid response
    var tab = document.getElementById(tabName);
    tab.classList.remove('d-none');
}

async function goToTab(tabName) {
    if (tabName == 'tab-2') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;
        
        if (full_name.value === '') {
            document.getElementById('namePanel').classList.add('is-invalid');
            document.getElementById('namePanel').querySelector('.input-feedback').innerHTML = 'Please enter your name!';
            isValid = false;
        }
        if (email.value === '') {
            document.getElementById('emailPanel').classList.add('is-invalid');
            document.getElementById('emailPanel').querySelector('.input-feedback').innerHTML = 'Please enter your email!';
            isValid = false;
        }
        else if (emailRegex.test(email.value) == false) {
            document.querySelector('#emailPanel').classList.add('is-invalid');
            document.querySelector('#emailPanel .input-feedback').innerHTML = 'Please enter a valid email!';
            isValid = false;
        }
        // Check if email has already been taken
        if(email_taken(email.value)) {
            document.querySelector('#emailPanel').classList.add('is-invalid');
            document.querySelector('#emailPanel .input-feedback').innerHTML = 'This email has already been taken!';
            isValid = false;
        }

        if (!isValid) {
            return;
        }
    }
    else if (tabName == 'tab-3') {
        let isValid = true;

        if (password.value === '') {
            document.getElementById('passwordPanel').classList.add('is-invalid');
            document.getElementById('passwordPanel').querySelector('.input-feedback').innerHTML = 'Please enter a password!';
            isValid = false;
        }
        if (confirmPassword.value === '') {
            document.getElementById('confirmPasswordPanel').classList.add('is-invalid');
            document.getElementById('confirmPasswordPanel').querySelector('.input-feedback').innerHTML = 'Please re-enter your password!';
            isValid = false;
        }
        else if (password.value !== confirmPassword.value) {
            document.getElementById('confirmPasswordPanel').classList.add('is-invalid');
            document.getElementById('confirmPasswordPanel').querySelector('.input-feedback').innerHTML = 'Passwords do not match!';
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Send Opt
        await send_opt(document.getElementById('email').value);

        if (!otp_sent) {
            alert('Error sending OTP. Please try again later.');
            return;
        }
    }

    openTab(tabName);
}

async function otp_matched() {
    try {
        const response = await fetch('/verify_otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp: otp.value })
        });

        const data = await response.json();
        return data.success === true; // Return true or false based on the response
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function complete_signup() {
    // Check if otp is correct
    if (!(await otp_matched())) {
        document.getElementById('otpPanel').classList.add('is-invalid');
        document.getElementById('otpPanel').querySelector('.input-feedback').innerHTML = 'Invalid OTP!';
        return;
    }

    // Create a new form element
    let form = document.createElement('form');
    form.method = 'POST';
    form.action = '/signup';

    // Create hidden input fields to store form data
    let fullNameInput = document.createElement('input');
    fullNameInput.type = 'hidden';
    fullNameInput.name = 'name';
    fullNameInput.value = full_name.value;
    form.appendChild(fullNameInput);

    let emailInput = document.createElement('input');
    emailInput.type = 'hidden';
    emailInput.name = 'email';
    emailInput.value = email.value;
    form.appendChild(emailInput);

    let passwordInput = document.createElement('input');
    passwordInput.type = 'hidden';
    passwordInput.name = 'password';
    passwordInput.value = password.value;
    form.appendChild(passwordInput);

    let confirmPasswordInput = document.createElement('input');
    confirmPasswordInput.type = 'hidden';
    confirmPasswordInput.name = 'confirm_password';
    confirmPasswordInput.value = confirmPassword.value;
    form.appendChild(confirmPasswordInput);

    // Append the form to the body and submit it
    document.body.appendChild(form);
    form.submit();
}
