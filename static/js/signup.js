let otp_sent = false;

// Clear error messages every time user start typing
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        document.querySelectorAll('.has-validation').forEach(element => {
            element.classList.remove('is-invalid');
        });
    });
});

// Function to send otp 
function send_opt(email) {
    // Send otp to email
    fetch('/send_otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email})
    })
    .then(response => response.json)
    .then(data => {
        if (data.success) {
            otp_sent = true;
        }
        else {
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
    .then(response => response.json)
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

function goToTab(tabName) {
    if (tabName == 'tab-2') {
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;
        
        if (name === '') {
            document.getElementById('namePanel').classList.add('is-invalid');
            document.getElementById('namePanel').querySelector('.input-feedback').innerHTML = 'Please enter your name!';
            isValid = false;
        }
        if (email === '') {
            document.getElementById('emailPanel').classList.add('is-invalid');
            document.getElementById('emailPanel').querySelector('.input-feedback').innerHTML = 'Please enter your email!';
            isValid = false;
        }
        else if (emailRegex.test(email) == false) {
            document.querySelector('#emailPanel').classList.add('is-invalid');
            document.querySelector('#emailPanel .input-feedback').innerHTML = 'Please enter a valid email!';
            isValid = false;
        }
        // Check if email has already been taken
        if(email_taken(email)) {
            document.querySelector('#emailPanel').classList.add('is-invalid');
            document.querySelector('#emailPanel .input-feedback').innerHTML = 'This email has already been taken!';
            isValid = false;
        }

        if (!isValid) {
            return;
        }
    }
    else if (tabName == 'tab-3') {
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirm_password').value;
        let isValid = true;

        if (password === '') {
            document.getElementById('passwordPanel').classList.add('is-invalid');
            document.getElementById('passwordPanel').querySelector('.input-feedback').innerHTML = 'Please enter a password!';
            isValid = false;
        }
        if (confirmPassword === '') {
            document.getElementById('confirmPasswordPanel').classList.add('is-invalid');
            document.getElementById('confirmPasswordPanel').querySelector('.input-feedback').innerHTML = 'Please re-enter your password!';
            isValid = false;
        }
        else if (password !== confirmPassword) {
            document.getElementById('confirmPasswordPanel').classList.add('is-invalid');
            document.getElementById('confirmPasswordPanel').querySelector('.input-feedback').innerHTML = 'Passwords do not match!';
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Send Opt
        send_opt(email);

        if (!otp_sent) {
            alert('Error sending OTP. Please try again later.');
            return;
        }
    }

    openTab(tabName);
}