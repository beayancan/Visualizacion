var width = 960
    height = 760
    margen = 100;

var pack = d3.layout.pack() // genera el layout de pack, que trata de jerarquia 
             .sort(null) // no la queremos ordenada por tamaño
             .size([width, height + 2 * margen]) // tamaño
             .padding(2); // separacion entre elementos

var svg = d3.select("body") // generamos el svg para trabajar
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(0," + -margen + ")");

d3.json("data.json", function (error, json) {
    if (error) throw error; // en caso de error

    var node = svg.selectAll(".node") // vamos a añadir los nodos
                  .data(pack.nodes(flatten(json)) // cargamos los datos jerarquizados
                          .filter(d => !d.children)) // filtrando solo a las hojas
                  .enter().append("g") // estructura enter
                  .attr("class", "node")
                  .attr("transform", d =>
                  "translate(" + d.x + "," + d.y + ")");

    node.append("circle") // añadimos los circulos fisicos
        .attr("r", d => d.r);

    node.append("text") // añadimos label a cada circulo
        .text(d => d.name)
        .style("font-size", function (d) { // adaptamos el tamaño del texto
            return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px";
        })
        .attr("dy", ".35em"); // pocicion
});

// funcion que  genera los datos de forma jerarquizada
function flatten(root) {
    var nodes = []; // conjunto para almacenar a las hojas

    function recursion(node) { // funcion recursiva sobre un nodo
        if (node.children) node.children.forEach(recursion); // en caso de tener hijos, itera sobre estos
        else nodes.push({ // en caso de ser una hoja, lo almacena
            name: node.name,
            value: node.size
        });
    }

    recursion(root); // partimos en el nodo raiz de los datos
    return {
        children: nodes // almacenará los datos de todas las hojas del nodo actual
    };
}