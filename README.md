# websocket voting application for a film project 
this app has a user-facing end and an admin end
the user end simply receives questions from the admin and is able to vote on them
the admin side is able to send questions and also has HTML pages that allow the admin to present
the potential options for the story direction pick that option and show the resulting story on the next page. from there the admin can ask another question and continue the story.
web-socket voting application

## Backend Files
- Answer.java
  - Used for sending A or B from the user 
  - Also sends the current question to be voted on
  
  - Also used to set the current question and the time left when the admin sends a
    question to the server. The admin frontend posts the amount of seconds every 2 seconds to the
    backend. this could be done better in the backend with one endpoint and a counter in the backend

- Question.java is the return type similar usages to Answer.java

- Websocket config.java config information for the WebSockets

- PollController.java most important backend file

### Routes
- /topic/sendQuestion user listens in real time to questions sent from the admin
- /topic/sendResponse admin listens in realtime to responses from the user
- `Question currQ = new Question("a",-1);` represents the current question and will be -1 if there
is currently no question in play
- /getProjectName - returns a new question object containing the name of the question and time left. as "content" and "question number" respectivly
- /setQuestion this sets the current currQ to the current question with the amount of seconds left the admin will send 15x post requests to this endpoint every 2 seconds in order for people who left the app after the question was sent to receive the question when they come back to the app
- "/staticPage" just testing redirects. 
 
## Frontend files
- /js directory.
  - App.js - connects to WebSocket and listens to /topic/sendQuestion WebSocket for admin sending a question
 clears the local storage if the game is starting at index.html basically. sends the answer to /app/userSend WebSocket
 sendAns() checks if the user has already voted by setting the local storage when they vote and checking it when they try to send the answer
 a user could manually clear their local storage and vote again or also open and close a bunch of incognito windows to vote again
 
 - admin.js - connects to WebSocket listens to /topic/sendResponce for getting the responses realtime from the users. 
  - sendName() sends the question to all of the current users and also sends 15x posts to the backend over the course of 30 seconds so that the users coming in the app after it is sent and don't have an active WebSocket connection can see the current question when they come back to the app. 
  - showGraph() loads real-time data into a template string that is an SVG and loads the data into it.
  - adds listeners to the button press of sending questions only on the admin.html though.
  
  - index.js - fetches the backend to see if there is an active question. sets local storage and redirects if there is one
  
  - !THIS page is probably making too many get requests. one when the page is left and one every single time the waiting page loads. why does the page load request even need to happen??
  - waiting.js if the page is hidden fetch the backend for if there is a current question. if it becomes visible then reload it
    - when the page loads check if there is a current active question. 
 
## HTML pages and the code associated with them in script tags
- waiting.html - all code linked 
- question.html - creates a timer for the user page on load. app.js sets the localStorage user question number which is then used for the data on this page
 - !! fetch the current project on load this is a request and may have scalability issues
 - fetches the /getProjectNames to see if there is a current question already in play when this page is loaded. this should only happen if they are not sent here with the WebSocket.
 - index.html all code linked
 - authAdmin3094a1fa.html very simple method of not allowing users to access the admin page access this page first to set the "adminUser" local storage to true then you can see admin and slides.
 - questionSlidesHTML - has all of the question slide pages.
  - each question loads the parameters for the results.html page into sessionStorage 
    - @param qVideo0 which video will be previewed on the results page
    - @param qVideo1 which video will be previewed on the results page
    - @param currQ number of the current question
    - @param qOption0 option for the question result location
    - @param qOption1 option for the question result location
- Results.html - shows two video options at the top and scroll down for a graph of the current responses and a button to send the question to the users.
  - does not show if a user is not the admin user. sets very important id's in the HTML and properties in order to properly make admin.js work and send the question/show the right graph from the results page.
- Note when the slides have loaded the parameters to the result page get loaded in then when results.html loads that information is loaded into the page with basic DOM manipulation of id, href, innerHTML, and data-vbg.
- Note I am using a library for full-screen youtube backgrounds https://github.com/stamat/youtube-background
- Note overall 100 users and 100 WebSocket connections. 10 questions 1000 posts over 1 hour over WebSocket. for each question asked there is a maximum of 3x get requests to the server. 3req x 10q * 100 users 3000 requests. this could be an issue but they are just simple to get requests sooo idk.