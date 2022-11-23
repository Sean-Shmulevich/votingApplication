var stompClient = null;

async function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
        //i dont know when this executed but it executes a bunch of times.
     }
    else {
        $("#conversation").hide();
    }
    $("#sendQuestion").html("");
}

//listening for the question to be asked.
function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        // console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/sendQuestion', function (greeting) {
            // the clients page should change when this is recieved.
            // client button is also a socket to the server side. 
            // console.log(JSON.parse(greeting.body).content);

            //!BUG the url will change before the question is over if the admin hits the button for another question
            //sending to the url recieved from the server. in realtime with websockets.
            const questionNumber = JSON.parse(greeting.body).content;
            //move to the question. 
            localStorage.setItem('currentQuestion', questionNumber);
            window.location.replace(`/question.html`);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

//send a or b andd the questionNumber to the server admin page. websockets 
function sendAns(ans) {
    let currQuestion = localStorage.getItem('currentQuestion');
    //make sure the user hasnt voted on this question yet.
    if(!localStorage.hasOwnProperty(`user-voted-${currQuestion}`)){
        //send the right data do the backend json names map to class names.
        stompClient.send("/app/userSend", {}, JSON.stringify({'name': ans, "questionNumber": currQuestion}));
        //the aanser is sent 
        localStorage.setItem(`user-voted-${currQuestion}`, true);
        window.location.replace("/waiting.html");
    }
    else{
        //say that the user has already voted.
        document.querySelector("h1").innerHTML = "<span style='color:red'>already VOTED</span>";
        setTimeout(() => { window.location.replace("/waiting.html") }, 1000);
    }
}

function showGreeting(message) {
    //make an svg graph.
    $("#sendQuestion").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    if(window)
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    connect();
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#sendA" ).click(function() { sendAns("A"); });
    $( "#sendB" ).click(function() { sendAns("B"); });

    var path = window.location.pathname;
    var page = path.split("/").pop();
    // console.log( page );
    //LOGIC JUST FOR TESTING.
    //clears voter information if the page path is index.html this is done mostly for testing purposes
    //but it would be nice for the admin to have a button to clear the game. this would be a third websocket probably. 
    //or the admin clears it while ppl are using it. 
    //if everybody is using it for a second time everybody thaat is currently connceted to the websocket should have their localStorage data cleared
    if(page === "index.html"){
        localStorage.clear();
    }
});

