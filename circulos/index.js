var width = 960, // determinamos el tamaño de la visualizacion
    height = 500,
    cantidad = 800, // numero de nodos
    variabilidad = 20, // lejania del centro
    radio = 5, // radio de los circulos
    tiempo = 5, // tiempo de la animacion
    fuerza = -5; // cantidad de tiempo que tome en completarse

var nodos = [];

var color = d3.scale.linear() // generaremos una escala de coles
              .domain([0, cantidad]) // de acuerdo a cuando se crea el nodo
              .range(["#FF0000", '#00FF00'])

var svg = d3.select("#chart") // seleccionamos con el id chart
            .append("svg") // agregamos el svg para la visualizacion
            .attr("width", width) // tamaño
            .attr("height", height);

var force = d3.layout.force() // utilizamos los metodos force propios de d3
              .charge(fuerza) // le entregamos carga de repulsion
              .size([width, height]) // tamaño que queremos abarque
              .nodes(nodos) // datos que utilizará, estos se generan después
              .on("tick", posicionar) // en cada momento llama a posicionar
              .start(); // funcion que generará los circulos

function posicionar() { // funcion que posiciona los circulos de forma automatica
    svg.selectAll("circle") // selecciona los circulos creados
       .attr("cx", d => d.x)
       .attr("cy", d => d.y);
}

// setIntertval sirve para evaluar una funcion/expresion durante intervalos de milisegundos
// la cual continua hasta que se llama a clearInterval

var generador = setInterval(function () { // funcion que crea los circulos
    let nodo = { // se crea un nuevo circulo
        x: width / 2 + variabilidad * (Math.random() * 2 - 1).toFixed(4), // posicion en la cual
        y: height / 2 + variabilidad * (Math.random() * 2 - 1).toFixed(4) // se generan
    };

    svg.append("circle") // generan los circulos por cada dato
       .datum(nodo) // se pasan como una lista
       .transition() // permite la transicion fluida
       .attr("r", radio) // le asignamos un radio
       .attr('fill', color(nodos.length)); // le entregamos un color de forma progresiva

    if (nodos.push(nodo) > cantidad) {
        clearInterval(generador); // generamos un break de la funcion
    }
    force.start(); // reordenamos los circulos actuales
}, tiempo); // tiempo de demora