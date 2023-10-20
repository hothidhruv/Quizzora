//display data in profile page
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
function checkuser() {
  localStorage.removeItem("storeAnswer");
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
        var useravatar = childData.userAvatar;
        document.getElementById("show-username").innerHTML = username.toUpperCase();
        document.getElementById("show-email").innerHTML = email
        document.getElementById("display-firstname").value = firstname;
        document.getElementById("display-lastname").value = lastname;
        document.getElementById("display-username").value = username;
        document.getElementById("display-email").value = email;
        document.getElementById("show-fullname").innerHTML = fullname;
        document.getElementById('nav-avatar1').src = useravatar;
        document.getElementById("profile-setting-avatar").src = useravatar;
      }
    });
  });
}

// Update user data
function updateData() {
  debugger
  const btn = document.querySelector("#updatebtn");
  const btnText = document.querySelector("#btnText");
  var userid = localStorage.getItem('userid');

  var currentFirstname = document.getElementById("display-firstname").value;
  var currentLastname = document.getElementById("display-lastname").value;
  var currentUsername = document.getElementById("display-username").value;

  const firebasedata = firebase.database().ref("Users");
  firebasedata.orderByChild('active').equalTo(0).on('value', (snap) => {
    snap.forEach(function (childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      if (userid == childKey) {
        debugger
        if (childData.firstname !== currentFirstname || childData.lastname !== currentLastname || childData.username !== currentUsername) {
          childData.firstname = currentFirstname;
          childData.lastname = currentLastname;
          // childData.username = currentUsername;
        }
        if (currentUsername == childData.username) {
          debugger
          firebase.database().ref('Users').child(childKey).update({
            'firstname': childData.firstname,
            'lastname': childData.lastname,
            'username': childData.username
          })


          btnText.innerHTML = "Sucessfully";
          btn.classList.add("updatebtn-active");
          //toast msg
          var x = document.getElementById("snackbar");
          x.className = "show";
          x.innerHTML = "Successfully update.."
          x.style.backgroundColor = "#008000a3";
          setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
          setTimeout(function () { location.reload() }, 3000);

        } else {
          var checkusername = false;
          snap.forEach(function (childSnapshot) {
            debugger
            var username = childSnapshot.val().username;
            if (currentUsername == username) {
              checkusername = true;
            }
          });
          if (checkusername) {
            var x = document.getElementById("snackbar");
            x.className = "show";
            x.style.backgroundColor = "rgb(255 0 0 / 71%)";
            x.innerHTML = "Username is already used.."
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
          } else {
            debugger
            childData.username = currentUsername;
            firebase.database().ref('Users').child(childKey).update({
              'firstname': childData.firstname,
              'lastname': childData.lastname,
              'username': childData.username
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

  const passwordupdatebtn = document.querySelector("#updatepassword");
  const passwordUpdatebtntext = document.querySelector("#updatepasswordbtnText");

  var x = document.getElementById("snackbar");
  var userid = localStorage.getItem('userid');

  var oldpassword = document.getElementById("oldpassword").value;
  var newpassword = document.getElementById("newpassword").value;
  var confirmpassword = document.getElementById("confirmpassword").value;
  if (oldpassword !== '' && newpassword !== '' && confirmpassword !== '') {
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

              x.className = "show";
              x.innerHTML = "Password change sucessfully !"
              x.style.backgroundColor = "#008000a3";
              setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);


              passwordUpdatebtntext.innerHTML = "Sucessfully";
              passwordupdatebtn.classList.add("updatebtn-active");
              setTimeout(function () { location.reload() }, 3000);

              document.getElementById("oldpassword").value = '';
              document.getElementById("newpassword").value = '';
              document.getElementById("confirmpassword").value = '';

            } else {
              x.className = "show";
              x.innerHTML = "old password is wrong"
              x.style.backgroundColor = "rgb(255 0 0 / 71%)";
              setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            }
          }
        });
      });
    } else {
      x.className = "show";
      x.innerHTML = "new password does not match"
      x.style.backgroundColor = "rgb(255 0 0 / 71%)";
      setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
  } else {
    x.className = "show";
    x.innerHTML = "Field are empty"
    x.style.backgroundColor = "rgb(255 0 0 / 71%)";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  }
}


// Logout..
function logoutUser() {
  localStorage.removeItem("userid");
  window.location.replace("../index.html");

}

// Delete account..
function deleteUser() {
  debugger
  var userid = localStorage.getItem('userid');

  if (userid) {
    firebase.database().ref('Users').orderByChild('active').equalTo(0).once('value', (snap) => {
      snap.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        if (userid == childKey) {
          var updatebtn = document.getElementById('delete-account-btn');
          updatebtn.classList.add('delete');
          setTimeout(() => updatebtn.classList.remove('delete'), 3200);
          //toast msg
          var x = document.getElementById("snackbar");
          x.className = "show";
          x.style.backgroundColor = "rgb(255 0 0 / 71%)";
          x.innerHTML = "Deleting user..."
          setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

          let active = 1;
          firebase.database().ref('Users').child(childKey).update({
              'active': active
            })
          // let userRef = firebase.database().ref('Users/' + childKey);
          // userRef.remove();
          localStorage.removeItem('userid');
          setTimeout(function () { window.location.reload("profile.html");}, 3100);
        } else {
          // return ("profilesetting.html");
        }
      });
    })
  }
}

function cancelBtn() {
  document.getElementById("oldpassword").value = '';
  document.getElementById("newpassword").value = '';
  document.getElementById("confirmpassword").value = '';
}
function changeavatar() {
  // var getSelectedValue = document.querySelector(   
  //   'input[name="imgbackground"]:checked');   
  debugger
  var userid = localStorage.getItem('userid');
  var radiobtn = document.querySelectorAll('.imgbgchk');
  let answer;
  for (i = 0; i < radiobtn.length; i++) {
    if (radiobtn[i].checked) {
      answer = radiobtn[i].id;
      let labelid = "a_" + answer;
      var getimgsrc = document.getElementById(labelid).getAttribute('src');
      break;
    }
  }
  firebase.database().ref('Users').on('value', (snap) => {
    snap.forEach(function (childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();

      if (childKey == userid) {
        childData.userAvatar = getimgsrc;

        firebase.database().ref('Users').child(childKey).update({
          'userAvatar': childData.userAvatar
        })
      }
    })
  });
  var x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML = "Avatar Update Successfully!";
  x.style.backgroundColor = "#008000a3";
  setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

}
//for modal open and close
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












