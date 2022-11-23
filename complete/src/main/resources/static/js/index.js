window.addEventListener('load', (async () => {
    //restart the game localStorage.clear(); 
    //!security if the user goes back to this page they will not only be allowed to vote again, but the app will take them to the page to vote again
    //they would need to manually input the starting page so /index.html
    //when the page is loaded get the stateful current question from the backend
    //very very hyper confusing code here i am using a question to store the current question and the current time.
    //the admin updates the time every two seconds by sending post requests. 
    let q = await (await fetch("/getProjectNames")).json();
        let currentTime = q["questionNumber"];
        // console.log(localStorage.getItem(`user-voted-${q["content"]}`));

        //if the current time in the currQ backend object is -1 then there is currently no question.
        if(currentTime !== -1){
            // set the local storate stuff and go to the current question.
            localStorage.setItem('currentQuestion', q["content"]);
            localStorage.setItem('currentTime', q["questionNumber"]);

            window.location.replace(`/question.html`);
        }
        // console.log(q);
        // localStorage.setItem("connected", true);
    }));