var quiztype;
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
  debugger
  localStorage.removeItem("storeAnswer");
  let userid = localStorage.getItem('userid')

 
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
    // for (var i = 0; i < userdata.length; i++) {
    //   if (userid == userdata[i].id) {
    //     displayData();
    //   } else {
    //   }
    // }
  } else {
    location.href = "../index.html"
  }
}
function displayData() {
  debugger
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

        document.getElementById("fullname").innerHTML = firstname + ' ' + lastname;
        document.getElementById("display-firstname").value = firstname;
        document.getElementById("display-lastname").value = lastname;
        document.getElementById("display-username").value = username;
        document.getElementById("display-email").value = email;
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
  var userid = JSON.parse(localStorage.getItem('userid'));
  var userdata = JSON.parse(localStorage.getItem('storeuser'));

  var currentFirstname = document.getElementById("display-firstname").value;
  var currentLastname = document.getElementById("display-lastname").value;
  var currentUsername = document.getElementById("display-username").value;
  var currentEmail = document.getElementById("display-email").value;

  for (var i = 0; i < userdata.length; i++) {
    if (userid == userdata[i].id) {
      const object = userdata.find(obj => obj.id == userid);

      if (object.firstname !== currentFirstname || object.lastname !== currentLastname || object.username !== currentUsername || object.email !== currentEmail) {
        object.firstname = currentFirstname;
        object.lastname = currentLastname;
        object.username = currentUsername

        if (currentEmail == object.email) {
          object.email = currentEmail;
          const updateDataStore = JSON.stringify(userdata);
          localStorage.setItem("storeuser", updateDataStore);
          return location.href = "profile.html";
        } else {
          for (var i = 0; i < userdata.length; i++) {
            if (currentEmail == userdata[i].email) {
              alert("Email is already register..")
              return location.href = "profile.html";
            } else {

            }
          }
          object.email = currentEmail;
          const updateDataStore = JSON.stringify(userdata);
          localStorage.setItem("storeuser", updateDataStore);
          return location.href = "profile.html";
        }
      }
      else {
        alert("Please change any value...")
      }
    }
  }
}

// Update Password
function updatePsw() {
  var userid = JSON.parse(localStorage.getItem('userid'));
  var userdata = JSON.parse(localStorage.getItem('storeuser'));

  var oldpassword = document.getElementById("oldpassword").value;
  var newpassword = document.getElementById("newpassword").value;
  var confirmpassword = document.getElementById("confirmpassword").value;

  if (newpassword == confirmpassword) {
    var encryptedoldpassword = window.btoa(oldpassword);
    var encryptednewpassword = window.btoa(newpassword);

    for (var i = 0; i < userdata.length; i++) {
      var storepassword = userdata[i].password;
      if (userid == userdata[i].id) {
        const object = userdata.find(obj => obj.id == userid);
        if (encryptedoldpassword == storepassword) {
          object.password = encryptednewpassword;

          const updateDataStore = JSON.stringify(userdata);
          localStorage.setItem("storeuser", updateDataStore);
          alert("Password change succesfully")
          return location.reload("profile.html")
        } else {
          alert("old password is wrong");
        }
      }
    }
  } else {
    alert("Confirmpassword is not match")
  }
}

// Logout..
function logoutUser() {
  if (confirm("Are you sure ?")) {
    localStorage.removeItem("userid");
    window.location.replace("../index.html");
  }
  else {
    return ("profile.html")
  }

}

// Delete account..
function deleteUser() {
  var userdata = JSON.parse(localStorage.getItem('storeuser'));
  var userid = JSON.parse(localStorage.getItem('userid'));

  if (userid) {
    for (var i = 0; i < userdata.length; i++) {
      if (userid == userdata[i].id) {
        const index = userdata.findIndex(userdata => userdata.id == userid);
        if (index > -1); {
          if (confirm("Are you sure ?")) {
            userdata.splice(index, 1);
            localStorage.removeItem('userid');
            localStorage.setItem('storeuser', JSON.stringify(userdata));
            window.location.reload("profile.html");
          }
          else {
            return ("profile.html")
          }
        }
      }
    }
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
      let questionlist = quizdata[counter]
      var questionid = questionlist.id;
      card.innerHTML =
        '<div class="card" style = "width: 18rem;">' +
        '<img src="' + questionlist.img + '" class="card-img-top" alt="...">' +
        '<div class="card-body">' +
        '<h5 class="card-title">' + questionlist.Heading + '</h5>' +
        '<p class="card-text">' + questionlist.Description + '</p>' +
        '</div>' +
        '<a href="#" class="btn btn-white btn-animate" id="attemptquiz-btn" onClick="attemptQuiz(\'' + questionid + '\')">Attempt Quiz</a>' +
        '</div>'

      var cardContainer = document.getElementById("cardContainer");
      cardContainer.appendChild(card);
      counter++
    }
  }
}


function attemptQuiz(val) {
  quiztype = val;

  localStorage.setItem('quiztype', quiztype)
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