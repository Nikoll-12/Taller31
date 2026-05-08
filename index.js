/**
 * 
 * ALGORITMO DE COHEN - SUTHERLAND
 * Recorte de líneas
 * 
 */

/**
 * Canvas y contexto gráfico
 * ctx representa el espacio de dibujo 2D
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
/**
 * Índice de la escena actual
 */
let currentScene = 0;
/**
 * 
 * CONSTANTES BINARIAS
 * 
 * Cada bit representa una región:
 * 
 * TOP    = 1000
 * BOTTOM = 0100
 * RIGHT  = 0010
 * LEFT   = 0001
 */
const INSIDE = 0;
const LEFT   = 1;
const RIGHT  = 2;
const BOTTOM = 4;
const TOP    = 8;
/**
 * 
 * ESCENAS DE PRUEBA
 * 
 * Cada objeto representa una línea distinta
 * para probar casos del algoritmo
 */

const scenes = [

    // Línea completamente dentro
    {
        x1: 200,
        y1: 200,
        x2: 400,
        y2: 400,
        title: "Línea completamente dentro"
    },

    // Línea completamente fuera
    {
        x1: 50,
        y1: 50,
        x2: 100,
        y2: 100,
        title: "Línea completamente fuera"
    },
 // Cruza izquierda
    {
        x1: 50,
        y1: 300,
        x2: 300,
        y2: 300,
        title: "Recorte por izquierda"
    },

    // Cruza derecha
    {
        x1: 300,
        y1: 300,
        x2: 600,
        y2: 300,
        title: "Recorte por derecha"
    },
      // Cruza múltiples bordes
    {
        x1: 50,
        y1: 500,
        x2: 600,
        y2: 100,
        title: "Recorte múltiple"
    }

];
/**
 * 
 * DIBUJAR VIEWPORT
 * 
 */

/**
 * Dibuja la ventana de recorte
 * @param {number} xmin - borde izquierdo
 * @param {number} ymin - borde inferior
 * @param {number} xmax - borde derecho
 * @param {number} ymax - borde superior
 */

function drawViewport(xmin, ymin, xmax, ymax) {

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        xmin,
        ymin,
        xmax - xmin,
        ymax - ymin
    );
}

/**
 * 
 * DIBUJAR LÍNEAS
 * 
 */

/**
 * Dibuja una línea
 * @param {number} x1 - coordenada inicial X
 * @param {number} y1 - coordenada inicial Y
 * @param {number} x2 - coordenada final X
 * @param {number} y2 - coordenada final Y
 * @param {string} color - color de la línea
 */
