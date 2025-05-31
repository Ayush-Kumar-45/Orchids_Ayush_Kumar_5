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


 const moreMolecularOrbitalQuestions = [
  {
    question: "Which molecule has a bond order of zero and does not exist under normal conditions?",
    answers: {
      a: "He₂",
      b: "H₂",
      c: "Li₂",
      d: "B₂"
    },
    correctAnswer: "a",
    explanation: "He₂ has a bond order of zero, meaning it is not stable and does not exist under normal conditions."
  },
  {
    question: "In the molecular orbital diagram, antibonding orbitals are represented by:",
    answers: {
      a: "No symbol",
      b: "A single line",
      c: "An asterisk (*)",
      d: "A plus (+) sign"
    },
    correctAnswer: "c",
    explanation: "Antibonding orbitals are indicated by an asterisk (*) in molecular orbital diagrams."
  },
  {
    question: "Which of the following diatomic species is paramagnetic?",
    answers: {
      a: "N₂",
      b: "O₂⁻",
      c: "CO",
      d: "F₂"
    },
    correctAnswer: "b",
    explanation: "O₂⁻ has one unpaired electron in a π orbital, making it paramagnetic."
  },
  {
    question: "The energy gap between bonding and antibonding orbitals is greatest for which of the following?",
    answers: {
      a: "H₂",
      b: "O₂",
      c: "He₂",
      d: "N₂"
    },
    correctAnswer: "a",
    explanation: "H₂ has the largest energy gap between bonding and antibonding orbitals."
  },
  {
    question: "Which of the following heteronuclear diatomic molecules is isoelectronic with O₂?",
    answers: {
      a: "NO",
      b: "CO",
      c: "CN⁻",
      d: "HF"
    },
    correctAnswer: "a",
    explanation: "NO has 15 electrons, the same number as O₂, making them isoelectronic."
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