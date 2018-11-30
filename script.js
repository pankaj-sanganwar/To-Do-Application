var url = new URL(window.location.href);
var username = url.searchParams.get('username');

console.log(username);
function logInPage() {
    if ('none' === document.getElementById("login").style.display) {
        document.getElementById("login").style.display = 'block';
        document.getElementById("register").style.display = 'block';
    } else {
        document.getElementById("login").style.display = 'none';
    }
}

function RegisterPage() {
    if ('none' === document.getElementById("register").style.display) {
        document.getElementById("register").style.display = 'block';
        document.getElementById("login").style.display = 'none';
    } else {
        document.getElementById("register").style.display = 'none';
    }
}

function previewFile() {
    var preview = document.querySelector('img'); //selects the query named img
    var file = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
    console.log(preview.src);
}

function registerUser() {
    var user = new Object();
    var regExp = /[^a-z,^A-Z]/;
    var gender = 'male';
    if (!document.getElementById('male').checked) {
        gender = 'female';
    }

    user.firstName = document.getElementById('firstname').value;
    user.lastName = document.getElementById('lastname').value;
    user.gender = gender;
    user.userid = document.getElementById('userid').value;
    user.password = document.getElementById('userpassword').value;
    user.Address = document.getElementById('Address').value;
    user.photo = document.getElementById('img').src;

    if ('' !== document.getElementById('photo').value) {
        user.photo = document.getElementById('photo').value;
    }
    if (true === validateUserRegistrationDetails(user)) {
        localStorage.setItem(user.userid, JSON.stringify(user));
    }

    if (username) {
        cancel();
    } else {
        window.location.href = 'index.html';
    }
}

function logIn() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (isNaN(username) && isNaN(password)) {
        validateUserLogInDetails(username, password);
    } else {
        alert('Username or Password missing');
    }
}

function cancel() {
    if ('' === username) {
        window.location.href = "index.html";
    } else {
        window.location.href = 'home.html?username=' + username;
    }
}

function Register() {
    window.location.href = "register.html";
}

function validateUserLogInDetails(username, password) {
    var userDetails = JSON.parse(localStorage.getItem(username));
    if (null === userDetails || undefined === userDetails) {
        alert('Username or Password is incorrect');
        return;
    } else if (password === userDetails.password) {
        window.location.href = 'home.html?username=' + username;
    } else {
        alert('Username or Password is incorrect');
        return;
    }
}

function validateUserRegistrationDetails(user) {
    var nameRegExp = /[^a-z,^A-Z]/;

    if (null !== user.firstName.match(nameRegExp) || '' === user.firstName) {
        alert('Please enter valid first name');
        return false;
    }

    if (null !== user.lastName.match(nameRegExp) || '' === user.lastName) {
        alert('Please enter valid last name');
        return false;
    }

    if (null !== user.Address.match(nameRegExp) || '' === user.Address) {
        alert('Please enter valid Address');
        return false;
    }

    if (null !== user.userid.match(/[^a-z,^A-z,^0-9,@,.]/) || '' === user.userid) {
        alert('Please enter valid user id');
        return false;
    }

    if (null !== localStorage.getItem(user.userid) && '' === username) {
        alert('user id already exists');
        return false;
    }
    return true;
}
