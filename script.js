// =====================================================
//  MULTIPLICAR Y DIVIDIR POR 10, POR 20 Y POR 5
//  El Tour de Mates
// =====================================================

// ----- Variables del juego -----
const TOTAL_OPERACIONES = 120;  // Máximo de operaciones (en todos los modos)

let nivel;                 // Nivel elegido (del 1 al 10)
let modo;                  // "120", "3" (minutos) o "5" (minutos)
let operacion;             // Operación que se está mostrando ahora
let operacionAnterior = ""; // Para no repetir la misma operación seguida
let aciertos = 0;
let fallos = 0;
let operacionesHechas = []; // Lista con todas las operaciones respondidas
let inicio;                // Momento en que empieza el juego
let reloj;                 // Temporizador que actualiza el tiempo


// =====================================================
//  GENERAR UNA OPERACIÓN SEGÚN EL NIVEL
// =====================================================

// Devuelve un número entero al azar entre min y max (ambos incluidos)
function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Elige al azar un elemento de una lista
function elegirAlAzar(lista) {
  let indice = Math.floor(Math.random() * lista.length);
  return lista[indice];
}

// Crea una operación del nivel indicado.
// Devuelve el texto que se muestra (por ejemplo "12 × 20")
// y el resultado correcto (por ejemplo 240).
function generarOperacion(nivel) {

  // --- Niveles que mezclan otros niveles: se elige uno al azar ---
  if (nivel === 11) {   // Nivel Tour de Mates: todos los niveles
    nivel = elegirAlAzar([1, 2, 3, 4]);
  }
  if (nivel === 5) {   // Sumar y restar números acabados en 1
    nivel = elegirAlAzar([1,3]);
  }
  if (nivel === 6) {   // Sumar y restar números acabados en 9
    nivel = elegirAlAzar([2,4]);
  }

  // --- Niveles básicos ---
  if (nivel === 1) {   // Sumar números acabados en 1
    let y = numeroAleatorio(1, 8)*10+1;
    let x = numeroAleatorio(1, 99-y);
    return { texto: `${x} + ${y}`, resultado: x + y };
  }
  if (nivel === 2) {   // Sumar números acabados en 9
    let y = numeroAleatorio(1, 8)*10+9;
    let x = numeroAleatorio(1, 99-y);
    return { texto: `${x} + ${y}`, resultado: x + y };
  }
    if (nivel === 3) {   // Restar números acabados en 1
    let y = numeroAleatorio(1, 8)*10+1;
    let x = numeroAleatorio(1, 50)+y;
    return { texto: `${x} - ${y}`, resultado: x - y };
  }
  if (nivel === 4) {   // Restar números acabados en 9
    let y = numeroAleatorio(1, 8)*10+9;
    let x = numeroAleatorio(1, 50)+y;
    return { texto: `${x} - ${y}`, resultado: x - y };
  }
}


// =====================================================
//  PANTALLAS
// =====================================================

// Muestra una pantalla ("config", "practica" o "resultados") y oculta las demás
function mostrarPantalla(nombre) {
  document.getElementById("pantalla-config").hidden = (nombre !== "config");
  document.getElementById("pantalla-practica").hidden = (nombre !== "practica");
  document.getElementById("pantalla-resultados").hidden = (nombre !== "resultados");
}


// =====================================================
//  EMPEZAR EL JUEGO
// =====================================================

function empezar() {
  // Leer lo que ha elegido el usuario
  nivel = parseInt(document.getElementById("nivel").value);
  modo = document.querySelector('input[name="modo"]:checked').value;  // La tarjeta de modo marcada

  // Poner todo a cero
  aciertos = 0;
  fallos = 0;
  operacionesHechas = [];
  operacionAnterior = "";
  document.getElementById("lista-operaciones").innerHTML = "";
  document.getElementById("aciertos").textContent = 0;
  document.getElementById("fallos").textContent = 0;
  document.getElementById("reloj").classList.remove("urgente");

  mostrarPantalla("practica");

  // Arrancar el reloj (se actualiza cada medio segundo)
  inicio = Date.now();
  clearInterval(reloj);
  reloj = setInterval(actualizarReloj, 500);
  actualizarReloj();

  mostrarOperacion();
}


// =====================================================
//  MOSTRAR LA SIGUIENTE OPERACIÓN
// =====================================================

function mostrarOperacion() {
  // Generar una operación nueva que no sea igual a la anterior
  operacion = generarOperacion(nivel);
  while (operacion.texto === operacionAnterior) {
    operacion = generarOperacion(nivel);
  }
  operacionAnterior = operacion.texto;

  document.getElementById("texto-operacion").textContent = `${operacion.texto} =`;
  document.getElementById("respuesta").value = "";
  document.getElementById("respuesta").focus();

  // Progreso: "Operación 37/120" (en todos los modos el máximo es 120)
  let numero = operacionesHechas.length + 1;
  document.getElementById("progreso").textContent = `Operación ${numero}/${TOTAL_OPERACIONES}`;

  // En el modo sin tiempo la barra muestra las operaciones hechas
  // (en contrarreloj muestra el tiempo, ver actualizarReloj)
  if (modo === "120") {
    let porcentaje = (operacionesHechas.length / TOTAL_OPERACIONES) * 100;
    document.getElementById("barra-relleno").style.width = `${porcentaje}%`;
  }
}


// =====================================================
//  COMPROBAR LA RESPUESTA (al pulsar Enter o "Comprobar")
// =====================================================

function comprobarRespuesta(evento) {
  evento.preventDefault();  // Evita que la página se recargue

  let respuesta = parseInt(document.getElementById("respuesta").value);
  if (isNaN(respuesta)) {   // Si no ha escrito un número, no se cuenta
    return;
  }
  let lista = document.getElementById("lista-operaciones");
  let caja = document.getElementById("caja-operacion");

  if (respuesta === operacion.resultado) {
    // ----- Respuesta correcta -----
    aciertos++;
    operacionesHechas.push({ texto: operacion.texto, resultado: operacion.resultado, correcta: true });
    lista.innerHTML = `<li class="acierto">✅ ${operacion.texto} = ${operacion.resultado}</li>` + lista.innerHTML;
    caja.className = "caja-operacion destello-acierto";
  } else {
    // ----- Respuesta incorrecta -----
    fallos++;
    operacionesHechas.push({ texto: operacion.texto, resultado: operacion.resultado, respuesta: respuesta, correcta: false });
    lista.innerHTML = `<li class="fallo">❌ ${operacion.texto} = ${respuesta} (correcta: ${operacion.resultado})</li>` + lista.innerHTML;
    caja.className = "caja-operacion destello-fallo";
  }

  // Quitar el color verde/rojo de la caja al poco tiempo
  setTimeout(function () {
    caja.className = "caja-operacion";
  }, 300);

  document.getElementById("aciertos").textContent = aciertos;
  document.getElementById("fallos").textContent = fallos;

  // En todos los modos, terminar al llegar a 120 operaciones
  // (en contrarreloj también termina antes si se acaba el tiempo)
  if (operacionesHechas.length === TOTAL_OPERACIONES) {
    terminar();
  } else {
    mostrarOperacion();
  }
}


// =====================================================
//  RELOJ
// =====================================================

// Segundos que han pasado desde que empezó el juego
function segundosPasados() {
  return Math.floor((Date.now() - inicio) / 1000);
}

// Convierte segundos al formato 00:00
function formatearTiempo(segundos) {
  let minutos = Math.floor(segundos / 60);
  let resto = segundos % 60;
  return `${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

function actualizarReloj() {
  let textoReloj = document.getElementById("reloj");

  if (modo === "120") {
    // Sin límite: el reloj cuenta hacia arriba
    textoReloj.textContent = `⏱️ ${formatearTiempo(segundosPasados())}`;
  } else {
    // Contrarreloj: el reloj cuenta hacia atrás
    let limite = parseInt(modo) * 60;               // 3 o 5 minutos en segundos
    let quedan = Math.max(limite - segundosPasados(), 0);
    textoReloj.textContent = `⏳ ${formatearTiempo(quedan)}`;

    // La barra muestra el tiempo que ha pasado
    let porcentaje = (segundosPasados() / limite) * 100;
    document.getElementById("barra-relleno").style.width = `${porcentaje}%`;

    // En los últimos 10 segundos el reloj se pone rojo
    if (quedan <= 10) {
      textoReloj.classList.add("urgente");
    }
    if (quedan === 0) {
      terminar();
    }
  }
}


// =====================================================
//  TERMINAR Y MOSTRAR RESULTADOS
// =====================================================

function terminar() {
  clearInterval(reloj);

  // Tiempo total (en contrarreloj, como mucho el tiempo límite)
  let tiempo = segundosPasados();
  if (modo !== "120") {
    tiempo = Math.min(tiempo, parseInt(modo) * 60);
  }

  let hechas = operacionesHechas.length;
  let porcentaje = 0;
  if (hechas > 0) {
    porcentaje = Math.round((aciertos / hechas) * 100);
  }

  document.getElementById("res-aciertos").textContent = aciertos;
  document.getElementById("res-fallos").textContent = fallos;
  document.getElementById("res-porcentaje").textContent = `${porcentaje}%`;
  document.getElementById("res-hechas").textContent = hechas;
  document.getElementById("res-tiempo").textContent = formatearTiempo(tiempo);

  // Mensaje según el porcentaje de acierto
  let mensaje = "¡Enhorabuena!";
  if (porcentaje < 50) {
    mensaje = "¡Sigue entrenando!";
  } else if (porcentaje < 80) {
    mensaje = "¡Buen trabajo!";
  }
  document.getElementById("mensaje-final").textContent = mensaje;

  // Lista de operaciones falladas
  let listaFalladas = document.getElementById("lista-falladas");
  listaFalladas.innerHTML = "";
  for (let op of operacionesHechas) {
    if (!op.correcta) {
      listaFalladas.innerHTML += `<li class="fallo">❌ ${op.texto} = ${op.respuesta} (correcta: ${op.resultado})</li>`;
    }
  }
  if (fallos === 0) {
    listaFalladas.innerHTML = `<li class="vacia">🏆 ¡Ningún fallo!</li>`;
  }

  mostrarPantalla("resultados");
}


// =====================================================
//  BOTONES
// =====================================================

document.getElementById("btn-empezar").addEventListener("click", empezar);
document.getElementById("caja-operacion").addEventListener("submit", comprobarRespuesta);
document.getElementById("btn-repetir").addEventListener("click", empezar);

document.getElementById("btn-volver").addEventListener("click", function () {
  mostrarPantalla("config");
});

document.getElementById("btn-salir").addEventListener("click", function () {
  clearInterval(reloj);
  mostrarPantalla("config");
});
