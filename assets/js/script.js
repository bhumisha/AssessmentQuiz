
// var questions = [{
//                     q:"Which one is wrong JavaScript Data Types?",
//                     option:{
//                         1:"Number",
//                         2:"String",
//                         3:"Boolean",
//                         4:"Long"
//                     },
//                     correctAnswer:"4"
//                 },
//                 {
//                     q:"Which function joins all elements of an array into a string??",
//                     option:{
//                         1:"pop()",
//                         2:"join()",
//                         3:"append()",
//                         4:"concat()"
//                     },
//                     correctAnswer:"2"
//                 },
//                 {
//                     q:"Which built-in method returns the character at the specified index of String?",
//                     option:{
//                         1:"indexOf()",
//                         2:"valueOf()",
//                         3:"charAt()",
//                         4:"substr()"
//                     },
//                     correctAnswer:"3"
//                 },
//                 {
//                     q:"Which of the following is not a valid JavaScript variable name?",
//                     option:{
//                         1:"Name1",
//                         2:"First_Last",
//                         3:"34Rooms",
//                         4:"None of above"
//                     },
//                     correctAnswer:"3"
//                 },
//                 {
//                     q:"Inside which HTML tag do we put the JavaScript?",
//                     option:{
//                         1:"<js>",
//                         2:"<scripting>",
//                         3:"<script>",
//                         4:"<javascript>"
//                     },
//                     correctAnswer:"3"
//                 },
//                 {
//                     q:" _______ statement is used to test a specific condition",
//                     option:{
//                         1:"Select",
//                         2:"If",
//                         3:"Switch",
//                         4:"For"
//                     },
//                     correctAnswer:"2"
//                 },
//                 {
//                     q:"The external JavaScript file must contain <script> tag. True or False?",
//                     option:{
//                         1:"true",
//                         2:"false"
//                     },
//                     correctAnswer:"2"
//                 },

//             ];



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
var questions;
loadJSON(function(json) {
    console.log(json); // this will log out the json object
    questions = json; 
});
var timeLimit =  60;
var questionIndex=0;
var userScore =0;

var timerDivEl = document.getElementById("time_sec");
var mainSection = document.getElementById("info-box");
var parentEl = document.getElementById("main");
var startbtn = document.getElementById("start_btn");
startbtn.addEventListener("click",startQuiz);



function startQuiz(){
    parentEl.removeChild(mainSection);
    countdown();
    createQuestionSection();
    startQuestionsQuiz();
}
function countdown(){
   var  timerStart = setInterval(function(){
        timeLimit--;
        if(timeLimit >= 0){
            timerDivEl.textContent = timeLimit;
        }
        else{
            clearInterval(timerStart);
        }
    },1000);
   
   
}

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
function startQuestionsQuiz(){
    if(questionIndex < questions.length && timeLimit > 0){
        createAnswerPanel();
    }
    else{
        parentEl.removeChild(document.getElementById("CurrentQuestionSection"));
        userScore = timeLimit;
        showScore(userScore)
    }
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

var submitInitials = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var scoreArray;
    if(localStorage.getItem("scoreDetail")){
        scoreArray= JSON.parse(localStorage.getItem("scoreDetail") || []);
    }
    else{
        scoreArray = [];
    }
    var scoreObj = {"name":taskNameInput ,"score":userScore};
  
  // TODO: If they are null, return early from this function
    if(scoreArray){ //! means undefined , null , '' , false ,0
        scoreArray.push(scoreObj);
        localStorage.setItem("scoreDetail",JSON.stringify(scoreArray));
    }
    window.location.href = "../../src/highscore.html";
  
  };

function showScore(){

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
    var inputText= document.createElement("input");
    var submitForm = document.createElement("button");

    labelForm.textContent = "Enter Initials : "

    inputText.setAttribute("type","text");
    inputText.setAttribute("name","task-name");
    inputText.setAttribute("placeholder","Enter Initial");
    
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


  




