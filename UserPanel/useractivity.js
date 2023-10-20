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
var quiz;
var completequizflage = false;
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
    return firebase;

}
function displayData() {


    firebaseData();
    let userid = localStorage.getItem('userid');
    firebase.database().ref('Users').on('value', (snap) => {
        snap.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            if (userid == childKey) {
                var firstname = childData.firstname;
                var lastname = childData.lastname;
                var username = childData.username;
                var email = childData.email;
                var fullname = firstname + ' ' + lastname;
                var avatar = childData.userAvatar;

                document.getElementById("show-fullname").innerHTML = fullname;
                document.getElementById("show-username").innerHTML = username.toUpperCase();
                document.getElementById("show-email").innerHTML = email;
                document.getElementById("nav-avatar").src = avatar;
            }
        });
    });
    getjsonFile();
}
// Logout..
function logoutUser() {
    localStorage.removeItem("userid");
    window.location.replace("../index.html");

}
function getjsonFile() {
    fetch("quiz.json")
        .then((response) => response.json())
        .then((data) => {
            quiz = data;
            getRunningQuiz(quiz);
            showCompleteQuiz();
        })
}
function getRunningQuiz(quiz) {
    document.getElementById("runningquiz-container").style.display = "flex";
    document.getElementById("running-quiz-a").classList.add('active');
    debugger
    let getquizdata = firebase.database().ref("/Quizdata");
    let quizdata = quiz.quiztype;
    getquizdata.on('child_added', (snap) => {
        var runnigquizdata = []
        var data = snap.val();
        runnigquizdata.push(data);
        showRunningQuiz(runnigquizdata, quizdata);
    });
    document.getElementById("msg").innerHTML = "NO DATA FOUND!"
    document.getElementById("runningquiz-container").style.display = "flex";
}

function showRunningQuiz(runnigquizdata, quizdata) {
    document.getElementById("msg").style.display = "none"
    document.getElementById("runningquiz-container").style.display = "flex";
    document.getElementById("running-quiz-a").classList.add('active');
    document.getElementById("complete-quiz-a").classList.remove('active');
    document.getElementById("complete-quiz").style.display = "none";
    var quiztype = localStorage.getItem("quiztype");
    for (let i = 0; i < quizdata.length; i++) {
        for (j = 0; j < runnigquizdata.length; j++) {
            if (quizdata[i].id == runnigquizdata[j].quizid) {
                let questionlist = quizdata[i];
                var questionid = questionlist.id;
                let card = document.createElement('div');
                card.innerHTML =
                    '<div class="card">' +
                    '<div class="card-image">' +
                    '<img src="' + questionlist.img + '" alt="Card Image">' +
                    '</div>' +
                    '<div class="card-content">' +
                    '<h3>' + questionlist.Heading + '</h3>' +
                    '<a href="#" onClick="attemptQuiz(\'' + questionid + '\')">Attempt</a>' +
                    '</div>' +
                    '</div>'

                var cardContainer = document.getElementById("runningquiz-container");
                cardContainer.appendChild(card);
            }
        }
    }
}

function showCompleteQuiz() {
    document.getElementById("completemsg").innerHTML = "No data found"
    document.getElementById("runningquiz-container").style.display = "none";
    document.getElementById("running-quiz-a").classList.remove('active');
    document.getElementById("complete-quiz").style.display = "inline";
    document.getElementById("complete-quiz-a").classList.add('active');
    var userid = localStorage.getItem("userid");
    debugger

    let getcompltedQuiz = firebase.database().ref("/Score");
    getcompltedQuiz.orderByChild('userid').equalTo(userid).on('child_added', (snap) => {
        debugger
        var data = snap.val();
        var quizdata = quiz.quiztype;
        // var quiztype = localStorage.getItem("quiztype");
        for (let i = 0; i < quizdata.length; i++) {
            if (quizdata[i].id == data.quiztype) {
                document.getElementById("completemsg").style.display = "none";
                let questionlist = quizdata[i];
                let card = document.createElement('div');
                card.innerHTML =
                    '<div class="card">' +
                    '<div class="card-image">' +
                    '<img src="' + questionlist.img + '" alt="Card Image">' +
                    '</div>' +
                    '<div class="card-content">' +
                    '<h3>' + questionlist.Heading + '</h3>' +
                    '<a href="#">Score is: ' + data.score + '/ ' + data.totalque + '</a>' +
                    '</div>' +
                    '</div>'
                var cardContainer = document.getElementById("completedquiz-container");
                cardContainer.appendChild(card);

            }
        }
    });

}
function runningquiz() {
    document.getElementById("runningquiz-container").style.display = "flex";
    document.getElementById("running-quiz-a").classList.add('active');
    document.getElementById("running-quiz-icon").classList.add('active');
    document.getElementById("complete-quiz-a").classList.remove('active');
    document.getElementById("complete-quiz-icon").classList.remove('active');
    document.getElementById("complete-quiz").style.display = "none";
}
function completequiz() {
    document.getElementById("complete-quiz").style.display = "flex";
    document.getElementById("complete-quiz-a").classList.add('active');
    document.getElementById("complete-quiz-icon").classList.add('active');
    document.getElementById("running-quiz-a").classList.remove('active');
    document.getElementById("running-quiz-icon").classList.remove('active');
    document.getElementById("runningquiz-container").style.display = "none";
}

function downloadReport() {
    var userid = localStorage.getItem("userid");
    let getcompltedQuiz = firebase.database().ref("/Score");

    getcompltedQuiz.orderByChild('userid').equalTo(userid).on('value', (snap) => {
        debugger
        var data = snap.val();
        var quizdata = quiz.quiztype;
        snap.forEach(function (childSnapshot) {
            // var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            // var quiztype = localStorage.getItem("quiztype");
            for (let i = 0; i < quizdata.length; i++) {
                if (quizdata[i].id == childData.quiztype) {
                    let quizdate = new Date(childData.date).toLocaleDateString();
                    let questionlist = quizdata[i];
                    let card = document.createElement('tr');
                    card.innerHTML =
                        '<td>' + questionlist.Heading + '</td>' +
                        '<td>' + childData.totalque + '</td>' +
                        '<td>' + childData.score + '</td>' +
                        '<td>' + quizdate + '</td>' 
                        
                    var cardContainer = document.getElementById("tblData");
                    cardContainer.appendChild(card);
                }

            }
        });   
         exportTableToExcel('fultbl');
    });

}

function exportTableToExcel(tableID, filename = 'Quizreport') {
    // alert("kldncf");
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

    // Specify file name
    filename = filename ? filename + '.xls' : 'Quizreport.xls';

    // Create download link element
    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
    }
    var table =  document.getElementById("fultbl");
    var totalRowCount = table.rows.length;
    for(i = 1; i<totalRowCount; i++){
        document.getElementById("fultbl").deleteRow(1);
    }
   
}