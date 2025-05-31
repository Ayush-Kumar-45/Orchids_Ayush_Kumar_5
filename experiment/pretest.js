/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the below code ////////////////////////

/////////////////////////////////////////////////////////////////////////////

(function() {
  function buildQuiz() {
    // we'll need a place to store the HTML output
    const output = [];

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // we'll want to store the list of answer choices
      const answers = [];

      // and for each available answer...
      for (letter in currentQuestion.answers) {
        // ...add an HTML radio button
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter} :
            ${currentQuestion.answers[letter]}
          </label>`
        );
      }

      // add this question and its answers to the output
      output.push(
        `<div class="question"> ${currentQuestion.question} </div>
        <div class="answers"> ${answers.join("")} </div>`
      );
    });

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join("");
  }

  function showResults() {
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll(".answers");

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if (userAnswer === currentQuestion.correctAnswer) {
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        //answerContainers[questionNumber].style.color = "lightgreen";
      } else {
        // if answer is wrong or blank
        // color the answers red
        answerContainers[questionNumber].style.color = "red";
      }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
  }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");
 

/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////






/////////////// Write the MCQ below in the exactly same described format ///////////////


  const molecularOrbitalQuestions = [
  {
    question: "Which of the following is true about bonding molecular orbitals?",
    answers: {
      a: "They result from destructive interference of atomic orbitals",
      b: "They have higher energy than the original atomic orbitals",
      c: "They increase electron density between the nuclei",
      d: "They always contain paired electrons"
    },
    correctAnswer: "c",
    explanation: "Bonding molecular orbitals form by constructive interference and increase electron density between nuclei, stabilizing the bond."
  },
  {
    question: "In a homonuclear diatomic molecule, which molecular orbital has the highest energy among the following?",
    answers: {
      a: "σ(1s)",
      b: "σ*(1s)",
      c: "σ(2s)",
      d: "σ*(2p)"
    },
    correctAnswer: "d",
    explanation: "The antibonding sigma orbital of the 2p orbitals, σ*(2p), has the highest energy among the listed orbitals."
  },
  {
    question: "The bond order of N₂ molecule according to molecular orbital theory is:",
    answers: {
      a: "2",
      b: "2.5",
      c: "3",
      d: "3.5"
    },
    correctAnswer: "c",
    explanation: "N₂ has a bond order of 3, indicating a triple bond between the nitrogen atoms."
  },
  {
    question: "Which of the following statements is true for heteronuclear diatomic molecules?",
    answers: {
      a: "All atomic orbitals mix equally",
      b: "The more electronegative atom contributes more to bonding orbitals",
      c: "Bond order is always an integer",
      d: "There is no mixing of orbitals from different atoms"
    },
    correctAnswer: "b",
    explanation: "In heteronuclear molecules, the more electronegative atom tends to contribute more to the bonding molecular orbitals."
  },
  {
    question: "Which pair is an example of a heteronuclear diatomic molecule?",
    answers: {
      a: "O₂",
      b: "N₂",
      c: "HCl",
      d: "Cl₂"
    },
    correctAnswer: "c",
    explanation: "HCl consists of two different atoms (hydrogen and chlorine), making it heteronuclear."
  },
                         ///// To add more questions, copy the section below 
    									                  ///// this line


    /* To add more MCQ's, copy the below section, starting from open curly braces ( { )
        till closing curly braces comma ( }, )

        and paste it below the curly braces comma ( below correct answer }, ) of above 
        question

    Copy below section

    {
      question: "This is question n?",
      answers: {
        a: "Option 1",
        b: "Option 2",
        c: "Option 3",
        d: "Option 4"
      },
      correctAnswer: "c"
    },

    Copy above section

    */




  ];




/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the below code ////////////////////////

/////////////////////////////////////////////////////////////////////////////


  // display quiz right away
  buildQuiz();

  // on submit, show results
  submitButton.addEventListener("click", showResults);
})();


/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////