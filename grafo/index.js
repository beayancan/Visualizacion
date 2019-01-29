var margin = {top: 20, right: 10, bottom: 40, left: 40 }, // dimensiones
    chartWidth = 700,
    chartHeight = 450,
    width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom,
    datos;

var force = d3.layout.force() // generamos el componente de fuerza
              .linkDistance(80) // distancia entre nodos
              .charge(-120) // fuerza
              .gravity(.05) // cantidad de movimiento del conjunto
              .size([width, height]) // dimensiones
              .on("tick", tick); // funcion que ac

var svg = d3.select("#chart") // seleccionamos el div
            .append("svg") // generamos el elemento svg
            .attr("width", width)
            .attr("height", height);

var link = svg.selectAll(".link"), // variables globales que usaremos para
    node = svg.selectAll(".node"); // los liks y los nodos

// dado que la visualizacion va cambiando constantemente
// las actualizaciones de las visualizaciones se realizan de forma global
d3.json("./data/graph.json", function (error, data) { // leemos el json
    if (error) throw error;
    datos = data; // definimos los datos
    update(); // generamos el update de los nodos y los links, esto ocurrirá constantemente
});

function update() { // funcion que irá cambiando las caracteristicas de los elementos
    var nodes = flatten(datos), // seleccionamo los nodos de los datos
        links = d3.layout.tree().links(nodes); // seleccionamos los datos según las hojas

    force.nodes(nodes) // al elemento force le entregamos los nodos y links
        .links(links)
        .start(); // y comienza a actuar la fuerza

    link = link.data(links, d => d.target.id); // seleccionamos los links y le pasamos los datos

    link.exit().remove(); // elimina los links que ya no tiene datos

    link.enter() // a los links sin visualizacion les inserta una lina
        .insert("line", ".node")
        .attr("class", "link");

    node = node.data(nodes, d => d.id); // actualiza los nuevos

    node.exit().remove(); // eliminando la visualizacion de los eliminados

    var nodeEnter = node.enter().append("g") // agrega la visualizacion de estos por medio de group
                        .attr("class", "node")
                        .on("click", click) // con poder manejar los clicks
                        .call(force.drag); // entregandole la fuerza a actuar

    nodeEnter.append("circle")
        .attr("r", d => Math.sqrt(d.size) * 2 / 7 || 14.5); // el radio dependerá del valor de size de la hoja

    nodeEnter.append("text") // agregamos un label a cada uno
             .attr("dy", ".35em")
             .text(d => d.name);

    node.select("circle")
        .style("fill", color);
}

function tick() { // funcion que maneja la posicion de los elementos
    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node.attr("transform",
    d => "translate(" + d.x + "," + d.y + ")");
}

function color(d) { // le asignamos un color según qué tipo de dato sea, con hojas o no
    return d._children ? "#3182bd"
        :
        d.children ? "#c6dbef"
        :
        "#fd8d3c";
}

// maneja los eventos del click, permitiendo arrastrar los nodos
function click(d) {
    if (d3.event.defaultPrevented) return; // evita que se oculte en caso de arrastrarlo
    if (d.children) { // en caso de tener hojas
        d._children = d.children; // guarda los datos en una variable auxiliar
        d.children = null; // y elimina las hojas
    } else { // en caso de que sus hojas estén escondidas
        d.children = d._children; // duelve a mostrar las hojas
        d._children = null;
    }
    update(); // actualizando la visualizacion de las hojas, links y posicion
}

// retorna una lista con los nodos
function flatten(datos) {
    var nodes = [],
        i = 0;

    function recurse(node) { // entrega los nodos de forma recursiva
        if (node.children) node.children.forEach(recurse); // en caso de tener hijos, se les aplica la recursion
        if (!node.id) node.id = ++i; // entrega id
        nodes.push(node); // agrega el nodo actual
    }

    recurse(datos);
    return nodes;
}