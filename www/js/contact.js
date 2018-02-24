    
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
        var options = new ContactFindOptions();      
        options.filter = "";     
        options.multiple = true;  
        var fields = ["displayName", "name", "phoneNumbers"];                  
        navigator.contacts.find(fields, onSuccess, onError, options);
    }   
          
         
function onSuccess(contacts) {
    setTimeout(alertContact(contacts),200);
}

function alertContact(contacts) {
    var start = new Date().getTime();
    var aResult = [];
    for (var i = 0; contacts[i]; i++) {
        console.log("Display Name = " + contacts[i].displayName);   
  
        if (contacts[i].phoneNumbers && contacts[i].phoneNumbers.length) {
            var contactPhoneList =[];
            for (var j = 0; contacts[i].phoneNumbers[j]; j++) {
                contactPhoneList.push(
                    {
                        'type' :  contacts[i].phoneNumbers[j].type,
                        'value' : contacts[i].phoneNumbers[j].value
                    }
                    );
                };
                aResult.push({
                    name:contacts[i].displayName,
                    phone:contactPhoneList
                });
            };
        }
        var li = '';
        for (var i = 0; aResult[i]; i++) {
            for (var j = 0 ; aResult[i].phone[j]; j++) {
                //alert(aResult[i].name +"--------"+ aResult[i].phone[j].type+"-----"+aResult[i].phone[j].value);
            var legalPhoneNum = aResult[i].phone[j].value.toString().replace(/[&\|\s\\\*^%$#@\-]/g,"");
                li += '<li style="text-decoration:none;">'+aResult[i].name+' '+aResult[i].phone[j].value+'  '+'<input type="button" onclick="app.sendSms('+legalPhoneNum+')" value="INVITE" /></li>';
            };
        };
        $("#contact").html(li);
        var end = new Date().getTime();
        var p = '<p id = "time">Total time used to get all contacts: '+(end - start)+'ms</p>';
        $("#time").html(p);

    }     

  function onError(contactError) {
      alert('onError!');
    }     

  function intent(){
      onDeviceReady();
    }
