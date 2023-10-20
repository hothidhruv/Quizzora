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

// Admin login
function adminLogin() {
    debugger
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var getadmin = firebase.database().ref('Admin');

    getadmin.on("value", (snap) => {
        var admindata = snap.val();
        if (email == admindata.email && password == admindata.password) {
            alert("Welcome back ADMIN..");
            localStorage.setItem("adminid", admindata.id);
            return location.replace("home.html");
        } else {
            alert("Email or password is wrong..")
        }
    })
}