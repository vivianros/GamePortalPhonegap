//var firebase = require("firebase");
/* 
var config = {
    apiKey: "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
    authDomain: "universalgamemaker.firebaseapp.com",
    databaseURL: "https://universalgamemaker.firebaseio.com",
    storageBucket: "universalgamemaker.appspot.com",
  };
 */
  
new_element=document.createElement("script");
new_element.setAttribute("type","text/javascript");
new_element.setAttribute("src","js/trans-compiled.js");
document.body.appendChild(new_element);

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
//       firebase.initializeApp(config);

         var options = '';
         $.getJSON("countrycode.json",function(result){
            $.each(result, function(i, field){
             //console.log(field);
             //console.log(field.name);
             options += '<option value = "'+field.code+'">'+field.name+"(+"+field.callingCode+")"+'</option>';
            });
            $('.selectCountry').html(options);
            $('.selectCountry').select2({
                placeholder: "Select a country",
            });
          });        
         //$('select').comboSelect();
    },
};

function checkPhone(){
    var phoneNumber = $("#phone").val();
    var regionCode=$("select option:selected");

    if(isValidNumber(phoneNumber,regionCode)){
       var number = phoneNumberParser(phoneNumber,regionCode);
       console.log(number);
       createAccount(number);
    }

  }

function createAccount(phoneNum){
   // firebase.initializeApp(defaultAppConfig);

    // Initialize another app with a different config
    //var otherApp = firebase.initializeApp(otherAppConfig, "other");
    //var defaultAuth = firebase.auth();    

    console.log(phoneNum);
   
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
        alert("Login Success Phonenumber: "+user.phoneNumber);
        var regionCode = getRegionCode(user.phoneNumber);
        findContacts(regionCode);
        // ...
      }).catch(function (error) {
        // User couldn't sign in (bad verification code?)
        // ...
        alert("Login Failed");
      });
}

function findContacts(regionCode){
    navigator.contactsPhoneNumbers.list(onSuccess(regionCode), onError);
}

function onSuccess(contacts,regionCode) {
    alertContact(contacts,regionCode);
}

function alertContact(contacts,regionCode) {
    var start = new Date().getTime();
    var li = '';
    console.log(contacts.length + ' contacts found');
    for(var i = 0; i < contacts.length; i++) {
       console.log(contacts[i].id + " - " + contacts[i].displayName);
       for(var j = 0; j < contacts[i].phoneNumbers.length; j++) {

          var phone = contacts[i].phoneNumbers[j];
          //console.log("===> " + phone.type + "  " + phone.number + " (" + phone.normalizedNumber+ ")");
          //var legalPhoneNum = phone.number.toString().replace(/[&\|\s\\\*^%$#@\-]/g,"");
          if(isMobileNumber(phone.number)){
            var phoneNumber = phoneNumberParser(phone,regionCode);
            li += '<li style="text-decoration:none;">'+contacts[i].displayName+' '+phoneNumber+'  '+'<input type="button" onclick="app.sendSms('+phoneNumber+')" value="INVITE" /></li>';
          }
          
       }
    }
    $("#contact").html(li);
    var end = new Date().getTime();
    var p = '<p id = "time">Total time used to get all contacts: '+(end - start)+'ms</p>';
    $("#time").html(p);
 }

  function onError(contactError) {
      alert('List Contacts Error!');
      console.error(error);
    }     