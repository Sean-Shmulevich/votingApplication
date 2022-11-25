var stompClient = null;

//something from the tutorial code not exaactly sure what it does.
function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#sendQuestion").html("");
}

let numA = 0;
let numB = 0;

//server to user socket connection
//admin controls posts to the sendResponce which the user is listening to. 
function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        // console.log('Connected: ' + frame);
        //recieves many responses 100+ per question asked
        stompClient.subscribe('/topic/sendResponse', function (greeting) {
            // the clients page should change when this is recieved.
            // client button is also a socket to the server side. 
            // numA = 0;
            // numB = 0;
            // console.log(JSON.parse(greeting.body).content);
            showGraph(JSON.parse(greeting.body));
        });

        //web socket for listening to changes to the presenting screen.
        stompClient.subscribe('/topic/slide', function (greeting) {
            // the clients page should change when this is recieved.
            // client button is also a socket to the server side. 
            // numA = 0;
            // numB = 0;
            // console.log(JSON.parse(greeting.body).content);
            let path = window.location.pathname;
            let page = path.split("/").pop();
            if(page !== "admin.html"){
                if(JSON.parse(greeting.body).content === "goPreview"){
                    window.location.replace("preview.html");
                }
                else if(JSON.parse(greeting.body).content === "goVoting"){
                    window.location.replace("voting.html");
                }
                else{
                    window.location.replace(JSON.parse(greeting.body).content);
                } 
            }
            console.log(greeting.body);
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

function sendName(val) {
    numA = 0;
    numB = 0;
    makePostCurrQ(val, 30);
    stompClient.send("/app/hello", {}, JSON.stringify({'name': val}));

    const yourFunction = async () => {
        //inital post requests
        
        // await setTimeout(() => { makePostCurrQ(val, 30); }, 5000);
        // ! kinda bad code here these should be removed when the button is clicked again.
        //sends 16x post requests per question asked to keep track of the time this should be done on the backend it would be way more clean and accurate
        //DONT try to send another question before 30 seconds is done. 
        await setTimeout(() => { makePostCurrQ(val, 28); }, 2000);
        await setTimeout(() => { makePostCurrQ(val, 26); }, 4000);
        await setTimeout(() => { makePostCurrQ(val, 24); }, 6000);
        await setTimeout(() => { makePostCurrQ(val, 22); }, 8000);
        await setTimeout(() => { makePostCurrQ(val, 20); }, 10000);
        await setTimeout(() => { makePostCurrQ(val, 18); }, 12000);
        await setTimeout(() => { makePostCurrQ(val, 16); }, 14000);
        await setTimeout(() => { makePostCurrQ(val, 14); }, 16000);
        await setTimeout(() => { makePostCurrQ(val, 12); }, 18000);
        await setTimeout(() => { makePostCurrQ(val, 10); }, 20000);
        await setTimeout(() => { makePostCurrQ(val, 8); }, 22000);
        await setTimeout(() => { makePostCurrQ(val, 6); }, 24000);
        await setTimeout(() => { makePostCurrQ(val, 4); }, 26000);
        await setTimeout(() => { makePostCurrQ(val, 2); }, 28000);
        await setTimeout(() => { makePostCurrQ(val, -1); }, 30000);
      };
      yourFunction();

}

function makePostCurrQ(val, qTime){
    console.log(qTime);
    const data = { 'name': val, "questionNumber": qTime };

    fetch('/setQuestion', { 
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
        // console.log('Success:', data);
        })
        .catch((error) => {
        console.error('Error:', error);
        });
}

function showGraph(message) {
    // console.log(message["questionNumber"]);
    // console.log(numA, numB);
    if(message["content"] === 'A'){
        numA++;
    }
    else{
        numB++;
    }

    //svg graph image added right into the dom. 100% votes for a should be the full size of the viewport maybe a little less
    //that why we have 2.4 its calculated to make the step size bigger. 
    let graphImage = `<!-- sample rectangle -->
    <!-- sample rectangle -->
    <svg width="350" height="300" viewBox="0 0 350 300"xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="250" x2="330" y2="250" stroke="black" />
        <text x="80" y="285" style="font: bold 30px Verdana,Geneva,sans-serif; ">A</text>
        <text x="250" y="285" style="font: bold 30px Verdana,Geneva,sans-serif; ">B</text>

        
        <rect x="41" y="${227 - 2.4*numA}" width="100" height="${21 + (2.4*numA)}" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
        <rect x="211" y="${227 - 2.4*numB}" width="100" height="${21 + 2.4*numB}" style="fill:rgb(255,0,0);stroke-width:3;stroke:rgb(0,0,0)" />

        <text x="80" y="246" style="fill:white;font: bold 25px Verdana,Geneva,sans-serif; ">${numA}</text>
        <text x="250" y="246" style="fill:white;font: bold 25px Verdana,Geneva,sans-serif; ">${numB}</text>
    </svg>`;
    //add graph image to correct responce graph.
    document.getElementById(`sendQuestion${message["questionNumber"]}`).innerHTML =("<tr><td>" + graphImage + "</td></tr>")
    // $(`#sendQuestion${message["questionNumber"]}`) = ("<tr><td>" + graphImage + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    connect();
    // $( "#connect" ).click(function() { connect(); });
    // $( "#disconnect" ).click(function() { disconnect(); });

    // send button handlers for all of the questions. 
    // to add more just add here and in the admin .html add another secuential ID.
    let path = window.location.pathname;
    let page = path.split("/").pop();
    if(page !== "voting.html" && localStorage.getItem("adminUser") === "true"){
        $( "#send1" ).click(function() { sendName("1"); });
        $( "#send2" ).click(function() { sendName("2"); });
        $( "#send3" ).click(function() { sendName("3"); });
        $( "#send4" ).click(function() { sendName("4"); });
        $( "#send5" ).click(function() { sendName("5"); });
        $( "#send6" ).click(function() { sendName("6"); });
        $( "#send7" ).click(function() { sendName("7"); });
        $( "#send8" ).click(function() { sendName("8"); });
        $( "#send9" ).click(function() { sendName("9"); });
        $( "#send10" ).click(function() { sendName("10");});

        $( "#slide1" ).click(function() { stompClient.send("/app/changeScreen", {}, JSON.stringify({'name': "askQ1.html"})); });
        $( "#slide2" ).click(function() { stompClient.send("/app/changeScreen", {}, JSON.stringify({'name': "askQ2.html"})); });
        $( "#slide3" ).click(function() { stompClient.send("/app/changeScreen", {}, JSON.stringify({'name': "askQ3.html"})); });
        $( "#slide4" ).click(function() { stompClient.send("/app/changeScreen", {}, JSON.stringify({'name': "askQ4.html"})); });
        $( "#slide5" ).click(function() { stompClient.send("/app/changeScreen", {}, JSON.stringify({'name': "askQ5.html"})); });
        $( "#slide6" ).click(function() { stompClient.send("/app/changeScreen", {}, JSON.stringify({'name': "askQ6.html"})); });
        $( "#slide7" ).click(function() { stompClient.send("/app/changeScreen", {}, JSON.stringify({'name': "askQ7.html"})); });
        $( "#slide8" ).click(function() { stompClient.send("/app/changeScreen", {}, JSON.stringify({'name': "askQ8.html"})); });
        $( "#slide9" ).click(function() { stompClient.send("/app/changeScreen", {}, JSON.stringify({'name': "askQ9.html"})); });
        $( "#slide10" ).click(function() { stompClient.send("/app/changeScreen", {}, JSON.stringify({'name': "askQ10.html"})); });

        $( "#goQPreview" ).click(function() { stompClient.send("/app/changeScreen", {}, JSON.stringify({'name': "goPreview"})); });
        $( "#goVoting" ).click(function() { stompClient.send("/app/changeScreen", {}, JSON.stringify({'name': "goVoting"})); });
    }

});

