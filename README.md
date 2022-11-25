# votingApplication
web-socket voting application 

## Backend Files
- Answer.java
  - Used for sending A or B from user 
  - Also sends current question voted on
  
  - Also used to set the current question and the time left when the admin sends a
    question to the sever. The admin frontend posts the amount of seconds every 2 seconds to the
    backend. this could be done better in the backend with one endpoint and a counter in the backend

- Question.java is the return type similar usages to Answer.java

- Websocket config.java config information for the websockets

- PollController.java most important backend file

### Routes
- /topic/sendQuestion user listen in realtime to questions send from the admin
- /topic/sendResponse admin listen in realtime to responses from user
- `Question currQ = new Question("a",-1);` represents the current question and will be -1 if there
is currently no question in play
- /getProjectName - returns a new question object containing name of question and time left. as "content" and "questionNumber" respectivly
- /setQuestion this sets the current currQ to the current question with the amount of seconds left the admin will send 15x post requests to this endpoint everry 2 seconds in order for people who left the app after the question was sent to recieve the question when they come back to the app
- "/staticPage" just testing redirects. 
 
## Frontend files
- /js directory.
  - App.js - connects to websocket listens to /topic/sendQuestion websocket for admin sending a question
 clears the local storage if the game is starting at index.html basically. sends the answer to /app/userSend websocket
 sendAns() checks if the user has already voted by setting the local storage when they vote and checking it when they try to send the answer
 a user could manually clear their local storage and vote again or also open and close a bunch of incognito windows to vote again
 
 - admin.js - connects to websocket listens to /topic/sendResponce for getting the responses realtime from the users. 
  - sendName() sends the question to all of the current users and also sends 15x posts to the backend over the course of 30 seconds so that the users coming in the app after it is send and dont have an active websocket connection can see the current question when they come bacck to the app. 
  - showGraph() loads realtime data into a template string that is an svg and loads the data into it.
  - adds listeners to the button press of sending questions only on the admin.html though.
  
  - index.js - fetches the backend to see if there is an active question. sets local storage and redirects if there is one
  
  - !THIS page is probably making too many get requests. one when the page is left and one every single time the waiting page loads. why does the page load request even need to happen??
  - waiting.js if the page is hidden fetch the backend for if there is a current question. if it becomes visible then reload it
    - when the page loads check if there is a current active question. 
 
## HTML pages and the code associated with them in script tags
- waiting.html - all code linked 
- question.html - creates a timer for the user page on load. app.js sets the localStorage user question number which is then used for the data on this page
 - !! fetch the current project on load this is a request and may have scalability issues
 - fetches the /getProjectNames to see if there is a current question already in play when this page is loaded. this should only happen if they are not sent here with the websocket.
 - index.html all code linked
 - authAdmin3094a1fa.html very simple method of not allowing users to acess the admin page acess this page first to set the "adminUser" local storage to true then you can see admin and slides.
 - questionSlidesHTML - has all of the question slides pages.
  - each question loads the parameters for the results.html page into sessionStorage 
    - @param qVideo0 which video will be previewed on the results paage
    - @param qVideo1 which video will be previewed on the results paage
    - @param currQ number of the current question
    - @param qOption0 option for the question result location
    - @param qOption1 option for the question result location
- Results.html - shows two video options at the top and scroll down for a graph of the current responses and a button to send the question to the users.
  - does not show if user is not the admin user. sets very important html id's and properties in order to properly make admin.js work and send the question/show the right graph from the results page.
- Note when the slides are loaded the parameters to the result page get loaded in then when results.html loads that information is loaded into the page with basic DOM manipultion of id, href, innerHTML, and data-vbg.
- Note i am using a library for full screen youtube backgrounds https://github.com/stamat/youtube-background
 
  
