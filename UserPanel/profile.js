var quiztype;

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
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("header").style.marginLeft = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0)";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("header").style.marginLeft = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.body.style.backgroundColor = "white";
}
function checkuser() {
  // localStorage.removeItem("storeAnswer");
  // localStorage.removeItem("quiztype");
  let userid = localStorage.getItem('userid')

  firebaseData();
  if (userid) {
    // get datafrom firebase
    firebase.database().ref('Users').on('value', (snap) => {
      snap.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        if (userid == childKey) {
          displayData();
        }
      });
    });
  } else {
    location.href = "../index.html"
  }
}
function displayData() {

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
        // document.getElementById("display-username").innerHTML = username;
        // document.getElementById("display-firstname").value = firstname;
        // document.getElementById("display-lastname").value = lastname;
        // document.getElementById("display-email").value = email;


      }
    });
  });

  // for (var i = 0; i < userdata.length; i++) {
  //   if (userid == userdata[i].id) {
  //     var firstname = userdata[i].firstname;
  //     var lastname = userdata[i].lastname;
  //     var username = userdata[i].username;
  //     var email = userdata[i].email;
  //     document.getElementById("fullname").innerHTML = firstname + ' ' + lastname;
  //     document.getElementById("display-firstname").value = firstname;
  //     document.getElementById("display-lastname").value = lastname;
  //     document.getElementById("display-username").value = username;
  //     document.getElementById("display-email").value = email;
  //     break;
  //   } else {
  //   }
  // }
  // } 
  // else {
  // location.href = "/home/bharat/Documents/sahil/Demo App/index.html";
  // }
  getjsonFile();
}

// Update user data
function updateData() {
  var userid = localStorage.getItem('userid');

  var currentFirstname = document.getElementById("display-firstname").value;
  var currentLastname = document.getElementById("display-lastname").value;
  var currentUsername = document.getElementById("display-username").value;
  var currentEmail = document.getElementById("display-email").value;

  firebase.database().ref('Users').on('value', (snap) => {
    snap.forEach(function (childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      if (userid == childKey) {

        if (childData.firstname !== currentFirstname || childData.lastname !== currentLastname || childData.username !== currentUsername || childData.email !== currentEmail) {
          childData.firstname = currentFirstname;
          childData.lastname = currentLastname;
          childData.username = currentUsername;
        }
        if (currentEmail == childData.email) {

          childData.email = currentEmail;
          firebase.database().ref('Users').child(childKey).update({
            'firstname': childData.firstname,
            'lastname': childData.lastname,
            'username': childData.username,
            'email': childData.email
          })
          //toast msg
          var x = document.getElementById("snackbar");
          x.className = "show";
          x.innerHTML = "Successfully update.."
          x.style.backgroundColor = "#008000a3";
          setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

        } else {
          var checkEmail = false;
          var checkusername = false;
          snap.forEach(function (childSnapshot) {
            var email = childSnapshot.val().email;
            var username = childSnapshot.val().username;

            if (currentEmail == email) {
              checkEmail = true;
            } else if (currentUsername == username) {
              checkusername = true
            }
          });
          if (checkEmail) {
            var x = document.getElementById("snackbar");
            x.className = "show";
            x.innerHTML = "Email is already used.."
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
          } else if (checkusername) {
            var x = document.getElementById("snackbar");
            x.className = "show";
            x.innerHTML = "Username is already used.."
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
          } else {

            childData.email = currentEmail;
            firebase.database().ref('Users').child(childKey).update({
              'firstname': childData.firstname,
              'lastname': childData.lastname,
              'username': childData.username,
              'email': childData.email
            })
          }
        }
      }
    });
  });
  displayData()
}

// Update Password
function updatePsw() {

  var userid = localStorage.getItem('userid');

  var oldpassword = document.getElementById("oldpassword").value;
  var newpassword = document.getElementById("newpassword").value;
  var confirmpassword = document.getElementById("confirmpassword").value;

  if (newpassword == confirmpassword) {
    var encryptedoldpassword = window.btoa(oldpassword);
    var encryptednewpassword = window.btoa(newpassword);
    firebase.database().ref('Users').once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        //update data
        if (userid == childKey) {
          if (encryptedoldpassword == childData.password) {
            childData.password = encryptednewpassword;
            firebase.database().ref('Users').child(childKey).update({
              'password': childData.password,
            })
            //toast msg
            var x = document.getElementById("snackbar");
            x.className = "show";
            x.innerHTML = "Password change sucessfully !"
            x.style.backgroundColor = "#008000a3";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            document.getElementById("oldpassword").value = '';
            document.getElementById("newpassword").value = '';
            document.getElementById("confirmpassword").value = '';

          } else {
            alert("old password is wrong..")
          }
        }
      });
    });
  } else {
    alert("conform and new password is not matching")
  }
}
// Logout..
function logoutUser() {
  localStorage.removeItem("userid");
  window.location.replace("../index.html");

}

// Delete account..
function deleteUser() {
  var userid = localStorage.getItem('userid');

  if (userid) {
    firebase.database().ref('Users').once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        debugger
        var childKey = childSnapshot.key;
        if (userid == childKey) {
          if (confirm("Are you sure?")) {
            debugger
            let userRef = firebase.database().ref('Users/' + childKey);
            userRef.remove();
            localStorage.removeItem('userid');
            localStorage.removeItem('useremail')
            window.location.reload("profile.html");
          } else {
            return ("profile.html");
          }
        }
      });
    })
    // for (var i = 0; i < userdata.length; i++) {
    //   if (userid == userdata[i].id) {
    //     const index = userdata.findIndex(userdata => userdata.id == userid);
    //     if (index > -1); {
    //       if (confirm("Are you sure ?")) {
    //         userdata.splice(index, 1);
    //         localStorage.removeItem('userid');
    //         localStorage.setItem('storeuser', JSON.stringify(userdata));
    //         window.location.reload("profile.html");
    //       }
    //       else {
    //         return ("profile.html")
    //       }
    //     }
    //   }
    // }
  }
}

function cancelBtn() {
  document.getElementById("oldpassword").value = '';
  document.getElementById("newpassword").value = '';
  document.getElementById("confirmpassword").value = '';
}

function getjsonFile() {
  fetch("quiz.json")
    .then((response) => response.json())
    .then((data) => {
      quiz = data;
      loadCard(quiz);
    })
}
function loadCard(quiz) {
  let counter = 0;
  let quizdata = quiz.quiztype;

  if (counter < quizdata.length) {
    for (let i = 0; i < quizdata.length; i++) {
      var card = document.createElement('div');
      // var gcard = document.createElement('div');
      let questionlist = quizdata[counter]
      var questionid = questionlist.id;
      card.innerHTML =
        '<div class="card" style = "width: 18rem;">' +
        '<div class = card-header>' +
        '<img src="' + questionlist.img + '" class="card-img-top" alt="...">' +
        '</div>' +
        '<div class="card-body">' +
        '<h5 class="card-title">' + questionlist.Heading + '</h5>' +
        '<p class="card-text">' + questionlist.Description + '</p>' +
        '</div>' +
        '<div class = card-footer>' +
        '<a href="#" class="btn btn-white btn-animate" id="attemptquiz-btn" onClick="attemptQuiz(\'' + questionid + '\')">Attempt Quiz</a>' +
        '</div>' +
        '</div>'
      var cardContainer = document.getElementById("cardContainer");
      cardContainer.appendChild(card);
      counter++
    }
  }
}
function attemptQuiz(val) {
  debugger
  quiztype = val;
  localStorage.setItem('quiztype', quiztype);
  return location.href = "../quiz/quiz.html";
}

(function () {
  "use strict";
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  //for navbar effect
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  // for back button
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  //For Mobile navbar
  on('click', '.mobile-nav-toggle', function (e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  // new Swiper('.gallery-slider', {
  //   speed: 400,
  //   loop: true,
  //   centeredSlides: true,
  //   autoplay: {
  //     delay: 5000,
  //     disableOnInteraction: false
  //   },
  //   slidesPerView: 'auto',
  //   pagination: {
  //     el: '.swiper-pagination',
  //     type: 'bullets',
  //     clickable: true
  //   },
  //   breakpoints: {
  //     320: {
  //       slidesPerView: 1,
  //       spaceBetween: 30
  //     },
  //     640: {
  //       slidesPerView: 3,
  //       spaceBetween: 30
  //     },
  //     992: {
  //       slidesPerView: 5,
  //       spaceBetween: 30
  //     },
  //     1200: {
  //       slidesPerView: 7,
  //       spaceBetween: 30
  //     }
  //   }
  // });
  // /**
  //  * Testimonials slider
  //  */
  // new Swiper('.testimonials-slider', {
  //   speed: 600,
  //   loop: true,
  //   autoplay: {
  //     delay: 5000,
  //     disableOnInteraction: false
  //   },
  //   slidesPerView: 'auto',
  //   pagination: {
  //     el: '.swiper-pagination',
  //     type: 'bullets',
  //     clickable: true
  //   },
  //   breakpoints: {
  //     320: {
  //       slidesPerView: 1,
  //       spaceBetween: 40
  //     },

  //     1200: {
  //       slidesPerView: 2,
  //       spaceBetween: 40
  //     }
  //   }
  // });


})();
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

function searchQuiz() {
  debugger
  var input, filter, ul, li, a, i, txtValue, cardbody, cardtitle;
  input = document.getElementById("searchquizbar");
  filter = input.value.toUpperCase();
  ul = document.getElementById("cardContainer");
  li = ul.getElementsByClassName("card");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("div");
    cardbody = a[1].getElementsByTagName("h5");
    cardtitle = cardbody[0];
    txtValue = cardtitle.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
      document.getElementById('quiznotfound').innerHTML = "";
    } else {
      li[i].style.display = "none";
          
    }
  }
  var cardContainer = document.getElementById("cardContainer");
  var allCard = cardContainer.getElementsByClassName("card");
  var cardvisibility = true; 
  Array.from(allCard).forEach(e => {
    if (e.style.cssText.includes('display: none') == false) {
      cardvisibility = false
    }
  });
  
  if (cardvisibility) {
    document.getElementById('quiznotfound').style.display = "block";
    document.getElementById('quiznotfound').innerHTML = "No data found";
  } 
  else{
    document.getElementById('quiznotfound').style.display = "none";
  }
}