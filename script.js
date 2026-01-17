$(document).ready(function () {
  let score = 0;
  let currentProblem = 0;
  let problems = [];
  let operationsList = [];
  let startTime;
  let timerInterval;

  // Iniciar el juego al hacer clic en el botón "Start"
  $("#start").click(function () {
    let level = parseInt($("#level").val());
    if (level >= 1 && level <= 7) {  // Poner aquí número de niveles
      resetGame();
      startTimer();
      generateProblems(level);
      showProblem(level);
    }
  });

  // Reiniciar variables y elementos del juego
  function resetGame() {
    score = 0;
    currentProblem = 0;
    problems = [];
    operationsList = [];
    console.log("Called")
    $("#progress-bar, #timer").show();
    $("#progress").css("width", "0%");
    $("#figlet").html(""); // Limpiar mensaje anterior
    $("#score").html("");
  }

  // Generar problemas según el nivel seleccionado
  function generateProblems(level) {
    var aleatorio = level;
    for (let i = 0; i < 120; i++) {     // Poner aquí número de operaciones
     if (aleatorio === 5)
       { let numeros = [1,2,3,4];
         let indiceAleatorio = Math.floor(Math.random() * numeros.length);
         level = numeros[indiceAleatorio];
       }
      if (aleatorio === 6)
       { let numeros = [1,3];
         let indiceAleatorio = Math.floor(Math.random() * numeros.length);
         level = numeros[indiceAleatorio];
       }
      if (aleatorio === 7)
       { let numeros = [2,4];
         let indiceAleatorio = Math.floor(Math.random() * numeros.length);
         level = numeros[indiceAleatorio];
       } 
      if (level ===1){
        let x = Math.floor(Math.random() * 50) + 1;
        let y = (Math.floor(Math.random() * 5) + 1)*10+1;
        let correctAnswer = x + y;
        problems.push({ x, y, correctAnswer, level });
        }
      if (level ===3){
        let x = Math.floor(Math.random() * 50) + 1+50;
        let y = (Math.floor(Math.random() * 4) + 1)*10+1;
        let correctAnswer = x - y;
        problems.push({ x, y, correctAnswer, level });
        }
      if (level ===2){
        let x = Math.floor(Math.random() * 50) + 1;
        let y = (Math.floor(Math.random() * 5) + 1)*10+9;
        let correctAnswer = x + y;
        problems.push({ x, y, correctAnswer, level });
        }
      if (level ===4){
        let x = Math.floor(Math.random() * 50) + 1+50;
        let y = (Math.floor(Math.random() * 4) + 1)*10+9;
        let correctAnswer = x - y;
        problems.push({ x, y, correctAnswer, level });
        }
    }  
  }

  // Mostrar el problema actual
  function showProblem(level) {
    if (currentProblem >= problems.length) {
      endGame();
      return;
    }
    updateProgressBar();
    let problem = problems[currentProblem];
    if(problem.level===1 || problem.level===2){
    $("#problems").html(`
      <div class="problemStyle">
        <p class="h4">${problem.x} + ${problem.y} = </p>
          <form id="problemForm">
            <input type="number" id="answer" class="form-control text-center" placeholder="Tu respuesta" inputmode="numeric">
            <button type="submit" class="btn btn-success mt-2">Enviar</button>
        </form>
      </div>
    `) 
    $("#answer").focus();
      }
    if(problem.level===3 || problem.level===4){
    $("#problems").html(`
      <div class="problemStyle">
        <p class="h4">${problem.x} - ${problem.y} = </p>
          <form id="problemForm">
            <input type="number" id="answer" class="form-control text-center" placeholder="Tu respuesta" inputmode="numeric">
            <button type="submit" class="btn btn-success mt-2">Enviar</button>
        </form>
      </div>
    `) 
    $("#answer").focus();
      }

    // Manejar la respuesta del usuario
 $("#problemForm").on("submit", function(e) {
   event.preventDefault();
      let userAnswer = parseInt($("#answer").val());
      if (userAnswer === problem.correctAnswer) {
        handleCorrectAnswer(problem, level);
      } else {
        handleIncorrectAnswer(problem, userAnswer, level);
      }
      $("#score").html(`<div class="alert alert-success"> Puntuación: ${score}/${currentProblem}</div>`
  );
      updateOperationsList();
    });
  }

  // Manejar respuesta correcta
  function handleCorrectAnswer(problem, level) {
    if (currentProblem < problems.length) {
    score++;
      if(problem.level===1  || problem.level===2){
    operationsList.push({
      text: `${problem.x} + ${problem.y} = ${problem.correctAnswer}`,
      correct: true
    });
    currentProblem++;
    showProblem(level);
        }
      if(problem.level===3  || problem.level===4){
    operationsList.push({
      text: `${problem.x} - ${problem.y} = ${problem.correctAnswer}`,
      correct: true
    });
    currentProblem++;
    showProblem(level);
        }

  }}

  // Manejar respuesta incorrecta
  function handleIncorrectAnswer(problem, userAnswer, level) {
      if (currentProblem < problems.length) {
       if(problem.level===1  || problem.level===2){
        operationsList.push({
        text: `${problem.x} + ${problem.y} = ${userAnswer} (Correcta: ${problem.correctAnswer})`,
        correct: false
      });
      currentProblem++;
      showProblem(level);
       }
      if(problem.level===3  || problem.level===4){
        operationsList.push({
        text: `${problem.x} - ${problem.y} = ${userAnswer} (Correcta: ${problem.correctAnswer})`,
        correct: false
      });
      currentProblem++;
      showProblem(level);
      }
  }}

  // Actualizar la lista de operaciones
  function updateOperationsList() {
    let listHtml = '<div class="operations-list">';
    operationsList.forEach((operation) => {
      listHtml += `
        <div class="operation-item ${
          operation.correct ? "correct" : "incorrect"
        }">
          ${operation.correct ? "✅" : "❌"} ${operation.text}
        </div>
      `;
    });
    listHtml += "</div>";
    $("#operations-list").html(listHtml);
  }

  // Finalizar el juego
  function endGame() {
    clearInterval(timerInterval);
    $("#score").html(
      `<div class="alert alert-success">🏆 Puntuación: ${score}/${problems.length}</div>`
    );
    $("#score").append(
      `<div class="mt-2">⏱️ Tiempo total: <span id="total-time"></span></div>`
    );
    $("#total-time").text(
      formatTime(Math.floor((Date.now() - startTime) / 1000))
    );

    // Mostrar mensaje especial con estilo llamativo
    showSpecialMessage("¡Enhorabuena!");
  }

  // Mostrar mensaje especial con estilo llamativo
  function showSpecialMessage(message) {
    $("#figlet").html(`
      <div class="special-message">
        ${message}
      </div>
    `);
  }

  // Iniciar el temporizador
  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      $("#time").text(formatTime(elapsedTime));
    }, 1000);
  }

  // Formatear el tiempo en minutos y segundos
  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // Actualizar la barra de progreso
  function updateProgressBar() {
    let progress = ((currentProblem + 1) / problems.length) * 100;
    $("#progress").css("width", `${progress}%`);
  }
});
