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

    ctx.strokeStyle = "blue";
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
function drawLine(x1, y1, x2, y2, color) {

    ctx.strokeStyle = color;

    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.stroke();
}
/**
 * 
 * COMPUTE CODE
 * 
 */

/**
 * Calcula el código binario de un punto
 * respecto a la ventana de recorte
 * 
 * @param {number} x - coordenada X del punto
 * @param {number} y - coordenada Y del punto
 * @param {number} xmin - borde izquierdo
 * @param {number} ymin - borde inferior
 * @param {number} xmax - borde derecho
 * @param {number} ymax - borde superior
 * 
 * @returns {number} código binario del punto
 */
function computeCode(x, y, xmin, ymin, xmax, ymax) {

    let code = INSIDE;

    if (x < xmin) {
        code |= LEFT;
    }

    else if (x > xmax) {
        code |= RIGHT;
    }

    if (y < ymin) {
        code |= BOTTOM;
    }

    else if (y > ymax) {
        code |= TOP;
    }

    return code;
}
/**
 * 
 * ALGORITMO DE COHEN-SUTHERLAND
 * 
 */

/**
 * Realiza el recorte de una línea
 * utilizando Cohen-Sutherland
 * 
 * @param {number} x1 - coordenada inicial X
 * @param {number} y1 - coordenada inicial Y
 * @param {number} x2 - coordenada final X
 * @param {number} y2 - coordenada final Y
 * @param {number} xmin - borde izquierdo viewport
 * @param {number} ymin - borde inferior viewport
 * @param {number} xmax - borde derecho viewport
 * @param {number} ymax - borde superior viewport
 * 
 * @returns {Object} línea recortada
 */
function cohenSutherland(
    x1, y1,
    x2, y2,
    xmin, ymin,
    xmax, ymax
) {

    let code1 = computeCode(x1, y1, xmin, ymin, xmax, ymax);
    let code2 = computeCode(x2, y2, xmin, ymin, xmax, ymax);

    let accept = false;

    while (true) {

        /**
         * Ambos puntos dentro
         */
        if ((code1 | code2) === 0) {

            accept = true;
            break;
        }

        /**
         * Ambos comparten región externa
         */
        else if (code1 & code2) {

            break;
        }

        /**
         * La línea debe recortarse
         */
        else {

            let codeOut;

            let x, y;

            if (code1 !== 0) {
                codeOut = code1;
            } else {
                codeOut = code2;
            }

            /**
             * Intersección superior
             */
            if (codeOut & TOP) {

                x = x1 + ((x2 - x1) * (ymin - y1)) / (y2 - y1);
                y = ymin;
            }

            /**
             * Intersección inferior
             */
            else if (codeOut & BOTTOM) {

                x = x1 + ((x2 - x1) * (ymax - y1)) / (y2 - y1);
                y = ymax;
            }

            /**
             * Intersección derecha
             */
            else if (codeOut & RIGHT) {

                y = y1 + ((y2 - y1) * (xmax - x1)) / (x2 - x1);
                x = xmax;
            }

            /**
             * Intersección izquierda
             */
            else if (codeOut & LEFT) {

                y = y1 + ((y2 - y1) * (xmin - x1)) / (x2 - x1);
                x = xmin;
            }

            /**
             * Reemplazar punto externo
             */
            if (codeOut === code1) {

                x1 = x;
                y1 = y;

                code1 = computeCode(
                    x1, y1,
                    xmin, ymin,
                    xmax, ymax
                );

            } else {

                x2 = x;
                y2 = y;

                code2 = computeCode(
                    x2, y2,
                    xmin, ymin,
                    xmax, ymax
                );
            }
        }
    }

    return {
        accepted: accept,
        x1,
        y1,
        x2,
        y2
    };
}
/**
 * 
 * RENDERIZAR ESCENA
 * 
 */

/**
 * Dibuja:
 * - viewport
 * - línea original
 * - línea recortada
 */

function renderScene() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    /**
     * Leer viewport desde HTML
     */
    const xmin = parseInt(
        document.getElementById("xmin").value
    );

    const ymin = parseInt(
        document.getElementById("ymin").value
    );

    const xmax = parseInt(
        document.getElementById("xmax").value
    );

    const ymax = parseInt(
        document.getElementById("ymax").value
    );

    /**
     * Dibujar viewport
     */
    drawViewport(
        xmin,
        ymin,
        xmax,
        ymax
    );

    /**
     * Obtener escena actual
     */
    const line = scenes[currentScene];

    /**
     * Dibujar línea original
     */
   ctx.lineWidth = 1;

drawLine(
    line.x1,
    line.y1,
    line.x2,
    line.y2,
    "rgba(0,0,0,0.35)"

    );

    /**
     * Aplicar Cohen-Sutherland
     */
    const clipped = cohenSutherland(

        line.x1,
        line.y1,

        line.x2,
        line.y2,

        xmin,
        ymin,

        xmax,
        ymax
    );

    /**
     * Dibujar línea recortada
     */
    if (clipped.accepted) {

       ctx.lineWidth = 3;

drawLine(
    clipped.x1,
    clipped.y1,
    clipped.x2,
    clipped.y2,
    "red"
);
    }

    /**
     * Mostrar información
     */
    document.getElementById("info").innerText =
        scenes[currentScene].title;
}


