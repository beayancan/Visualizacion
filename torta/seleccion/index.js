var width = 960, // dimensiones
    height = 500,
    margin = 50,
    radio = Math.min(width, height) / 2;

var color = d3.scale.category10();

var pie = d3.layout.pie() // formato de torta
            .value(d => d.count)
            .sort(null); // evita que las zones salten

var arc = d3.svg.arc() // arco para los datos
            .innerRadius(radio * 2 / 5)
            .outerRadius(radio - margin);

var svg = d3.select("#chart").append("svg") // seleccionamos el html con id chart
            .attr("width", width) // dimensiones
            .attr("height", height)
            .append("g") // group para colocar lo necesario
            .attr("transform", "translate(" + width / 2 +
                "," + height / 2 + ")");

var path = svg.selectAll("path");

d3.tsv("./data/data.tsv", type, function (error, data) {
    var segunOpcion = d3.nest() // vamos tomar los datos segun jerarquia
                        .key(d => d.opcion) //usamos de llave al tipo de opcion
                        .entries(data); // le entregamos los datos

    var label = d3.select("#torta")
        .selectAll("label")
        .data(segunOpcion) // generamos un label por cada opcion
        .enter().append("label");

    label.append("input") // agregamos las opciones de visualizacion
        .attr("type", "radio") // será un circulo
        .attr("name", "fruit") // que se llame fruit
        .attr("value", d => d.key) // nombre de las opciones
        .on("change", change) // en caso de cambio llamamos a change
        .filter(function (d, i) {
            return i;
        })
        .each(change) // a cada uno le aplicamos change
        .property("checked", true); // marca la opcion inicial

    label.append("span") // añadimos el texto de las opciones
        .text(d => d.key);

    function change(region) { // funcion que utilizamos para las transiciones

        // vamos a guardar el value, angulo de partida y final de cada situacion
        var anterior = path.data(), // la informacion del gráfico anterior
            actual = pie(region.values); // la informacion del gráfico actual

        path = path.data(actual, key); // tomamos las regiones actuales

        path.enter().append("path") // e ingresamos un path por cada una
            .each(function (d, i) { // revisamos los datos que necesitamos ahora
                this._current = findNeighborArc(i, anterior, actual, key) || d; // tomamos aquellos que se mantendrán
            })
            .attr("fill", d => color(d.data.region)); // le asignamos color

        path.exit() // tenemos los datos que van a salir de la visualizacion
            .datum(function (d, i) { // queremos solamente aquellos que vayan ya no vayan a estar
                return findNeighborArc(i, actual, anterior, key) || d; // le pasamos los datos al revés
            })
            .transition() // realizamos la transición de eliminar lo anterior
            .duration(1300)
            .attrTween("d", arcTween) // llamamos a la funcion para la interpolacion de los angulos
            .remove(); // los quitamos definitivamente

        path.transition() // realizamos la transición de mostrar lo actual
            .duration(1300)
            .attrTween("d", arcTween); // realizamos la transición de los angulos
    }
});

function type(d) { // convierte la propiedad en número
    d.count = +d.count;
    return d;
}

function findNeighborArc(i, anterior, actual, key) { // determina los angulos de la region
    var d;
    return (d = findPreceding(i, anterior, actual, key)) ? { // en cado de haber estado en la anterior
            startAngle: d.endAngle, // lo quita de la visualizacion dejandolo sin angulo
            endAngle: d.endAngle
        } :
        null; // en otro caso simplemente entrega null pues no se encontró
}

// busca los elementos/regiones del gráfico anterior que se encuentran en el actual
function findPreceding(i, anterior, actual, key) {
    var m = anterior.length;
    while (--i >= 0) {
        var k = key(actual[i]); // determina el elemento
        for (var j = 0; j < m; ++j) { // busca en los datos del anterior
            if (key(anterior[j]) === k) return anterior[j]; // si es que se repite
        }
    }
}

function key(d) { // devuelve solo la region de los datos
    return d.data.region;
}

function arcTween(d) { // funcion que nos permitirá manejar la interpolación de la transición
    var i = d3.interpolate(this._current, d); // generaremos la interpolación del elemento actual
    this._current = i(0); // tomamos el área del chart correspondiente
    return function (t) { // y de forma progresiva iremos cambiando su angulo con arc
        return arc(i(t));
    };
}

