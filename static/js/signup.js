// Clear error messages every time user start typing
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        document.querySelectorAll('.has-validation').forEach(element => {
            element.classList.remove('is-invalid');
        });
    });
});

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

        if (!isValid) {
            return;
        }
    }
    else if (tabName == 'tab-3') {

    }

    openTab(tabName);
}


