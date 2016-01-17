(function($){
    $.fn.setCursorToTextEnd = function() {
        var $initialVal = this.val();
        this.val($initialVal);
    };
})(jQuery);


var user = "guest";
var whiteListCommands = [       // Array of valid commands
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


function printPromptS(cmd){ // Convert input to span element
  var prompts = '<div class="cmd-container"><p>'+user+'@ITrix:~$ <span class="cmds">'+cmd+'</span></p></div>';
  $(".j-container").append(prompts);
}

function printPrompt(val){  // Display the command input field on the command window
  var prompt = '<div class="cmd-container"><p>'+user+'@ITrix:~$ <input type="text" id="cmd" onblur="this.focus()" class="cmd" maxlength="50" value="'+val+'" autofocus /></p></div>';
  $(".j-container").append(prompt);
  $("#cmd").focus();
}

function printError(error){
  $(".j-container").append('<p class="error-cmd red">'+ error +'</p>');
}

function printContent(content){
  $(".j-container").append('<p class="reply-cmd">'+ content +'</p>'); }
        
      

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
        var resultArray  = $.grep(whiteListCommands.concat(whiteListEvents), function(item){
            return searchKey.test(item);
        });
      else if(keyArray.length == 3 && keyArray[0] == "workshop")
        var resultArray  = $.grep(whiteListCommands.concat(whiteListWorkshops), function(item){
            return searchKey.test(item);
        });
      else return;

      keyArray.pop();
      if(resultArray.length == 1)
          $("#cmd").val(keyArray.join(" ") + resultArray + " ");
      else
      {  
          for($i = 0; $i < keyArray.length; $i++)
            resultArray[$i] = '<span class="search-results">'+resultArray[$i]+"</span>";
          storeCmd(keySeq);
          $("#cmd").parents(".cmd-container").remove();
          printPromptS(keySeq);
          printContent(resultArray.join(""));
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
    if(!cmdSeq.length)
      printPrompt("");
    else{
      storeCmd(cmdSeq);
      manipulateCmd(cmdSeq.toLowerCase());
      printPrompt("");
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
    remPreTrix(cmdArray);
    var ccmd = validatePattern(); 
    if(ccmd == -1)  return printError("Invalid Command!");
    else if(ccmd == -2) return printError("Invalid "+ cmdArray[0] + " name");
    else return printContent(ccmd);
}


/* manipulate cmd -- Ends*/

// var workshop;
// workshop.title = 'hello';
// workshop.desc = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur sequi nobis soluta dolores, deleniti reprehenderit assumenda delectus, non recusandae eius? Vero veritatis laborum eaque eos quia inventore ipsum voluptate veniam."
// workshop.time = '12-15-16';
/*workshop {
  title: 'hello',
  desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis, quod quos laboriosam nisi fuga aspernatur voluptates, explicabo delectus, odio in saepe reiciendis temporibus, itaque rerum error sequi mollitia nobis doloribus.',
  time: '16-01-2016'

}*/



