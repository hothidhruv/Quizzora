// login page
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
function signupClick() {
    var element = document.getElementById('container');
    element.classList.add('right-panel-active');
}
function signinClick() {
    var element = document.getElementById('container');
    element.classList.remove('right-panel-active');
}
function firebaseCall() {
    // --------  Initialize Firebase   -----
    const firebaseConfig = {
        apiKey: "AIzaSyCKBlvW48Q63_3ed0YAp3QhrmO68SMXSZs",
        authDomain: "quiz-f3f6d.firebaseapp.com",
        databaseURL: "https://quiz-f3f6d-default-rtdb.firebaseio.com",
        projectId: "quiz-f3f6d",
        storageBucket: "quiz-f3f6d.appspot.com",
        messagingSenderId: "966828970472",
        appId: "1:966828970472:web:aa31d4c317a59c33df545d",
        measurementId: "G-Z04F9D85VW"
    };
    firebase.initializeApp(firebaseConfig);
    return firebase;
}
function loginUser() {
    // call firebase function
    var enterEmail = document.getElementById("l-email").value;
    var enterPassword = document.getElementById("l-password").value;
    var encryptedPsw = window.btoa(enterPassword);
    var userlogin = false;

    firebase.database().ref('Users').orderByChild('active').equalTo(0).on('value', (snap) => {
        snap.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            if (enterEmail == childData.email && encryptedPsw == childData.password) {
                userlogin = true;
                localStorage.setItem('userid', childKey);
                localStorage.setItem('useremail', childData.email);
            }
        });
        if (userlogin) {
            var x = document.getElementById("snackbar");
            x.className = "show";
            x.innerHTML = "Successfully Login";
            x.style.backgroundColor = "#008000a3";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            setTimeout(function () { location.href = "profile.html"; }, 1000);
        } else {
            var x = document.getElementById("snackbar");
            x.className = "show";
            x.innerHTML = "Access denied. Valid username and password is required.";
            x.style.backgroundColor = "rgb(255 0 0 / 71%)";
            document.getElementById('l-email').value = '';
            document.getElementById('l-password').value = '';
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        }
    });
}

// checking user already login
function checkUserlogin() {
    firebaseCall();
    let userid = localStorage.getItem('userid')
    // get datafrom firebase
    if (userid) {
        firebase.database().ref('Users').orderByChild('active').equalTo(0).on('value', (snap) => {
            snap.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                if (userid == childKey) {
                    return location.href = "profile.html";
                }
            });
        });
    }
}