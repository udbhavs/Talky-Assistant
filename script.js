const {remote} = require('electron');
const nodeCmd = require('node-cmd');
const {Menu, BrowserWindow, MenuItem, shell} = remote;

var questions = [
    "what",
    "who",
    "where",
    "how",
    "when",
    "why",
    "tell me",
    "tell"
];

var instructions = [
    "set",
    "say",
    "search",
    "retrieve"
]; 

var greetings = [
    "hi",
    "hello",
    "greetings"
];

var bye = [
    "bye",
    "goodbye"
];

var selfProperties = {
    "colour": "my favourite color is blue",
    "game": "my favorite game is forza motorsport",
    "number": "my favourite number is 42",
    "animal": "my favourite animal is a dog",
    "creator": "Udbhav created me",
    "developer": "Udbhav created me",
    "maker": "Udbhav created me",
    "name": "I am Talky, a voice assistant"
};

var userDefined = {
    
};

var udKeys = [];
function resetKeys() { udKeys = []; for (var i in userDefined) udKeys.push(i); }

var badWords = [
    "fuck",
    "fucker"
]

window.onload = function() {
    
    var recognition = new webkitSpeechRecognition();
    ballEval = ballEval2;
    
    function execCmd(s) {
        nodeCmd.get(s, function(err, data, stderr) {
            console.log(data);
        });
    }
    
    function botEval(s) {
        var tokens = tokenize(s);
        //priorities
        if (arrc(instructions, tokens) && arrc(questions, tokens)) {
            if (arrc(instructions, tokens, true) > arrc(questions, tokens, true)) 
                instrucEval(s);
            else qEval(s);
        }
        else if (arrc(instructions, tokens)) {
            instructEval(s);
        }
        else if (arrc(questions, tokens)) {
            qEval(s);
        }
        else if (arrc(greetings, tokens)) {
            greetEval(s);
        }
        else if (arrc(bye, tokens)) {
            byeEval(s);
        }
        else if (arrc(badWords, tokens)) {
            badEval(s);
        }
        else {
            say("Sorry, I did not understand that");
        }
    }
    
    function say(s) {
        speakEffects(s);
        nodeCmd.get('speak "' + s + '"', function(err, data, strderr) {
            speakStop(s);
            console.log(data);
            console.log("Error(s): " + err);
        });
    }
    
    function speakEffects(s) {
        console.log(s);
        ballChange(true);
    }
    
    function speakStop(s) {
        ballChange(false);
    }
    
    function byeEval(s) {
        say("Bye, " + username());
    }
    
    function greetEval(s) {
        say("Hi, " + username());
    }
    
    function badEval(s) {
        say("NO, FUCK YOU");
    }
    
    function qEval(s) {
        if (tokenize(s)[0] == "search") {
            say("Searching the web...");
            window.location.href = "http://google.com/search?q=" + s;
        }
        else if (tokenize(s).includes("your")) {
            selfProperty(s.substring(s.indexOf("your") + "your".length));
        }
        else {
            say("Searching the web...");
            window.location.href = "http://google.com/search?q=" + s;
        }
    }
    
    function instructEval(s) {
        var tokens = tokenize(s);
        if (tokens.includes("say")) {
            say(s.substring(s.indexOf("say") + "say".length));
        }
        else if (tokens.includes("search")) {
            say("Searching the web");
            window.location.href = "http://google.com/search?q=" + s.substring(5);
        }
        else if (tokens.includes("set")) {
            var tks = s.substring("set ".length).split(" to ");
            userDefined[tks[0].trim()] = tks[1].trim();
            resetKeys();
            say("Definition set");
        }
        else if (tokens.includes("retrieve")) {
            var s2 = s.split(" ", 2)[1];
            console.log(s2);
            if (udKeys.includes(s2)) {
                say("You defined " + s2 + " as " + userDefined[s2]);
            }
            else {
                say("Unable to retrieve the item");
            }
        }
    }
    
    function selfProperty(s) {
        s = tokenize(s);
        var none = true;
        for (var i in selfProperties) {
            if (s.includes(i)) {
                none = false;
                say(selfProperties[i]);
            }
        }
        if (none) {
            say("I do not know. Searching the web");
            window.location.href = "http://google.com/search?q=" + s;
        }
    }
    
    function tokenize(s) {
        return s.split(/[\s,.+?!]/);
    }
    
    function hear() {
        recognition.start();
        recognition.onresult = function(event) {
            var text = event.results[0][0].transcript;
            console.log(text);
        }
    }
    
    function ballEval2() {
        botEval(document.getElementById("input").value.toLowerCase());
    }
    
    function ballChange(bool) {
        var ball = document.getElementById("ball");
        if (bool) {
            ball.style.backgroundColor = "lightblue";
            ball.style.borderRadius = "30%";
        }
        else {
            ball.style.backgroundColor = "lightgreen";
            ball.style.borderRadius = "50%";
        }
    }
    
    function username() {
        if (userDefined["username"]) {
            return userDefined["username"];
        }
        else {
            return "please set your username";
        }
    }
    
    var native = {
        
    }
    
}

function arrc(arr1, arr2, index) {
    var flag = false;
    var ind;
    for (var i in arr2) {
        if (arr1.includes(arr2[i])) {
            flag = true;
            ind = arr1.indexOf(arr2[i]);
        }
    }
    if (!index) return flag;
    else return ind;
    
}

var ballEval;