var margin = {top: 20, right: 50, bottom: 30, left: 20 }, // dimensiones
    chartWidth = 900,
    chartHeight = 600,
    width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom;

var causes = ["wounds", "other", "disease"]; // datos a leer

var parseDate = d3.time.format("%m/%Y").parse; // poder transformar el formato de la fecha

var x = d3.scale.ordinal() // generaremos una escala con barras para las fechas
          .rangeRoundBands([0, width]);

var y = d3.scale.linear() // generamos escala para los valores en los datos
          .rangeRound([height, 0]);

var color = d3.scale.category10(); // escala de colores

var xAxis = d3.svg.axis() // generamos los ejes
                  .scale(x)
                  .orient("bottom")
                  .tickFormat(d3.time.format("%b")); // solo toma los meses

var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("right");

var svg = d3.select("body") // seleccionamos el html
            .append("svg") // y agregamos el svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g") // group para añadir los elementos
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data/crimea.csv", type, function (error, crimea) { // leemos los datos
    if (error) throw error; // en caso de error

    var layers = d3.layout.stack()( //generamos un arreglo
        causes.map(function (c) { // que a partir de las columnas a leer
            return crimea.map(function (d) { // selecciona todos los datos de cada grupo
                return {
                    x: d.date, // fecha
                    y: d[c] // dato de la columna correspondiente
                };
            });
        })
    );

    x.domain(layers[0].map(d => d.x)); // le entregamos el dominio a las escalas según los datos
    y.domain([0, d3.max(layers[layers.length - 1], d => d.y0 + d.y)]).nice();

    var layer = svg.selectAll(".layer") // seleccionamos los grupos
                    .data(layers)
                    .enter().append("g")
                    .attr("class", "layer")
                    .style("fill",  (d, i) => color(i)); // color

    layer.selectAll("rect") // agregamos las barras
        .data(d => d)
        .enter().append("rect")
        .attr("x", d => x(d.x)) // su posicion
        .attr("y", d => y(d.y + d.y0))
        .attr("height", d => y(d.y0) - y(d.y + d.y0))
        .attr("width", x.rangeBand() - 1);

    svg.append("g") // agregamos la visualizacion de los ejes
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis);
});

function type(d) { // funcion para poder cambiar el formato de los datos
    d.date = parseDate(d.date);
    causes.forEach(function (c) {
        d[c] = +d[c];
    });
    return d;
}