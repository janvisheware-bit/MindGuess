// ==========================================
// MindGuess - FINAL VERSION
// ==========================================

// ---------- HTML ELEMENTS ----------

const startButton = document.getElementById("startButton");

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

const questionText = document.getElementById("questionText");

const answerButtons = document.querySelectorAll(".answerButton");

const correctButton = document.getElementById("correctButton");
const wrongButton = document.getElementById("wrongButton");

const learningArea = document.getElementById("learningArea");

const newThingInput = document.getElementById("newThingInput");
const learnButton = document.getElementById("learnButton");

const answerArea = document.getElementById("answerArea");

const memoryList = document.getElementById("memoryList");

const guessControls = document.getElementById("guessControls");


// ==========================================
// KNOWLEDGE BASE
// ==========================================

let things = JSON.parse(
    localStorage.getItem("mindGuessThings")
) || [

    {
        name: "Dog",
        alive: "yes",
        animal: "yes",
        fur: "yes",
        pet: "yes",
        flies: "no",
        water: "no",
        home: "yes"
    },

    {
        name: "Cat",
        alive: "yes",
        animal: "yes",
        fur: "yes",
        pet: "yes",
        flies: "no",
        water: "no",
        home: "yes"
    },

    {
        name: "Chair",
        alive: "no",
        animal: "no",
        fur: "no",
        pet: "no",
        flies: "no",
        water: "no",
        home: "yes"
    },

    {
        name: "Lion",
        alive: "yes",
        animal: "yes",
        fur: "yes",
        pet: "no",
        flies: "no",
        water: "no",
        home: "no"
    },

    {
        name: "Fish",
        alive: "yes",
        animal: "yes",
        fur: "no",
        pet: "yes",
        flies: "no",
        water: "yes",
        home: "yes"
    },

    {
        name: "Bird",
        alive: "yes",
        animal: "yes",
        fur: "no",
        pet: "yes",
        flies: "yes",
        water: "no",
        home: "yes"
    }

];


// ==========================================
// QUESTIONS
// ==========================================

const questions = [

    {
        key: "alive",
        text: "Is it alive?"
    },

    {
        key: "animal",
        text: "Is it an animal?"
    },

    {
        key: "fur",
        text: "Does it have fur?"
    },

    {
        key: "pet",
        text: "Is it commonly kept as a pet?"
    },

    {
        key: "flies",
        text: "Can it fly?"
    },

    {
        key: "water",
        text: "Does it live in water?"
    },

    {
        key: "home",
        text: "Is it commonly found at home?"
    }

];


let currentQuestionIndex = 0;

let userAnswers = {};


// ==========================================
// START GAME
// ==========================================

startButton.addEventListener("click", function () {

    startScreen.style.display = "none";

    gameScreen.style.display = "block";

    currentQuestionIndex = 0;

    userAnswers = {};

    answerArea.style.display = "block";

    guessControls.style.display = "none";

    learningArea.style.display = "none";

    questionText.textContent =
        questions[currentQuestionIndex].text;

});


// ==========================================
// ANSWER QUESTIONS
// ==========================================

answerButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const answer = button.dataset.answer;

        const currentQuestion =
            questions[currentQuestionIndex];

        userAnswers[currentQuestion.key] = answer;

        console.log("User answers:", userAnswers);


        currentQuestionIndex++;


        if (currentQuestionIndex < questions.length) {

            questionText.textContent =
                questions[currentQuestionIndex].text;

        }

        else {

            makeGuess();

        }

    });

});


// ==========================================
// MAKE GUESS
// ==========================================

function makeGuess() {

    let bestMatch = null;

    let bestScore = -1;


    things.forEach(function (thing) {

        let score = 0;


        questions.forEach(function (question) {

            const userAnswer =
                userAnswers[question.key];

            const thingAnswer =
                thing[question.key];


            // Ignore "Maybe" because it does not
            // provide a definite answer.

            if (
                userAnswer === "maybe" ||
                userAnswer === undefined ||
                thingAnswer === undefined
            ) {

                return;

            }


            if (thingAnswer === userAnswer) {

                score += 2;

            }

            else {

                score -= 1;

            }

        });


        // Small bonus for more complete knowledge

        const knownProperties =
            questions.filter(function (question) {

                return thing[question.key] !== undefined;

            }).length;

        score += knownProperties * 0.1;


        // If this thing is the first match with the
        // same score, it can still become the guess.

        if (score > bestScore) {

            bestScore = score;

            bestMatch = thing;

        }

    });


    if (!bestMatch) {

        questionText.textContent =
            "I don't know yet! 🤔";

    }

    else {

        questionText.textContent =
            "I think you're thinking of a " +
            bestMatch.name +
            "!";

    }


    answerArea.style.display = "none";

    guessControls.style.display = "block";

}


// ==========================================
// CORRECT GUESS
// ==========================================

correctButton.addEventListener("click", function () {

    questionText.textContent =
        "Great! I guessed it! 🎉";

    guessControls.style.display = "none";

});


// ==========================================
// WRONG GUESS
// ==========================================

wrongButton.addEventListener("click", function () {

    questionText.textContent =
        "Oops! I want to learn. 🤔";

    guessControls.style.display = "none";

    learningArea.style.display = "block";

});


// ==========================================
// LEARN NEW THING
// ==========================================

learnButton.addEventListener("click", function () {

    const newThing =
        newThingInput.value.trim();


    if (newThing === "") {

        return;

    }


    // Create a new thing using the answers
    // the user gave during the game.

    const learnedThing = {

        name: newThing,

        alive: userAnswers.alive || "maybe",

        animal: userAnswers.animal || "maybe",

        fur: userAnswers.fur || "maybe",

        pet: userAnswers.pet || "maybe",

        flies: userAnswers.flies || "maybe",

        water: userAnswers.water || "maybe",

        home: userAnswers.home || "maybe"

    };


    // Add it to memory

    things.push(learnedThing);


    // Save memory

    localStorage.setItem(
        "mindGuessThings",
        JSON.stringify(things)
    );


    questionText.textContent =
        "Thanks! I learned about " +
        newThing +
        " 🧠";


    learningArea.style.display = "none";

    answerArea.style.display = "none";

    guessControls.style.display = "none";

    newThingInput.value = "";


    showMemory();

});


// ==========================================
// SHOW MEMORY
// ==========================================

function showMemory() {

    memoryList.textContent = things

        .map(function (thing) {

            return thing.name;

        })

        .join(" • ");

}


showMemory();