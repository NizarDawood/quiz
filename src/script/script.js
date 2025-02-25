let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        questions = parseQuestions(text);
        currentQuestionIndex = 0;
        correctAnswers = 0;
        if (questions.length > 0) {
            showQuestion();
        }
    };
    reader.readAsText(file);
});

function parseQuestions(text) {
    let lines = text.split('\n').map(line => line.trim()).filter(line => line.includes(':'));
    let allDefinitions = lines.map(line => line.split(': ')[1]);
    
    return lines.map(line => {
        let [term, definition] = line.split(': ');
        let wrongAnswers = allDefinitions.filter(def => def !== definition);
        let options = shuffle([definition, ...shuffle(wrongAnswers).slice(0, 3)]);
        return { term, correct: definition, options };
    });
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        document.getElementById('quiz-container').innerHTML = `<h2>Quiz klart!</h2><p>Du fick ${correctAnswers} av ${questions.length} rätt!</p>`;
        document.getElementById('status').innerText = '';
        return;
    }
    
    const question = questions[currentQuestionIndex];
    document.getElementById('quiz-container').innerHTML = `
        <h2>${question.term}</h2>
        ${question.options.map(option => `<div class='option' onclick='checkAnswer(this, "${question.correct}")'>${option}</div>`).join('')}
    `;
    
    document.getElementById('status').innerText = `Fråga ${currentQuestionIndex + 1} av ${questions.length}`;
}

function checkAnswer(element, correctAnswer) {
    if (element.innerText.trim() === correctAnswer.trim()) {
        element.classList.add('correct');
        correctAnswers++;
    }
    
    currentQuestionIndex++;
    setTimeout(showQuestion, 1000);
}
