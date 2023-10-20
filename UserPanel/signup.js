//   store user information and register user
var userpush = false;
function callfirebase() {
    var x = document.getElementById("snackbar");
    var checkEmail = false;
    var checkUsername = false;

    var formdata = {
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        userAvatar: '../img/users/avatar1.jpg',
        activeuser: 0
    }

    const firebasedata = firebase.database().ref("Users");

    if (formdata.firstname == ''
        || formdata.lastname == ''
        || formdata.username == ''
        || formdata.email == ''
        || formdata.password == '') {

       
        x.className = "show";
        x.innerHTML = "Enter data first";
        x.style.backgroundColor = "rgb(72, 204, 248)";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    } else {
        firebasedata.orderByChild('active').equalTo(0).on('value', (snap) => {
            var data = snap.val();
            for (var key in data) {
                if (formdata.email == data[key]['email']) {
                    checkEmail = true;
                    break;
                } else if (formdata.username == data[key]['username']) {
                    checkUsername = true;
                    break;
                }
            }
            if (checkEmail) {
                x.className = "show";
                x.style.backgroundColor = "rgb(255 0 0 / 71%)";
                x.innerHTML = "email already exists";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            } else if (checkUsername) {
                x.className = "show";
                x.style.backgroundColor = "rgb(255 0 0 / 71%)";
                x.innerHTML = "username already exists";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            } else {
                userpush = false;
                storeUserdata(formdata)
            }
        });
    }
}
function storeUserdata(formdata) {
    if (!userpush) {
        var checkemail = false;
        var x = document.getElementById("snackbar");
        var password = document.getElementById('password').value
        var encrypted = window.btoa(password) // encrypt password
        debugger
        var email = formdata.email;
        var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (email.match(mailformat)) {
            checkemail =  true;
        }
        if (checkemail) {
            // insert data to firebase 
            var storeuser = firebase.database().ref("Users");
            var userdata = storeuser.push();
            userpush = true;
            userdata.set({
                firstname: formdata.firstname,
                lastname: formdata.lastname,
                username: formdata.username,
                email: formdata.email,
                password: encrypted,
                userAvatar: formdata.userAvatar,
                active: formdata.activeuser
            });
            x.className = "show";
            x.innerHTML = "Successfully Register";
            x.style.backgroundColor = "#008000a3";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            setTimeout(function () {
                var element = document.getElementById('container');
                element.classList.remove('right-panel-active');
            }, 100);
            document.getElementById('firstname').value = '';
            document.getElementById('lastname').value = '';
            document.getElementById('username').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        } else {
            x.className = "show";
            x.innerHTML = "Enter valid email";
            x.style.backgroundColor = "rgb(255 0 0 / 71%)";
        }

    }
}
