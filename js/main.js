var BASE_URL = "http://ptpb.pe.hu/api/";

var user;

if (!localStorage.name) {
    user = "guest";
  }
  else {
    user = localStorage.name;
    console.log(localStorage.name);
  }

(function($){
    $.fn.setCursorToTextEnd = function() {
        var $initialVal = this.val();
        this.val($initialVal);
    };
})(jQuery);


var whiteListCommands = [       // Array of valid commands
                  "itrix",
                  "event",
                  "workshop",
                  "accomodation",
                  "login",
                  "register",
                  "logout",
                  "feedback",
                  "help"
                ];
var whiteListOptions = [
                  "-l",
                  "-d",
                  "-h",
                  "-f",
                  "-g",
                  "-r"
                ];
var whiteListEvents = [        // Array of valid event names (Used to distinguish bewtween workshop name and event name.)
                  "gameofthrones",
                  "junkyardjunkies",
                  "waronroad",
                  "gam",
                  "jun",
                  "war"
                ];
var whiteListWorkshops = [    // Array of valid workshop names (Used to distinguish bewtween workshop name and event name.)
                  "ehacking",
                  "iot"
                ]


var cmdArray = [];  // Stores the chunks of single command. Eg: {0:'event',  1:'-d',  2:'gam'}

var storedCmd = []; // Stores the set of all commands typed by the user under current session.
var storedCmdIndex = -1; // The index of the command 


$(window).on('keydown', function(event) {
 // $("#cmd").val($("#cmd").val().replace(/\s+/g,' ').trim());
  if(event.keyCode == 9)
  {
      event.preventDefault();
      var keySeq = $("#cmd").val();
      var keyArray = keySeq.split(" ");
      remPreTrix(keyArray);
      var searchKey = new RegExp("^" +keyArray[keyArray.length - 1]);
      if(keyArray.length == 1)
        var resultArray  = $.grep(whiteListCommands, function(item){
            return searchKey.test(item);
        });

      else if(keyArray.length == 3 && keyArray[0] == "event")
        var resultArray  = $.grep(whiteListEvents, function(item){
            return searchKey.test(item);
        });
      else if(keyArray.length == 3 && keyArray[0] == "workshop")
        var resultArray  = $.grep(whiteListWorkshops, function(item){
            return searchKey.test(item);
        });
      else return;

      keyArray.pop();
      if(resultArray.length == 1)
          $("#cmd").val($.trim(keyArray.join(" ") + " " + resultArray) + " ");
      else
      {  
          for($i = 0; $i < resultArray.length; $i++)
            resultArray[$i] = '<span class="search-results">'+resultArray[$i]+"</span>";
          storeCmd(keySeq);
          $("#cmd").parents(".cmd-container").remove();
          printPromptS(keySeq);
          printContentWithoutprompt(resultArray.join(""));
          printPrompt(keySeq);
          $("#cmd").setCursorToTextEnd();
      }
  }
  //event.preventDefault();
  test = '';
  
  /*if (test != $('.h-loading-txt').text()) {
    $('.v-loading-container').css('opacity', '1');
  }

  else if(event.keyCode == 13 && $('.landing-container').html() != '')
  {
    $('.landing-container').html('');
    $('.landing-container').hide('0', function() {
      sho($jash);
    });
  }

  else*/

  if(event.keyCode != 13 && event.keyCode != 38 && event.keyCode != 40)
    storedCmdIndex = storedCmd.length - 1;

  else if(event.keyCode == 13)
  {
    var cmdSeq = $("#cmd").val();
    $("#cmd").parents(".cmd-container").remove();
    printPromptS(cmdSeq);
    if(!cmdSeq)
      printPrompt("");
    else if(!cmdSeq.length)
      printPrompt("");
    else{
      storeCmd(cmdSeq);
      manipulateCmd($.trim(cmdSeq.toLowerCase()));
    } 
  }

  else if(event.keyCode == 38)
  {
      event.preventDefault();
      if(storedCmdIndex > 0) $("#cmd").val(storedCmd[storedCmdIndex--]);
      else if(storedCmdIndex == 0) $("#cmd").val(storedCmd[storedCmdIndex] );

  }

  else if(event.keyCode == 40)
  {
      event.preventDefault();
      if(storedCmdIndex < storedCmd.length-1) $("#cmd").val(storedCmd[++storedCmdIndex]);
      else if(storedCmdIndex == storedCmd.length-1)$("#cmd").val("");

  }

});


function printPromptS(cmd){ // Convert input to span element
  var prompts = '<div class="cmd-container"><p>'+user+'@ITrix:~$ <span class="cmds">'+cmd+'</span></p></div>';
  $(".j-container").append(prompts);
}

function printPrompt(cmd){  // Display the command input field on the command window
  var prompt = '<div class="cmd-container"><p>'+user+'@ITrix:~$ <input type="text" id="cmd" onblur="this.focus()" class="cmd" maxlength="50" value="'+cmd+'" autofocus /></p></div>';
  $(".j-container").append(prompt);
  $("#cmd").focus();
}

function printError(error){
  $(".j-container").append('<p class="error-cmd red">Invalid '+ error +'.</p>');
  printPrompt("");
}

function printErrorWithoutPrompt (error) {
  $(".j-container").append('<p class="error-cmd red">Invalid '+ error +'.</p>');
}

function printSuccess(message){
  $(".j-container").append('<p class="error-cmd green">'+ message +' Successfully.</p>');
  printPrompt("");
}

function printErrorLog(error){
  $(".j-container").append('<p class="error-cmd red">'+ error +'</p>');
  printPrompt("");
}

function printContentWithPrompt(content){
  $(".j-container").append('<p class="reply-content">'+ content +'</p>');
  printPrompt("");
  
}

function printContentWithoutprompt(content){
  $(".j-container").append('<p class="reply-content">'+ content +'</p>');
}



function hid($element) {
  $element.css({
    opacity: '0',
  });
}

function sho($element) {
  $element.css({
    opacity: '1',
  });
}

// Function to populate storedCmd array with the command user typed.

function storeCmd(cmdSeq)  
{
    storedCmd.push(cmdSeq);
    storedCmdIndex++;
}



// Function to check if all commands are in one of the three whiteList arrays

function validateCmd(){ 
  if (cmdArray.length > 2)
  {   
      var ccmd = cmdArray[0];
      var opt = cmdArray[1];
      var args = cmdArray;
      args.shift();
      args.shift();
      var args = args.join("");
      cmdArray = [ccmd, opt, args];
  }
  for(var i = 0 , len = cmdArray.length; i < len; i++){  // Iterates thru' every element in array
     if($.inArray(cmdArray[i] , whiteListCommands) == -1) // if element is not a valid command, return false
      if($.inArray(cmdArray[i] , whiteListEvents) == -1) // if element is not a valid event name, return false
        if($.inArray(cmdArray[i] , whiteListWorkshops) == -1)  // if elementis not a valid workshop name, return false
          if($.inArray(cmdArray[i] , whiteListOptions) == -1)  // if elementis not a valid workshop name, return false
          return false;
  }
  return true;
}


// Function to remove "itrix" command in the beginning of command array
function remPreTrix(array){  
  if(array[0] == "itrix") 
    array.shift();  // To remove first element in the array.
}


// Function to check if the cmd has correct pattern
// return -1 if not valid pattern
// return -2 if not valid event/workshop name
// return command name if valid
function validatePattern(){ 
    var ccmd = cmdArray[0];
    switch(ccmd)
    {
        case "help"         :
        case "accomodation" :
        case "logout"       :
        case "feedback"     :   
        case "login"        :
        case "register"     :   if(cmdArray.length <= 2 )
                                    return ccmd;
                                else
                                    return -1;
                                  

        case "event"        :   
        case "workshop"     :   if(cmdArray.length > 3)
                                    return -1;
                                else if(cmdArray.length == 3)
                                  {
                                    var option = cmdArray[1];
                                    var currentEvent = cmdArray[2];
                                    if( ((ccmd == "event") && ($.inArray(currentEvent, whiteListEvents) == -1))
                                          ||
                                        ((ccmd == "workshop") && ($.inArray(currentEvent, whiteListWorkshops) == -1))) 
                                           return -2; 
                                    else {
                                      cmdArray = [ccmd, option, currentEvent];
                                      return cmdArray.join(",");
                                    }
                                  }
                                else return 1;
                                
        default             :   return -1;

    }
}


/* manipulate cmd -- Starts*/

function manipulateCmd(cmdSeq){
    cmdArray = cmdSeq.split(" ");
    if(!validateCmd())
      return printError("'"+cmdArray[0]+ "'. Command not found");
    remPreTrix(cmdArray);
    var ccmd = validatePattern(); 
    if(ccmd == -1)  return printError(cmdArray[0] + " Command not found");
    else if(ccmd == -2) return printError(cmdArray[0] + " Command not found");
    else {
      fetchContent(cmdArray);
    }
    
}

function fetchContent (cmdArray) {

  switch(cmdArray[0]) {
    case 'event': if (cmdArray.length >= 2)
                  {
                    switch(cmdArray[1])
                    {
                      case '-l':  console.log('dgh');
                                  break;

                      case '-d':  
                                  $.ajax({
                                    url: baseUrlEvent(cmdArray[2]),
                                    type: 'GET',
                                    dataType: 'json',
                                    //data: {eventName: cmdArray[2]},
                                    beforeSend: function () {
                                    showLoading();
                                    },
                                  })
                                  .done(function(data) {
                                    hideLoading();
                                    eventProcessing(data);
                                    console.log("success");
                                  })
                                  .fail(function() {
                                    console.log("Event Fetching error");
                                    printErrorLog('event');
                                  });

                                  break;

                        case '-h': eventHelp();
                                    break;

                        default  : eventHelp();
                      }
                    }
                    else {
                      eventHelp();
                    }
                    break;

      case 'workshop':  if (cmdArray.length >= 2)
                        {
                          switch(cmdArray[1])
                          {
                            case '-l':  console.log('dgh');
                                        break;

                            case '-d':  
                                        $.ajax({
                                          url: 'workshop.json',
                                          type: 'GET',
                                          dataType: 'json',
                                          data: {workshopName: cmdArray[2]},
                                          beforeSend: function () {
                                            showLoading();
                                          },
                                        })
                                        .done(function(data) {
                                          hideLoading();
                                          workshopProcessing(data);
                                          console.log("success" + data);
                                        })
                                        .fail(function() {
                                          console.log("workshop Fetching error");
                                          printErrorLog('workshop');
                                        });

                                        break;

                              case '-h': workshopHelp();
                                         break;

                              default  : workshopHelp();
                                         break;
                          }
                        }
                        else {
                          workshopHelp();
                        }

                      break;

      case 'login':   if (user != "guest" || localStorage.name == null) {
                        if (cmdArray.length >= 1) 
                        {
                          switch(cmdArray[1])
                          {
                            case '-f': alert('facebook signIn');
                                       break;
                            case '-g': alert('google signIn');
                                       break;
                            case '-r': loginProcessing();
                                       break;
                            default  : loginProcessing();
                                       break;
                          }
                        }
                        else if (cmdArray.length == 1){
                          loginProcessing();
                        }
                      }
                      else {
                        printSuccess("Already LoggedIn");
                      }
                    

                    break;

      case 'register': if (cmdArray.length >= 1) 
                        {
                          switch(cmdArray[1])
                          {
                            case '-f': alert('facebook signIn');
                                       break;
                            case '-g': alert('google signIn');
                                       break;
                            case '-r': registerProcessing();
                                       break;
                            default  : registerProcessing();
                          }
                        }
                        else if (cmdArray.length == 1){
                          registerProcessing();
                        }

                        break;

        case 'logout': localStorage.removeItem('name');
                       user = "guest";
                       printSuccess('Logged out');
                       break; 



  }

}

function register(name, email, password, mobile){
  $.ajax({
    url: baseUrlRegister(),
    type: 'POST',
    dataType: 'json',
    data: {name: name, email: email, password: password, phone: mobile},
  })
  .done(function(data) {
    console.log("success");
    printSuccess("Registered");
  })
  .fail(function() {
    console.log("error");
    printErrorLog("Reistration");
  });
  
}
function showLoading () {
  // body...
  $('j-container').append('<p class="loading">Loading...</p>');
}

function hideLoading () {
  // body...
  $('.loading').hide('fast');
}
function eventProcessing(data){
  var eventData = data;
  $.get('templates/_event.html', function(data) {console.log(data);
    $('.j-container-temp').html(data).delay(10, eventManipulation(eventData)).delay(10, printContentWithPrompt($('.j-container-temp').html()));
  })
}

function eventManipulation(eventData){
    event = eventData;
    $('.event-name').text(event.event_name);
    $('.event-desc').text(event.description);
    $('.event-rules').text(event.rules);
    $('.event-contact').text(event.contact);
}


function workshopProcessing(data){
  var workshopData = data;
  $.get('templates/_workshop.html', function(data) {console.log(data);
    $('.j-container-temp').html(data).delay(10, workshopManipulation(workshopData)).delay(10, printContentWithPrompt($('.j-container-temp').html()));
  })
}

function workshopManipulation(workshopData){
    workshop = workshopData;
    $('.workshop-name').text(workshop.name);
    $('.workshop-desc').text(workshop.desc);
    $('.workshop-contact').text(workshop.contact);
}


function loginProcessing(){
  $.get(baseTempUrl('login'), function(data) {
    /*optional stuff to do after success */
    $('.j-container-temp').html(data);
    printContentWithoutprompt($('.inp-email').html());
    $('.inp-email-field:first').focus(); 
    $('.inp-email-field').keydown(function(event) {
      if(event.keyCode == 13)
      { 
         event.stopPropagation();

         var email = $.trim($(this).val());
          $('.reply-content:last').remove();
         if (isValidEmailAddress(email))
         {
            printContentWithoutprompt('<p>email: '+ email +'</p>');
         }
         else {
            printContentWithoutprompt('<p>email: '+ email +'</p>');
            printError('email');
            return 0;
         }
         
         printContentWithoutprompt($('.inp-password').html());
         $('.inp-password-field:first').focus(); 
         $('.inp-password-field').keydown(function(event) 
         {
          if(event.keyCode == 13)
          { 
            event.stopPropagation();

            var password = $.trim($(this).val());
            $('.reply-content:last').remove();
            if (isValidPassword(password)) 
            {
              printContentWithoutprompt('<p>password: ********** </p>');
              login(email,password);
            }
            else {
              printContentWithoutprompt('<p>password: ********** </p>');
              printError('password. Atleast 6 characters.');
            }
          }

         });   
      }

    });

  });
}

function registerEmail (emailInputDom) {
  printContentWithoutprompt(emailInputDom);
   $('.inp-email-field:first').focus(); 
    $('.inp-email-field').keydown(function(event) {
      if(event.keyCode == 13)
      { 
         event.stopPropagation();

           email = $.trim($(this).val());
          $('.reply-content:last').remove();
           if (isValidEmailAddress(email))
           {
              printContentWithoutprompt('<p>email: '+ email +'</p>');
              registerPassword(passwordInputDom);
             }
           else {
              printContentWithoutprompt('<p>email: '+ email +'</p>');
              printErrorWithoutPrompt('email');
              registerEmail(emailInputDom);

              return false;
            }
      }
    });
}

function registerName (nameInputDom) {
  printContentWithoutprompt(nameInputDom);
   $('.inp-name-field:first').focus(); 
   console.log("fdf");
    $('.inp-name-field').keydown(function(event) {
      if(event.keyCode == 13)
      { 
         event.stopPropagation();

           name = $.trim($(this).val());
          $('.reply-content:last').remove();
           if (isValidName(name))
           {
              printContentWithoutprompt('<p>Name: '+ name +'</p>');
               registerEmail(emailInputDom);
             }
           else {
              printContentWithoutprompt('<p>Name: '+ name +'</p>');
              printErrorWithoutPrompt('Name');
              registerName(nameInputDom);

              return false;
            }
      }
    });
}

function registerPassword (passwordInputDom) {
  printContentWithoutprompt(passwordInputDom);
   $('.inp-password-field:first').focus(); 
    $('.inp-password-field').keydown(function(event) {
      if(event.keyCode == 13)
      { 
         event.stopPropagation();

           password = $.trim($(this).val());
          $('.reply-content:last').remove();
           if (isValidPassword(password))
           {
              printContentWithoutprompt('<p>Password: ********** </p>');
              registerMobile(mobileInputDom);
              return true;
             }
           else {
              printContentWithoutprompt('<p>Password: **********</p>');
              printErrorWithoutPrompt('Password');
              registerPassword(passwordInputDom);

              return false;
            }
      }
    });
}

function registerMobile (mobileInputDom) {
   var deferred = new $.Deferred();

  printContentWithoutprompt(mobileInputDom);
   $('.inp-mobile-field:first').focus(); 
    $('.inp-mobile-field').keydown(function(event) {
      if(event.keyCode == 13)
      { 
         event.stopPropagation();

           mobile = $.trim($(this).val());
          $('.reply-content:last').remove();
           if (isValidMobile(mobile))
           {
              printContentWithoutprompt('<p>Mobile: '+ mobile +'</p>');
              register(name, email, password, mobile);
             }
           else {
              printContentWithoutprompt('<p>Mobile: '+ mobile +'</p>');
              printErrorWithoutPrompt('Mobile number');
              registerMobile(mobileInputDom);

              return false;
            }
      }
    });
}


function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}

function isValidPassword (password) {
  if (password.length >=6 && password.length <= 15) {
    return true;
  }
  else { return false; }
}

function isValidName (name) {
  pattern = /^[a-zA-Z ]+$/;
  if (name.length >=3 && name.length <= 30 ) {

    return true;
  }
  else { return false; }
}

function isValidMobile (name) {
  pattern = /^[7-9][0-9]{9}$/;
  if (name.length == 10 ) {

    return pattern.test(name);
  }
  else { return false; }
}



function login (email, password) {
  $.ajax({
    url: baseUrlLogin(),
    type: 'POST',
    dataType: 'json',
    data: {email: email, password: password},
  })
  .done(function(data) {
    if(typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    localStorage.setItem("name", data.message.name);
    user = localStorage.name;
    } else {
        // Sorry! No Web Storage support..
        console.log('sorry not suport');

    }
    console.log("success");
    console.log(user);
    printSuccess("LogIn")
  })
  .fail(function() {
    console.log("error");
    printErrorLog('login');
  });
  
}

function baseTempUrl (argument) {
  return 'templates/_'+argument+'.html';
}

function baseUrlEvent (argument) {
  return BASE_URL+"event/"+argument;
}

function baseUrlWorkshop (argument) {
  return BASE_URL+"workshop/"+argument;  
}

function baseUrlLogin() {
  return BASE_URL+"login";  
}

function baseUrlRegister() {
  return BASE_URL+"user/new";  
}


/* manipulate cmd -- Ends*/
var name, email, password, mobile;
var nameInputDom, emailInputDom, passwordInputDom, mobileInputDom; 

function registerProcessing () {
  $.get(baseTempUrl('register'), function(data) {
    $('.j-container-temp').html(data);
     emailInputDom = $('.inp-email').html();
     nameInputDom = $('.inp-name').html();
     passwordInputDom = $('.inp-password').html();
     mobileInputDom = $('.inp-mobile').html();
     if (registerName(nameInputDom)){
      register();
     }

    //registerPassword(passwordInputDom);
    //registerMobile(mobileInputDom);
    //console.log(registerName(nameInputDom));
  });
}

$jash = $('#jash');



printPrompt("");

hid($('.v-loading-container'));

//hid($jash);




$('#binary-logo').animate({
  opacity: 1
}, 3000, 'linear');


// getting content from the li
var texts = [];
$('#v-loading-content ul li').each(function(index, el) {
  texts.push('> ' + $(this).text())
});
console.log(texts);

// text typing effects
$('#v-loading').vintageTxt({
  text: texts,
  textSpeed: 10,
  linePause: 0,
  maxRows: 30,
  promptEnabled: false,
  // onFinishedTyping: function() {
  //   $('#v-loading').delay(500).fadeOut(2000);
  // }
});

//console.log($('#vtxt_ContentText').first().contents().first());

function scrolling() {
  $("#vtxt_ContentText").text('');
}
var hTexts = [];
$('.h-loading-content ul li').each(function(index, el) {
  hTexts.push($(this).text());
  console.log(hTexts)
});


var ind = 0;
var total = hTexts.length;
var interval = 600;
setInterval(function() {

  $('.h-loading-txt').html(hTexts[ind]).fadeIn("slow");

  if (ind == total) {
    clearInterval(ind);
  } else {
    ind++;
  }

}, interval);


$(".h-loading-fill")
  .on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
    function(e) {
      $('.h-loading-fill').hide('10', 'linear');
      $(".h-loading-container").css('background-color', '#000');
      $('.h-loading-txt').text('');
      $(".h-loading-container").attr({
        data: '1'
      });
      $('.h-loading-title').text("**** PRESS ENTER ****").addClass('blinker');
      $(this).off(e);
    });

