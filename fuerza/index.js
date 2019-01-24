var margin = {top: 40, right: 0, bottom: 70, left: 100}, // dimensiones
    chartWidth = 960,
    chartHeight = 600,
    width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom,
    radio = 10, // variables
    cantidad = 150, // cantidad de circulos
    fuerza = -15, // fuerza de atraccion
    velocidad = 2; // velocidad de generacion de clusters

var color = d3.scale.category10(); // generamos escala de colores

var nodes = d3.range(cantidad) // generamos los nodos, por medio de un arreglo
              .map(function (i) { // en donde para cada elemento
                        return { index: i }; // generamos un objeto que contiene su indice
                    });

var force = d3.layout.force() // generamos el formato para la fuerza
              .charge(fuerza) // entregamos cierta fuerza de adhesion
              .nodes(nodes) // le entregamos el conjunto de nodos
              .size([width, height]) // tamaño
              .on("tick", tick) // en cada instante se llama a la funcion tick, para posicionarlos
              .start();

var svg = d3.select("#chart") // el svg necesario para añadir los elementos
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var node = svg.selectAll("circle") // agregaremos los nodos
              .data(nodes)
              .enter().append("circle") // generamos un conjunto de enter
              .attr("cx", d => d.x)
              .attr("cy", d => d.y)
              .attr("r", radio)
              // dado que crearemos 4 clusters, los colores los separaremos de igual forma
              // por lo que al entregar el color, se añade un (i & 3) y así controlamos la homogeneidad
              .style("fill", function (d, i) { return color(i & 3); }) // le entregamos color
              .style("stroke", "black"); // borde

function tick(evento) { // funcion que nos permitirá posicionarlos en los cuadrantes
    var v = velocidad * evento.alpha; // definimos su velocidad
    nodes.forEach(function (nodo, i) {
        nodo.y += i & 1 ? v : -v; // según qué grupo se trate, le entregamos una posicion inicial
        nodo.x += i & 2 ? v : -v;
    });

    node.attr("cx", d => d.x) // lo posicionamos
        .attr("cy", d => d.y);
}