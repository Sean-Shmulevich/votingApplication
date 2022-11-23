window.addEventListener("load", () => {

    let path = window.location.pathname;
    let page = path.split("/").pop();

    let pageNum = parseInt(page);
    sessionStorage.setItem("currQ", pageNum);
    console.log(parseInt(page));

    });