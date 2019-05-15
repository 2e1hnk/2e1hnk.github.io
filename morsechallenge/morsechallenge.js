var quiz, QuizUI;

function Quiz(questions) {
    this.score = 0;
    this.questions = questions;
    this.currentQuestionIndex = 0;
}

Quiz.prototype.guess = function(answer) {
    if(this.getCurrentQuestion().isCorrectAnswer(answer)) {
        this.score++;
    }
    this.currentQuestionIndex++;
};

Quiz.prototype.getCurrentQuestion = function() {
    return this.questions[this.currentQuestionIndex];
};

Quiz.prototype.hasEnded = function() {
    return this.currentQuestionIndex >= this.questions.length;
};
function Question(level, filename, comment, answer) {
  this.level = level;
  this.filename = filename;
  this.comment = comment;
  this.answer = answer;
  this.filepath = "levels/" + level + "/" + filename + ".mp3";
}

Question.prototype.isCorrectAnswer = function (choice) {
    return this.answer === choice;
};
//Create Questions

/*
var questions = [
    new Question("Who was the first President of the United States?", [ "George Washington", "Thomas Jefferson", "Thomas Edison", "I don't know" ], "George Washington"),
    new Question("What is the answer to the Ultimate Question of Life, the Universe, and Everything?", ["Pi","42", "Wah?", "I don't know"], "42"),
    new Question("Do you love to code?", ["No","Yes", "Hell Yeah", "No"], "Hell Yeah"),
    new Question("What's the best programming language?", ["Javascript","C#", "Php", "Python"], "Javascript"),
    new Question("Is Jason Chan Awesome?", ["Yes","No", "Maybe", "He's okay"], "Yes")
];
*/

var questions = [];

// Fetch a random filename + answer from a manifest file
function getRandomFile(number, level, comment, resolve, reject)
{
    var rawFile = new XMLHttpRequest();
    rawFile.onload = function() {
      if(rawFile.status == 200) {
        // success!
        var allText = rawFile.responseText;
        var lines = allText.split('\n');

        var random = Math.floor(Math.random() * (lines.length + 1));

        file = lines[random].split(',');

        questions[number] = new Question(level, file[0], comment, file[1]);

        resolve('done');

      } else {
        // something went wrong
        console.log("oops", rawFile);
        reject(new Error('Error'));
      }
    }
    rawFile.open("GET", "levels/" + level + "/files.manifest");
    rawFile.send();
}

//  getRandomFile("0", "levels/0/level.manifest");
var promise_question_1 = new Promise(function(resolve, reject) {
  getRandomFile(0, 0, "5 characters, 5 wpm", resolve, reject);
});

var promise_question_2 = new Promise(function(resolve, reject) {
  getRandomFile(1, 1, "5 characters, 5 wpm, sent at 12 wpm (Farnsworth spacing)", resolve, reject);
});

var promise_question_3 = new Promise(function(resolve, reject) {
  getRandomFile(2, 2, "5 characters, 12 wpm", resolve, reject);
});

var promise_question_4 = new Promise(function(resolve, reject) {
  getRandomFile(3, 3, "5 characters, 5 wpm, sent at 12 wmp (Farnsworth spacing) with background noise", resolve, reject);
});

var promise_question_5 = new Promise(function(resolve, reject) {
  getRandomFile(4, 4, "5 characters, 12 wpm with background noise", resolve, reject);
});

var promise_question_6 = new Promise(function(resolve, reject) {
  getRandomFile(5, 5, "5 characters, 20 wpm with background noise", resolve, reject);
});

var promise_question_7 = new Promise(function(resolve, reject) {
  getRandomFile(6, 6, "5 characters, 25 wpm with background noise", resolve, reject);
});

var promise_question_8 = new Promise(function(resolve, reject) {
  getRandomFile(7, 7, "5 characters, 30 wpm with background noise", resolve, reject);
});

var promise_question_9 = new Promise(function(resolve, reject) {
  getRandomFile(8, 8, "5 characters, 50 wpm with background noise", resolve, reject);
});



Promise.all([
  promise_question_1,
  promise_question_2,
  promise_question_3,
  promise_question_4,
  promise_question_5,
  promise_question_6,
  promise_question_7,
  promise_question_8,
  promise_question_9
])
  .then(function(result) {
    //Create Quiz
    quiz = new Quiz(questions);

    QuizUI = {
        displayNext: function () {
          if (quiz.hasEnded()) {
              this.displayScore();
          } else {
              this.displayQuestion();
              //this.displayChoices();
              this.displayProgress();
          }
        },
        displayQuestion: function() {
            this.populateIdWithHTML("question", "Question " + (quiz.currentQuestionIndex + 1) + ", " + quiz.getCurrentQuestion().comment);
            document.getElementById("audioSource").src=quiz.getCurrentQuestion().filepath;
            document.getElementById("audioPlayer").load();
        },
        displayScore: function() {
            var gameOverHTML = "<h1>Game Over</h1>";
            gameOverHTML += "<h2> You got " + quiz.score + " correct (" + Math.round(quiz.score*100/quiz.questions.length, 1) + "%)</h2><button class=\"btn--default\" onclick=\"location.reload(true)\">Play Again</button>";
            this.populateIdWithHTML("quiz", gameOverHTML);
        },

        populateIdWithHTML: function(id, text) {
            var element = document.getElementById(id);
            element.innerHTML = text;
        },
        guessHandler: function(id, guess) {
            var button = document.getElementById(id);
            button.onclick = function() {
                quiz.guess(guess);
                QuizUI.displayNext();
            }
        },
        displayProgress: function() {
            var currentQuestionNumber = quiz.currentQuestionIndex + 1;
            this.populateIdWithHTML("progress", "Question " + currentQuestionNumber + " of " + quiz.questions.length);
        }
    };

    //Display Quiz
    QuizUI.displayNext();
});