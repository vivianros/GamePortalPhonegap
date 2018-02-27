    
//var $ = require("jquery");      

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
   
    bindEvents: function() {
        document.addEventListener('deviceready', onDeviceReady, false);
    },

    sendSms: function(phoneNum) {
        var number = phoneNum; /* iOS: ensure number is actually a string */
        var message = "JOIN THE GAME";
        console.log("number=" + number + ", message= " + message);

        //CONFIGURATION
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
                //intent: '' // send SMS without open any other app
            }
        };

        var success = function () { alert('Message sent successfully'); };
        var error = function (e) { alert('Message Failed:' + e); };
        sms.send(number, message, options, success, error);
    },

};

 function onDeviceReady() {           
     /* 
        var options = new ContactFindOptions();      
        options.filter = "";     
        options.multiple = true;  
        var fields = ["displayName", "name", "phoneNumbers"];                  
        navigator.contacts.find(fields, onSuccess, onError, options);
*/
      
        navigator.contactsPhoneNumbers.list(onSuccess, onError);
        
    }   
          
         
function onSuccess(contacts) {
    alertContact(contacts);
}

function alertContact(contacts) {
    var start = new Date().getTime();
    var li = '';
    console.log(contacts.length + ' contacts found');
    for(var i = 0; i < contacts.length; i++) {
       console.log(contacts[i].id + " - " + contacts[i].displayName);
       for(var j = 0; j < contacts[i].phoneNumbers.length; j++) {

          var phone = contacts[i].phoneNumbers[j];
          console.log("===> " + phone.type + "  " + phone.number + " (" + phone.normalizedNumber+ ")");
          var legalPhoneNum = phone.number.toString().replace(/[&\|\s\\\*^%$#@\-]/g,"");
          li += '<li style="text-decoration:none;"><img src="'+contacts[i].thumbnail+'" width="50" height="50"/>'+contacts[i].displayName+' '+phone.number+'  '+'<input type="button" onclick="app.sendSms('+legalPhoneNum+')" value="INVITE" /></li>';
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

  function intent(){
      onDeviceReady();
    }
