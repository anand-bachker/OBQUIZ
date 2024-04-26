document.addEventListener("DOMContentLoaded", function() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => initializeQuiz(data))
        .catch(error => console.error('Error loading the questions:', error));
});

let currentQuestionIndex = 0;
let currentChapter;
let quizData;

function initializeQuiz(data) {
    quizData = data;
    Object.keys(data).forEach(chapter => {
        data[chapter].forEach((question, index) => {
            question.originalIndex = index; // Ensure each question has an original index
        });
    });
    populateChapters();
    changeChapter(Object.keys(data)[0]); // Start with the first chapter
}

function populateChapters() {
    const select = document.getElementById('chapter-select');
    select.innerHTML = ''; // Clear previous options
    Object.keys(quizData).forEach(chapter => {
        const option = document.createElement('option');
        option.value = chapter;
        option.textContent = chapter;
        select.appendChild(option);
    });
    if(currentChapter) select.value = currentChapter; // Set the current chapter in the dropdown
}

function changeChapter(chapter) {
    currentChapter = chapter;
    currentQuestionIndex = 0; // Start from the first question in the chapter
    loadQuestion();
}

function loadQuestion() {
    const chapterData = quizData[currentChapter];
    if (chapterData && chapterData[currentQuestionIndex]) {
        const questionData = chapterData[currentQuestionIndex];
        document.getElementById('chapter-name').textContent = `Chapter: ${currentChapter}`;
        document.getElementById('question-number').textContent = `Question ${questionData.originalIndex + 1}`;
        document.getElementById('question').textContent = questionData.question;
        const optionsUl = document.getElementById('options');
        optionsUl.innerHTML = '';
        
        // Copy options to a new array and shuffle it
        const shuffledOptions = questionData.options.slice().sort(() => Math.random() - 0.5);
        
        shuffledOptions.forEach((option, index) => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
            button.onclick = () => checkAnswer(option, questionData.answer);
            li.appendChild(button);
            optionsUl.appendChild(li);
        });
    }
}
function checkAnswer(selectedOption, correctAnswer) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = selectedOption === correctAnswer ? 'Correct!' : 'Wrong, try again!';
    feedback.style.color = selectedOption === correctAnswer ? 'green' : 'red';
}

function loadNextQuestion() {
    if (currentQuestionIndex < quizData[currentChapter].length - 1) {
        currentQuestionIndex++; // Move to the next question
    } else {
        currentQuestionIndex = 0; // Restart at the beginning if it's the last question
    }
    loadQuestion();
}

function shuffleCurrentQuestions() {
    quizData[currentChapter].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0; // Start from the first shuffled question
    loadQuestion();
}

function shuffleChaptersAndQuestions() {
    const chapters = Object.keys(quizData);
    chapters.sort(() => Math.random() - 0.5);
    Object.keys(quizData).forEach(chapter => {
        quizData[chapter].sort(() => Math.random() - 0.5);
    });
    currentChapter = chapters[0];
    currentQuestionIndex = 0;
    populateChapters();
    changeChapter(currentChapter);
}
