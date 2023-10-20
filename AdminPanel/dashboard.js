
// function createTable() {
//     var userdata = JSON.parse(localStorage.getItem('storeuser'));
//     var adminid = JSON.parse(localStorage.getItem("adminid"));
//     console.log(userdata)
//     if (adminid) {
//         var gridOptions = {
//             columnDefs: [
//                 { headerName: "id", valueGetter: "node.rowIndex + 1"},
//                 { field: "firstname" },
//                 { field: "lastname" },
//                 { field: "username" },
//                 { field: "email" },
//                 {
//                     resizable: "true",
//                     width: 100,
//                     headerName: "Delete",
//                     cellRenderer: ActionCellRendererComponent,


//                     cellRendererParams: {
//                         clicked: function(userdata) { debugger
//                             alert(`${userdata} was clicked`);
//                         }
//                     }
//                 },
//             ],

//             defaultColDef: { sortable: true, filter: true},
//             animateRows: true
//         };

//         const eGridDiv = document.getElementById("myGrid");
//         new agGrid.Grid(eGridDiv, gridOptions);
//         // gridOptions.api.sizeColumnsToFit(); 
//         gridOptions.api.setRowData(userdata);

//     } else {
//         return location.href = "admin.html";
//     }
// }

// Delete register user..
function checkAdmin(){
    debugger
    var adminid = localStorage.getItem("adminid");
    if(adminid){
        createTable();
    } else {
        location.href = "admin.html"
    }
}

function createTable() {
    firebaseData();
    var users = [];
    var scoreuser = []
    var tableOne = firebase.database().ref("Users");
    var tableTwo = firebase.database().ref("Score");
    var secondgridOptions = {
        columnDefs: [
            { headerName: "id", valueGetter: "node.rowIndex + 1" },
            { field: "firstname" },
            { field: "lastname" },
            { field: "username" },
            { field: "email" },
            {
                resizable: "true",
                width: 100,
                headerName: "Delete",
                cellRenderer: ActionCellRendererComponent,


                cellRendererParams: {
                    clicked: function (users) {
                        alert(`${users} was clicked`);
                    }
                }
            },
        ],
        defaultColDef: { sortable: true, filter: true },
        animateRows: true
    };
    var gridOptions = {
        columnDefs: [
            { headerName: "id", valueGetter: "node.rowIndex + 1" },
            { field: "name" },
            { field: "username" },
            { field: "email" },
            { field: "quiztype"},
            { field: "date" },
            { field: "score" },
            {
                resizable: "true",
                width: 100,
                headerName: "Delete",
                cellRenderer: ActionCellRendererComponent,


                cellRendererParams: {
                    clicked: function (users) {
                        alert(`${users} was clicked`);
                    }
                }
            },
        ],
        defaultColDef: { sortable: true, filter: true },
        animateRows: true
    };
    const eGridDiv = document.getElementById("myGrid");
    const secondeGridDiv = document.getElementById("myScoreGrid");
    new agGrid.Grid(eGridDiv, gridOptions);
    new agGrid.Grid(secondeGridDiv, secondgridOptions);

    var tableOne = firebase.database().ref("Users");
    var tableTwo = firebase.database().ref("Score");
    tableOne.orderByChild('active').equalTo(0).on('child_added', (snap) => {
        var userid = snap.key;
        var userdata = snap.val();
        // console.log(userid);
        tableTwo.orderByChild("userid").equalTo(userid).on('child_added', (snapshot) => {
            var userscore = snapshot.val();
            // console.log(userscore);
            debugger
            var getdate = new Date(userscore.date);
            var fullname = userdata.firstname +" "+ userdata.lastname;
            users.push({
                id: userid,
                name : fullname,
                username: userdata.username,
                email: userdata.email,
                score: userscore.score,
                quiztype : userscore.quiztype,
                date : getdate.toDateString()
            });
            // const eGridDiv = document.getElementById("myGrid");
            // new agGrid.Grid(eGridDiv, gridOptions);
            // gridOptions.api.sizeColumnsToFit(); 

            gridOptions.api.setRowData(users);
        });
        debugger
        scoreuser.push({
            id: userid,
            firstname: userdata.firstname,
            lastname: userdata.lastname,
            username: userdata.username,
            email: userdata.email,
    
        });
        secondgridOptions.api.setRowData(scoreuser);
    });
}

function deleteUser(id) {
    debugger
    var userdata = firebase.database().ref('Users');
    userdata.orderByChild('active').equalTo(0).on('value', (snap) => {
        var userdata = snap.val();
        for (key in userdata) {
            debugger
            var deleteUserid = key;
            if (id == deleteUserid) {
                debugger
                let active = 1;
                firebase.database().ref('Users').child(deleteUserid).update({
                    'active': active
                })
                // let userRef = firebase.database().ref('Users/' + childKey);
                // userRef.remove();
                // localStorage.removeItem('userid');
                window.location.reload("dashboard.html");
                break;
            }
        }
    });
}

// logout for admin
function logoutAdmin() {
    localStorage.removeItem("adminid");
    location.href = "admin.html";
}
function firebaseData() {
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
    return firebase
}
$(".js-open-modal").click(function () {
    $(".modalbox").addClass("visible");
});

$(".js-close-modal").click(function () {
    $(".modalbox").removeClass("visible");
});

$(document).click(function (event) {
    //if you click on anything except the modal itself or the "open modal" link, close the modal
    if (!$(event.target).closest(".modalbox,.js-open-modal").length) {
        $("body").find(".modalbox").removeClass("visible");
    }
});