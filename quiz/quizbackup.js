$(document).ready(function () {

    // Fakes the loading setting a timeout
    setTimeout(function () {
        $('body').addClass('loaded');
    }, 3500);

});

var questionCount = 0;
var score = 0;
var quiz = [];
var timecount;
var time = false;
var quiztype = localStorage.getItem("quiztype");

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
function selectQuiz() {
    firebaseCall();
    document.getElementById('navbar').style.display = "inline";
    debugger
    var li = document.querySelectorAll(".nav-li");
    for (i = 0; i < li.length; i++) {
        li[i].style.display = "none";
    }
    
    var checkquizdata = false;
    // quiz = JSON.parse(localStorage.getItem("quizdata"));
    firebase.database().ref("Quizdata").orderByChild("quizid").equalTo(quiztype).on("value", (snap) =>{
        snap.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            quiz.push(childData);
            
        });
        if (quiz) {
        for (i = 0; i < quiz.length; i++) {
            if (quiz[i].quizid == quiztype) {
                checkquizdata = true;
            }
        }
        if (checkquizdata) {
            getjsonData(true);
        } else {
            document.getElementById("selectQuiz").style.display = "inline";
            document.getElementById("quiz").style.display = "none";
        }
    }
    else {
        document.getElementById("selectQuiz").style.display = "inline";
        document.getElementById("quiz").style.display = "none";
        localStorage.removeItem('quiztime');
    }
    })
    

};
function getjsonData(isquiz) {
    debugger
    if (isquiz) {
        //old quiz
        var lastquestionid = localStorage.getItem("lastquestionid");
        if (lastquestionid !== null) {
            let quiztime = JSON.parse(localStorage.getItem('quiztime'));
            let secret = "r3<('EjwD3azQ<3X";

            for (i = 0; i < quiz.length; i++) {
                if (quiztype == quiz[i].quizid) {
                    var currentquizdata = quiz[i].data;
                    let decryptquiz = CryptoJS.AES.decrypt(currentquizdata, secret);
                    let finalquiz = decryptquiz.toString(CryptoJS.enc.Utf8);
                    quiz = JSON.parse(finalquiz);
                    timecount = quiztime
                    questionCount = lastquestionid
                    loadQuestion(quiz, false);
                    quiztimer(timecount);
                }
            }

        }
        // old quiz End
    } else {
        // new quiz api call...
        // var quiztype = localStorage.getItem("quiztype");
        var question_amout = document.getElementById("question_amount").value;
        var question_diff = document.getElementById("question_difficulty").value;
        if (question_diff == "any") {
            var url = "https://opentdb.com/api.php?category=9&type=multiple&amount=" + question_amout + "&category=" + quiztype;
        } else {
            var url = "https://opentdb.com/api.php?category=9&type=multiple&amount=" + question_amout + "&difficulty=" + question_diff + "&category=";
        }
        console.log(url);
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                quiz = data;

                //Encrypt quizdata
                let string = JSON.stringify(quiz);
                let secret = "r3<('EjwD3azQ<3X";
                quiz = CryptoJS.AES.encrypt(string, secret).toString();
                storeQuizdata(quiz);

                let decryptquiz = CryptoJS.AES.decrypt(quiz, secret);
                let finalquiz = decryptquiz.toString(CryptoJS.enc.Utf8);
                quiz = JSON.parse(finalquiz);


                loadQuestion(quiz, false);
                timecount = quiz.results.length + ":" + 00;
                quiztimer(timecount);
            })
        // new quiz api call End...
    }
};
function storeQuizdata() {
    // var quiztype = localStorage.getItem("quiztype");
    // let getquizdata = JSON.parse(localStorage.getItem('quizdata') || '[]');
    // var storequiz = {
    //     quizid: quiztype,
    //     quizdata: quiz
    // };

    // getquizdata.push(storequiz);
    // localStorage.setItem("quizdata", JSON.stringify(getquizdata));

    // firebase database
    // firebaseCall();
    var storequiz = firebase.database().ref("Quizdata");
    var quizdata = storequiz.push();

    quizdata.set({
        quizid : quiztype,
        data : quiz
    });
}

function loadQuestion(quiz, value, btnclick) {
    var prebtn = value;
    var nextbtnclick = btnclick;
    document.getElementById('navbar').style.display = "inline";
    document.getElementById("selectQuiz").style.display = "none";
    document.getElementById("quiz").style.display = "inline";
    var li = document.querySelectorAll(".nav-li");
    for (i = 0; i < li.length; i++) {
        li[i].style.display = "inline";
    }

    var allOptions = [];

    let quizdata = quiz.results;
    const questionlist = quizdata[questionCount];
    document.getElementById("attemptquestion").innerHTML = "Attempt question : " + questionCount + " / " + quizdata.length;

    if (questionCount < quizdata.length) {
        document.getElementById("all-btn").style.flexDirection = "row-reverse";
        var Answer = questionlist.correct_answer;
        var incorrectAnswer = questionlist.incorrect_answers;
        allOptions = incorrectAnswer.concat(Answer); // combine all label
        shuffleArray(allOptions);

        let question = document.getElementById('question-header');
        question.innerText = "Q: " + [Number(questionCount) + 1] + " " + questionlist.question; // print quiz question
        localStorage.setItem("lastquestionid", questionCount);

        const createRadiobutton = document.getElementById('list');
        const radiobuttons = document.querySelectorAll('.answer');

        for (i = 0; i < radiobuttons.length; i++) {
            radiobuttons[i].checked = false; // for radiobutton uncheck..
        }

        if (radiobuttons.length == allOptions.length) {
            let storeAnswer = JSON.parse(localStorage.getItem('storeAnswer') || '[]');
            for (let key = 0; key < allOptions.length; key++) {
                const labelid = "lbl" + [Number(key)];
                document.getElementById(labelid).innerHTML = allOptions[key]; // print label

                if (prebtn) { //for prevision question 
                    if (allOptions[key] == storeAnswer[questionCount].option) {
                        radiobuttons[key].checked = true; // previson question is checked 
                    }
                }
                if (nextbtnclick && storeAnswer[questionCount]) { // check next btn is clicked & storeanswer is not null
                    if (allOptions[key] == storeAnswer[questionCount].option) { // if next question is already checked
                        radiobuttons[key].checked = true; // for check next question checked label
                    }
                }
            }
        } else {  // call when user first time load quiz 
            for (let key in allOptions) {
                let li = document.createElement('li');
                li.setAttribute('class', 'radiobtn')

                let label = document.createElement("label");
                label.setAttribute('class', 'optionlabel');
                label.id = "lbl" + [Number(key)];
                label.innerText = allOptions[key];

                var input = document.createElement("input");
                input.type = "radio";
                input.name = "answer";
                input.setAttribute('class', 'answer');
                input.id = [Number(key)];

                label.appendChild(input);
                li.appendChild(input);
                li.appendChild(label);
                createRadiobutton.appendChild(li);
            }
        }
        buttonShow(quiz);
    } else {

        // document.getElementById("radioButtonsWrapElem").style.display = "none";
        // document.getElementById("conformBox").style.display = "inline";
        document.getElementById("all-btn").style.flexDirection = "row";
        document.getElementById("next-btn").setAttribute.datatoggle = 'modal';
        document.getElementById('next-btn').setAttribute.datatarget = "#exampleModal";
        buttonShow(quiz);
    }

    // next but is disabled until radiobutton is checked..
    const radiobuttons = document.querySelectorAll('.answer');
    var btn = document.getElementById('next-btn');
    var rdcheck = false;
    for (let i = 0; i < radiobuttons.length; i++) {
        if (radiobuttons[i].checked) {
            rdcheck = true;
        }
    }
    if (rdcheck == true) {
        btn.disabled = false;
        btn.style.backgroundColor = "#5777ba";
    } else {
        var form = document.getElementById('radioButtonsWrapElem');
        var value = false;
        form.addEventListener('change', function () {
            for (let i = 0; i < radiobuttons.length; i++) {
                if (radiobuttons[i].checked) {
                    value = true;
                }
            }
            if (value == true) {
                btn.disabled = false;
                btn.style.backgroundColor = "#5777ba";
            }
            else {
                btn.disabled = true;
                btn.style.backgroundColor = "#899fce";
            }

        });
        btn.disabled = true;
        btn.style.backgroundColor = "#899fce";
    }
};

function buttonShow(quiz) {
    // for next button
    if (questionCount == quiz.results.length) {
        document.getElementById('next-btn').style.display = "none";
    } else if (questionCount == 0) {
        // document.getElementById('next-btn').disabled = true;
        document.getElementById('next-btn').style.width = "100%";
        document.getElementById('next-btn').style.borderTopLeftRadius = "0px";
    } else {
        document.getElementById('next-btn').style.display = "inline";
        document.getElementById('next-btn').style.width = "49%";
        document.getElementById('next-btn').style.borderTopLeftRadius = "25px";
    }

    //For Previous button
    if (questionCount == 0) {
        document.getElementById('pre-btn').style.display = "none";
    } else if (questionCount == quiz.results.length + 1) {
        document.getElementById('pre-btn').style.display = "none";
    } else {
        document.getElementById('pre-btn').style.display = "inline"
    }

    // For submit button
    if (questionCount == quiz.results.length) {
        document.getElementById('submit-btn').style.display = "inline";
    } else {
        document.getElementById('submit-btn').style.display = "none";
    }

    // for back to quiz 
    // if (questionCount == quiz.results.length) {
    //     document.getElementById('back-btn').style.display = "inline";
    // }
    // else if (questionCount == quiz.results.length + 2) {
    //     document.getElementById('back-btn').style.display = "none";
    // } else {
    //     document.getElementById('back-btn').style.display = "none";
    // }
};

function getcheckAnswer() {

    let answers = document.querySelectorAll('.answer');
    var labelData = document.querySelectorAll('.optionlabel');
    let answer;
    console.log(labelData);
    for (i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            answer = answers[i].id;
            let labelid = "lbl" + answer;
            var getanswerlabel = document.getElementById(labelid).innerHTML;
            break;
        }
    }
    return getanswerlabel;
};

function loadnextQuestion() {
    debugger
    const checkedAnswer = getcheckAnswer();
    if (checkedAnswer != null) {
        var storeAnswer = JSON.parse(localStorage.getItem('storeAnswer') || '[]');
        let answers = {
            option: checkedAnswer
        }
        if (storeAnswer[questionCount] != null) {
            var x = storeAnswer[questionCount];
            x.option = checkedAnswer;
            const updateStoreAnswer = JSON.stringify(storeAnswer);
            localStorage.setItem("storeAnswer", updateStoreAnswer);
            questionCount++;
            let btnclick = true
            loadQuestion(quiz, false, btnclick);

        } else {
            storeAnswer.push(answers);
            localStorage.setItem('storeAnswer', JSON.stringify(storeAnswer));
            questionCount++;
            let btnclick = true
            loadQuestion(quiz, false, btnclick);
        }
    }
    else {
        alert("select any one");
    }
};

function loadpreviousQuestion() {

    questionCount--;
    loadQuestion(quiz, true);
};
function submitData() {
    let userid = localStorage.getItem("userid");
    let quiztype = localStorage.getItem("quiztype");
    let currnetDate = new Date();
    let getanswerdata = JSON.parse(localStorage.getItem('storeAnswer'));
    let quizdata = quiz.results;
    if (getanswerdata == null) {
        score = 0;
    } else {
        for (let i = 0; i < getanswerdata.length; i++) {
            if (quizdata[i].correct_answer == getanswerdata[i].option) {
                score++;
            } else {
                score;
            }
        }
    }
    // firebaseCall();
    var getScore = firebase.database().ref("Score");
    var timestamp = new Date().getTime();
    var storeScore = getScore.push();
    storeScore.set({
        score: score,
        userid: userid,
        date: timestamp,
        quiztype: quiztype

    });

    if (score == 0) {
        document.getElementById('quiz').style.display = "none";
        // document.getElementById("conformBox").style.display = "none";
        document.getElementById('success-container').style.display = 'none';
        document.getElementById('score-container').style.display = 'inline';
        document.getElementById('fail-container').style.display = 'inline';
        document.getElementById("score1").innerHTML = "Your Score is: " + score + " / " + quizdata.length;
    } else {
        document.getElementById("quiz").style.display = "none";
        document.getElementById('score-container').style.display = 'inline';
        document.getElementById('success-container').style.display = 'inline';
        document.getElementById('fail-container').style.display = 'none';
        document.getElementById("score").innerHTML = "Your Score is: " + score + " / " + quizdata.length;
    }

    // document.getElementById("submit-btn").style.display = "none";
    // document.getElementById("back-btn").style.display = "none";

    //clear localstorage quiz
    // let runningQuiz = JSON.parse(localStorage.getItem("runningQuiz"));
    // const index = runningQuiz.findIndex(runningQuiz => runningQuiz.id == quiztype);
    // if (index > -1); {
    //     runningQuiz.splice(index, 1);
    //     localStorage.setItem('runningQuiz', JSON.stringify(runningQuiz));
    // }

    // clear firebase 
    let getfirebaseQuizdata = firebase.database().ref("/Quizdata");
    var query = getfirebaseQuizdata.orderByChild("quizid").equalTo(quiztype);
    query.on("child_added", (snapshot) => {
        snapshot.ref.remove();
    })

    localStorage.removeItem('quizdata');
    localStorage.removeItem('lastquestionid');
    localStorage.removeItem('quiztime');
    time = true;
    quiztimer()

};
function backtoQuiz() {

}
function backHome() {
    localStorage.removeItem("storeAnswer");
    return location.href = "../UserPanel/profile.html";
};
function shuffleArray(allOptions) {
    for (let i = allOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
};
function DelayRedirect() {
    var seconds = 1;
    var dvCountDown = document.getElementById("selectQuiz");
    var lblCount = document.getElementById("lblCount");
    dvCountDown.style.display = "block";
    lblCount.innerHTML = "Quiz Start in : " + seconds;
    let interval = setInterval(function () {
        seconds--;
        lblCount.innerHTML = "Quiz Start in : " + seconds;
        if (seconds == 0) {
            clearInterval(interval);
            // dvCountDown.style.display = "none";
            fadeOutEffect();
            getjsonData(false);

        }
    }, 1000);
};
function fadeOutEffect() {

    var fadeTarget = document.getElementById("selectQuiz");
    fadeTarget.classList.add('fadeOut');
};
function quiztimer(timecount) {
    document.getElementById('timeleftlbl').innerHTML = "Time Left = " + " ";
    if (timecount !== undefined) {
        document.getElementById('quiztimer').innerHTML = timecount;
    }
    let interval = setInterval(function () {
        var presentTime = document.getElementById('quiztimer').innerHTML;
        var timeArray = presentTime.split(/[:]+/);
        var m = timeArray[0];
        var s = checkSecond((timeArray[1] - 1));
        if (time == true) {
            document.getElementById('quiztimer').innerHTML = "Done";
            document.getElementById('quiztimer').style.color = "green";
            clearInterval(interval);

        } else {
            if (s == 59) {
                m = m - 1;
            }
            if (m == 0 && s < 10) {
                document.getElementById('quiztimer').style.color = "red";
            }
            if (m < 0) {
                clearInterval(interval);
                document.getElementById('quiztimer').innerHTML = 'Done';
                // or...
                submitData();
            }
            let quiztime = document.getElementById('quiztimer').innerHTML = m + ":" + s;
            localStorage.setItem('quiztime', JSON.stringify(quiztime));
        }
    }, 1000);

};
function checkSecond(sec) {
    if (sec < 10 && sec >= 0) { sec = "0" + sec }; // add zero in front of numbers < 10
    if (sec < 0) { sec = "59" };
    return sec;
};
function reAttemppt() {
    localStorage.removeItem('storeAnswer');
    localStorage.removeItem('quizdata');
    localStorage.removeItem('lastquestionid');
    localStorage.removeItem('quiztime');
    return location.href = "quiz.html";
}
var counter = 0;
function viewAnswer(qcounter) {
    document.getElementById("score-container").style.display = "none";
    document.getElementById("viewAnswer").style.display = "inline";

    var quizdata = quiz.results;
    var getselectAnswer = JSON.parse(localStorage.getItem('storeAnswer'));

    if (counter < quizdata.length) {
        // for (let i = 0; i < quizdata.length; i++) {
        // var questions = document.createElement('div');
        var questionContainer = document.getElementById("question-container");
        let questionlist = quizdata[counter]
        // var selectAnswerid = "answerlbl" + counter;
        // var correctAnswerid = "correctans" + counter;

        if (counter == 0) {
            questionContainer.innerHTML =

                '<h3 id="question" style="margin-bottom: 22px;">' + "Q: " + [counter + 1] + " " + questionlist.question + '</h3>' +
                '<h6 id="selectanslbl"style="margin-bottom: 15px;">' + "Selected Answer :" + " " + getselectAnswer[counter].option + '</h6>' +
                '<h6 id="correctanslbl">' + "Correct Answer :" + " " + questionlist.correct_answer + '</h6>'


            // questionContainer.appendChild(questions);
            if (getselectAnswer[counter].option == questionlist.correct_answer) {
                document.getElementById("selectanslbl").style.color = "green";
                document.getElementById("correctanslbl").style.color = "green";
            }
            else {
                document.getElementById("selectanslbl").style.color = "#FF2E2E";
                document.getElementById("correctanslbl").style.color = "green";
            }
            btnshowviewAnswer();
        } else {
            document.getElementById("question").innerHTML = "Q: " + [counter + 1] + " " + questionlist.question;
            document.getElementById("selectanslbl").innerHTML = "Selected Answer :" + " " + getselectAnswer[counter].option;
            document.getElementById("correctanslbl").innerHTML = "Correct Answer :" + " " + questionlist.correct_answer;

            if (getselectAnswer[counter].option == questionlist.correct_answer) {
                document.getElementById("selectanslbl").style.color = "green";
                document.getElementById("correctanslbl").style.color = "green";
            }
            else {
                document.getElementById("selectanslbl").style.color = "#FF2E2E";
                document.getElementById("correctanslbl").style.color = "green";
            }
            btnshowviewAnswer();
        }
        // }
    }
};
function btnshowviewAnswer() {
    // for next button
    if (counter == quiz.results.length - 1) {
        document.getElementById('nextanswer-btn').style.display = "none";
    } else if (counter == 0) {
        document.getElementById('nextanswer-btn').style.width = "100%";
        document.getElementById('nextanswer-btn').style.borderTopLeftRadius = "0px";
    } else {
        document.getElementById('nextanswer-btn').style.display = "inline";
        document.getElementById('nextanswer-btn').style.width = "49%";
        // document.getElementById('nextanswer-btn').style.borderTopLeftRadius = "25px";
    }

    //For Previous button
    if (counter == 0) {
        document.getElementById('preanswer-btn').style.display = "none";
    } else if (counter == quiz.results.length - 1) {
        document.getElementById('preanswer-btn').style.width = "100%";
    } else {
        document.getElementById('preanswer-btn').style.display = "inline"
        document.getElementById('preanswer-btn').style.width = "49%";
    }

    // For submit button
    // if (counter == quiz.results.length) {
    //     document.getElementById('home-btn').style.display = "inline";
    // } else {
    //     document.getElementById('home-btn').style.display = "none";
    // }
};
function nextviewAnswer() {

    var qcounter = true;
    counter++;
    viewAnswer(qcounter);
};
function previewAnswer() {

    var qcounter = true;
    counter--;
    viewAnswer(qcounter);
};