        //when you page and come back this code will be executed and it allows for the question to be correct even if the user
        //goes to like check instagram or something after the question has already been posted
        document.onvisibilitychange = async function() {

            if (document.visibilityState === 'visible') {
                //reload when the user leaves and come back again.
                window.location.reload();
            }
            else if(document.visibilityState === 'hidden'){
                            //i dont know or think i need this re-load.
            //there is a fetch every time the user leaves the page and comes back.
            let q = await (await fetch("/getProjectNames")).json();
            let currentTime = q["questionNumber"];
            localStorage.setItem('currentTime', q["questionNumber"]);
            localStorage.setItem('currentQuestion', q["content"]);
            //only do anything really if the question is currently not been answered and the time is still not -1
            if(currentTime !== -1 && localStorage.getItem(`user-voted-${q["content"]}`) !== "true"){
                localStorage.setItem('currentQuestion', q["content"]);
                localStorage.setItem('currentTime', q["questionNumber"]);

                window.location.replace(`/question.html`);
            }
            }
        };
        window.addEventListener('load', (async () => {
        //on load check if there is a question I dont know if this code is necessary because you only ever get to waiting from a question and i dont want to do extra fetches
        let q = await (await fetch("/getProjectNames")).json();
        localStorage.setItem('currentQuestion', q["content"]);
        localStorage.setItem('currentTime', q["questionNumber"]);
            let currentTime = q["questionNumber"];
            if(currentTime !== -1 && localStorage.getItem(`user-voted-${q["content"]}`) !== "true"){
                localStorage.setItem('currentQuestion', q["content"]);
                localStorage.setItem('currentTime', q["questionNumber"]);
                window.location.reload();

                window.location.replace(`/question.html`);
            }
            // console.log(localStorage.getItem("connected"), typeof(localStorage.getItem("connected")));
            // if(localStorage.getItem("connected") === "false"){
            //     localStorage.setItem("connected", true);
            //     console.log("here");
            //     window.location.reload();
            // }
        }));