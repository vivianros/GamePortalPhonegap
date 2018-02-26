//var firebase = require("firebase");
/* 
var config = {
    apiKey: "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
    authDomain: "universalgamemaker.firebaseapp.com",
    databaseURL: "https://universalgamemaker.firebaseio.com",
    storageBucket: "universalgamemaker.appspot.com",
  };
 */
  
 


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
//        firebase.initializeApp(config);
    },
};

function createAccount(){
   // firebase.initializeApp(defaultAppConfig);

    // Initialize another app with a different config
    //var otherApp = firebase.initializeApp(otherAppConfig, "other");
    //var defaultAuth = firebase.auth();    

    var phoneNum = $("#phone").val();
    //alert(phoneNum);
   
    firebase.auth().signInWithPhoneNumber(phoneNum, new firebase.auth.RecaptchaVerifier('sign-in-button', {
        'size': 'invisible'
      }))
    .then(function (confirmationResult) {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
     
    }).catch(function (error) {
      // Error; SMS not sent
      //...
      console.log(error);
      alert("SMS NOT SENT");
//      window.recaptchaVerifier.render().then(function(widgetId) {
//        grecaptcha.reset(widgetId);
//      });
    });
}

function onSubmit(){
    var code = $("#security").val();
    var confirmationResult = window.confirmationResult;
    confirmationResult.confirm(code).then(function (result) {
        // User signed in successfully.
        var user = result.user;
        console.log(user);
        alert("Login Success");
        // ...
      }).catch(function (error) {
        // User couldn't sign in (bad verification code?)
        // ...
        alert("Login Failed");
      });
}