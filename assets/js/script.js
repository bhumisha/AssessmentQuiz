// Variable and Controls Declaration.
var questions;
var timeLimit =  75;
var questionIndex = 0;

// Reading JSON data from file.
function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './assets/js/data.json', true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(JSON.parse(xobj.responseText));
      }
    };  
    xobj.send(null);  
}
// Question is array which contains all data.
loadJSON(function(json) {
    console.log(json); // this will log out the json object
    questions = json; 
});

//Control Creation
var parentEl = document.getElementById("main");
var timerDivEl = document.getElementById("time_sec");
var quizInfoSetion = document.getElementById("info-box");
var startbtn = document.getElementById("start_btn");
startbtn.addEventListener("click",startQuiz);

//Start Quiz Button Click 
function startQuiz(){
    parentEl.removeChild(quizInfoSetion);
    countdown();
    createQuestionSection();
    startQuestionsQuiz();
}

var  timerStart
//Timer 
function countdown(){
       timerStart = setInterval(function(){
        timeLimit--;
        if(timeLimit >= 0){
            timerDivEl.textContent = timeLimit;
        }
        else{
            clearInterval(timerStart);
        }
    },1000);
}

function startQuestionsQuiz(){
    if(questionIndex < questions.length && timeLimit > 0){
        createAnswerPanel();
    }
    else{
        parentEl.removeChild(document.getElementById("CurrentQuestionSection"));
        clearInterval(timerStart);
        createShowScoreSection();
    }
}
//Create 
function createQuestionSection(){
    var section = document.createElement("div");
    section.id="CurrentQuestionSection";
    section.setAttribute("class","questionSection");

    var questionH1El = document.createElement("h1");
    questionH1El.id="questionH1";
    questionH1El.setAttribute("class","questionH1");

    var answerDivEl = document.createElement("div");
    answerDivEl.setAttribute("class","answerDiv");
    
    var optionEl = document.createElement("ol");
    optionEl.id="optionEL"

    var br = document.createElement("br");
    var currentQuestionResult = document.createElement("div");
    currentQuestionResult.id="currentQuestionResult";
    currentQuestionResult.setAttribute("class","showcorrectAnswerDiv");
    currentQuestionResult.appendChild(br);
    answerDivEl.appendChild(optionEl);
    section.appendChild(questionH1El);
    section.appendChild(answerDivEl);
    section.appendChild(currentQuestionResult);
    parentEl.appendChild(section);     
}


function createAnswerPanel(){
    document.querySelector("#optionEL").innerHTML="";
    var currentQuestionObj = questions[questionIndex];
    var currentQuestion = currentQuestionObj.question;
    var currentquestionOptions = currentQuestionObj.option;
    document.querySelector("#questionH1").textContent = currentQuestion;
    if(currentquestionOptions){
        var optionsLen = Object.keys(currentquestionOptions).length;
        for(var option in currentquestionOptions){
            var listoption = document.createElement("li");
            listoption.textContent = currentquestionOptions[option];
            listoption.id = option;
            listoption.addEventListener("click",function(event){
                submitAnswer(event,currentQuestionObj.correctAnswer); 
            });
            document.querySelector("#optionEL").appendChild(listoption);
        }
    }
}


function submitAnswer(event,correctAnswer){
    var selectedAns = event.target.id;
    if(selectedAns === correctAnswer){
        document.getElementById("currentQuestionResult").textContent = "Correct!"
    }
    else{
        document.getElementById("currentQuestionResult").textContent = "Wrong!"
        timeLimit-=10;
    }
    questionIndex++;
    startQuestionsQuiz();
    
}


//Form submit to  store initals with score in LocalStorage.
var submitInitials = function(event) {
    event.preventDefault();
    
    var taskNameInput = document.querySelector("input[name='initialsText']").value;
    var scoreObj = {"name":taskNameInput ,"score":timeLimit};


    var scoreArray;
    //checking the score detail
    if(localStorage.getItem("scoreDetail")){
        scoreArray= JSON.parse(localStorage.getItem("scoreDetail") || []);
    }
    else{
        scoreArray = [];
    }
    if(scoreArray){ 
        var existingRecord = false;
        for(obj in scoreArray){
            var name = scoreArray[obj].name;
            if(name.toUpperCase() === taskNameInput.toUpperCase()){
                existingRecord = true;
                scoreArray[obj].score = timeLimit;
                localStorage.setItem("scoreDetail",JSON.stringify(scoreArray));
            }
        }
        if(!existingRecord){
            scoreArray.push(scoreObj);
            localStorage.setItem("scoreDetail",JSON.stringify(scoreArray));
        }
    }
    window.location.href = "../../src/highscore.html";
  
  };

//Create Score section and form which ask for initials.
function createShowScoreSection(){

    var section = document.createElement("div");
    section.id="scoreDiv";
    section.setAttribute("class","finalResultSection");


    var questionH1El = document.createElement("h1");
    questionH1El.id="scoreH1";
    questionH1El.setAttribute("class","questionH1");
    questionH1El.textContent="All done!"
    
    var scoreH4 = document.createElement("h4");
    scoreH4.textContent= "Your Final Score is " + timeLimit;
    
    var taskForm = document.createElement("form");

    var labelForm = document.createElement("label");
    labelForm.textContent = "Enter Initials : "
    
    var inputText= document.createElement("input");
    inputText.setAttribute("type","text");
    inputText.setAttribute("name","initialsText");
    inputText.setAttribute("placeholder","Enter Initial");

    var submitForm = document.createElement("button");
    submitForm.setAttribute("type","submit");
    submitForm.textContent="Submit";
    submitForm.id="save-task";
    
    taskForm.addEventListener("submit", submitInitials);
    
    taskForm.appendChild(labelForm);
    taskForm.appendChild(inputText);
    taskForm.appendChild(submitForm);
    
    section.appendChild(questionH1El)
    section.appendChild(scoreH4)
    section.appendChild(taskForm);

    parentEl.appendChild(section);
}


  




