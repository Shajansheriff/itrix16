var user = "guest";
var whiteListCommands = [
                  "itrix",
                  "event",
                  "workshop",
                  "accomodation",
                  "login",
                  "register",
                  "logout",
                  "feedback",
                  "ls",
                  "help",
                  "-d",
                  "-s",
                  "-l"
                ];
var whiteListEvents = [
                  "gameofthrones",
                  "junkyardjunkies",
                  "waronroad",
                  "gam",
                  "jun",
                  "war"
                ];
var whiteListWorkshops = [
                  "ehacking",
                  "iot"
                ]
var cmdArray = [];
var storedCmd = [];
function printPromptS(cmd){ // Convert input to span element
  var prompts = '<div class="cmd-container"><p>'+user+'@ITrix:~$ <span class="cmds">'+cmd+'</span></p></div>';
  $(".j-container").append(prompts);
}

function printPrompt(){
  var prompt = '<div class="cmd-container"><p>'+user+'@ITrix:~$ <input type="text" id="cmd" onblur="this.focus()" class="cmd" maxlength="50" autofocus /></p></div>';
  $(".j-container").append(prompt);
  $("#cmd").focus();
}

function printError(error){
  $(".j-container").append('<p class="error-cmd red">'+ error +'</p>');
}

function printContent(content){

  $.get('templates/_workshop.html', function(data) {
    $('.j-container-temp').append(data).delay(10, workshopManipulation());
    
  });

  // $(".j-container").append('<p class="reply-cmd">'+ content +'</p>');
  
}

function workshopManipulation (argument) {
    $('.workshop-title').text(workshop.title);
    $('.workshop-desc').text(workshop.desc);
    $('.workshop-fee').text(workshop.fee);
    $('.workshop-by').text(workshop.by);
    $('.workshop-member').text(workshop.member);

    $(".j-container").append($('.j-container-temp').html());
    printPrompt();

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

$jash = $('#jash');

printPrompt();

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

$(window).on('keypress', function(event) {
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
  if(event.keyCode == 13)
  {
    var cmdSeq = $("#cmd").val();
    $("#cmd").parents(".cmd-container").remove();
    printPromptS(cmdSeq);
    if(!cmdSeq.length)
      printPrompt();
    else{
      storeCmd(cmdSeq);
      manipulateCmd(cmdSeq.toLowerCase());
      printPrompt();
    } 
    
  }




});


function storeCmd(cmdSeq)
{
    storedCmd.push(cmdSeq);

}



// Function to check if all commands are in one of the three whiteList array
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
     if($.inArray(cmdArray[i] , whiteListCommands) == -1) // if element not present in whiteList array, return false
      if($.inArray(cmdArray[i] , whiteListEvents) == -1) // if element not present in whiteList array, return false
        if($.inArray(cmdArray[i] , whiteListWorkshops) == -1)  // if element not present in whiteList array, return false
          return false;
  }
  return true;
}


// Function to remove "itrix" command in the beginning of command array
function remPreTrix(){  
  if(cmdArray[0] == "itrix") 
    cmdArray.shift();  // To remove first element in the array.
}


// Function to check if the cmd has correct pattern
//  return -1 if not valid pattern
// return -2 if not valid event/workshop name
//  return command name if valid
function validatePattern(){ 
    var ccmd = cmdArray[0];
    switch(ccmd)
    {
        case "ls"           :
        case "help"         :
        case "accomodation" :
        case "login"        :
        case "register"     :
        case "logout"       :
        case "feedback"     :   if(cmdArray.length == 1)
                                    return ccmd;
                                else
                                    return -1;
                                

        case "event"        :   
        case "workshop"     :   
                                if(cmdArray.length < 2 ) return -1;
                                else  {
                                  var option = cmdArray[1];
                                  if(option != "-d" && option != "-s" && option != "-l")
                                   { return -1;}
                                 else if(cmdArray.length == 2 && option != "-l")
                                    return -1;
                                  else{
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
                                }
        default             :   return -1;

    }
}


/* manipulate cmd -- Starts*/

function manipulateCmd(cmdSeq){
    cmdArray = cmdSeq.split(" ");
    if(!validateCmd())
      return printError("Invalid Command!");
    remPreTrix();
    var ccmd = validatePattern(); 
    if(ccmd == -1)  return printError("Invalid Command!");
    else if(ccmd == -2) return printError("Invalid "+ cmdArray[0] + " name");
    else return printContent(ccmd);
}


/* manipulate cmd -- Ends*/

var workshop = {
  title: 'Hellow World',
  desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus iusto odio aliquam minima commodi, officia accusantium temporibus, laudantium natus necessitatibus dolorum illo id ipsum, aperiam. Et dolorem corporis sapiente quaerat!',
  fee: '600',
  url: '###',
  by: 'Microsoft',
  time: '09:30am',
  date: '27-02-2015',
  member: 'Individual Only'

}
