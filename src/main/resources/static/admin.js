var stompClient = null;

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

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        // console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/sendResponse', function (greeting) {
            // the clients page should change when this is recieved.
            // client button is also a socket to the server side. 
            // numA = 0;
            // numB = 0;
            // console.log(JSON.parse(greeting.body).content);
            showGreeting(JSON.parse(greeting.body));
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
    stompClient.send("/app/hello", {}, JSON.stringify({'name': val}));

    const yourFunction = async () => {
        makePostCurrQ(val, 30);
        // await setTimeout(() => { makePostCurrQ(val, 30); }, 5000);
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

function showGreeting(message) {
    // console.log(message["questionNumber"]);
    console.log(numA, numB);
    if(message["content"] === 'A'){
        numA++;
    }
    else{
        numB++;
    }


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
    $( "#send1" ).click(function() { sendName("1"); });
    $( "#send2" ).click(function() { sendName("2"); });
    $( "#send3" ).click(function() { sendName("3"); });
    $( "#send4" ).click(function() { sendName("4"); });
    $( "#send5" ).click(function() { sendName("5"); });
    $( "#send6" ).click(function() { sendName("6"); });
    $( "#send7" ).click(function() { sendName("7"); });
    $( "#send8" ).click(function() { sendName("8"); });
    $( "#send9" ).click(function() { sendName("9"); });
    $( "#send10" ).click(function() { sendName("10"); });
});

