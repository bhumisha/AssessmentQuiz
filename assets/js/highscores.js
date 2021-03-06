//Adding Controls
var scoresDiv = document.getElementById("scoresDiv");
var goback_btn  = document.getElementById("goback_btn");
var clear_hs_btn  = document.getElementById("clear_hs_btn");
var olEl = document.createElement("ol");
scoresDiv.appendChild(olEl);

//link back to main quiz page.
var goBackToHomePage = function(){
    window.location.href = "../index.html";
}
//Clear highscore - remove all data from local storage.
var clearHighScoreDetails = function(){
    var confirmDelete = confirm("Are you sure want to delete highscore data?")
    if(confirmDelete){
        olEl.innerHTML = "";
        localStorage.clear();
    }

}
//Reading JSON from localstorage and display in browser.
var getScoreDetail = function(){
    var scoreArray = JSON.parse(localStorage.getItem("scoreDetail") || []);
    if(scoreArray){
        for(var i=0;i<scoreArray.length;i++){
            var scoreObj = scoreArray[i];
            var liEl = document.createElement("li");
            liEl.setAttribute("class","scoreDetail");
            liEl.textContent = scoreObj.name + " - " + scoreObj.score;
            olEl.appendChild(liEl);
        }
    }

}

goback_btn.addEventListener("click",goBackToHomePage);
clear_hs_btn.addEventListener("click",clearHighScoreDetails);

//Main method call to get score detail
getScoreDetail();
