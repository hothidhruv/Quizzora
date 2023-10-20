// < !--firebase database-- >

// -------- Initialize Firebase -----
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

// set data in firebase 
firebase.database().ref('database name').on('value', (snap) => { // first get database 
    var storedata = firebase.database().ref().child("database name");
    var userdata = storedata.push();
    userdata.set({ // set data in database
        id: id
        // add filed
    })
});

// get data from firebase
firebase.database().ref('Users').on('value', (snap) => {
    var data = snap.val();
    console.log(data);
})

// Updata data in firebase 
firebase.database().ref('database name').on('value', (snap) => {
    snap.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        firebase.database().ref('Users').child(childKey).update({
            'name of database filed': new data,
            'name of database filed': new data
        })
    })
})

// delete data
firebase.database().ref('Users').once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        if (userid == childKey) {
            if (confirm("Are you sure?")) {
                debugger
                let userRef = firebase.database().ref('Users/' + childKey);
                userRef.remove();
                localStorage.removeItem('userid');
                window.location.reload("profile.html");
            } else {
                return ("profile.html");
            }
        }
    });
});