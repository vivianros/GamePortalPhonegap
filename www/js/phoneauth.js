var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
    authDomain: "universalgamemaker.firebaseapp.com",
    databaseURL: "https://universalgamemaker.firebaseio.com",
    storageBucket: "universalgamemaker.appspot.com",
  };
 
  
 


var app = {
    // Application Constructor
    initialize: function() {
        alert("initialize");
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        alert("ifReady");
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        alert('Ready');
        firebase.initializeApp(config);
    },
};

function createAccount(){

    // Initialize the default app
    var defaultApp = firebase.initializeApp(defaultAppConfig);
    console.log(defaultApp.name);  // "[DEFAULT]"
    // You can retrieve services via the defaultApp variable...
    var defaultAuth = defaultApp.auth();

    var phoneNum = document.getElementById('Phone');
    alert(phoneNum);
    var appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(function (confirmationResult) {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
     
    }).catch(function (error) {
      // Error; SMS not sent
      //...
      alert("SMS NOT SENT");
      window.recaptchaVerifier.render().then(function(widgetId) {
        grecaptcha.reset(widgetId);
      });
    });
}

function onSubmit(){
    var code = document.getElementById('security');
    confirmationResult.confirm(code).then(function (result) {
        // User signed in successfully.
        var user = result.user;
        alert("Login Success");
        // ...
      }).catch(function (error) {
        // User couldn't sign in (bad verification code?)
        // ...
        alert("Login Failed");
      });
}