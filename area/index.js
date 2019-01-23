var margin = { top: 40, right: 40, bottom: 40, left: 40 }, // colocamos los margenes para la imagen
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom
    symbol = "IBM";

var xScale = d3.time.scale().range([0, width]), // generamos las escalas de los ejes
    yScale = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis() // generamos los ejes
                .scale(xScale)
                .tickSize(-height);

var yAxis = d3.svg.axis()
                .scale(yScale)
                .ticks(5) // cantidad de numeros en el eje
                .orient("right");

var chart = d3.svg.area() // generamos el area bajo la curva del gráfico
                 .x(d => xScale(d.date))
                 .y0(height) // donde parte desde abajo
                 .y1(d => yScale(d.price)); // hasta donde debe llegar

var line = d3.svg.line() // generamos una linea que delimitará el area
                 .x(d => xScale(d.date))
                 .y(d => yScale(d.price));

var svg = d3.select("#chart") // seleccionamos el div por su id
    .append("svg") // agregamos el elemento svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // lo movemos de acuerdo a los margenes

d3.csv("data/readme.csv", type, function (error, data) {
    if (error) throw error; // en caso de que falle el cargar los datos, nos dice del error

    xScale.domain([d3.min(data, d => d.date), d3.max(data, d => d.date)]); // dominio segun los datos
    yScale.domain([0, d3.max(data, d => d.price)]).nice();

    svg.datum(data)
        .append("path") // para para generar el area
        .attr("class", "area")
        .attr("d", chart); // muestra el area del chart

    svg.append("g") // agregamos los ejes
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis);

    svg.append("path") // path que nos permite mostrar la linea que delimita el area
        .attr("class", "line") // se coloca después para que quede sobre las lineas de los ejes
        .attr("d", line);

    svg.append("text") // agregamos el nombre de los datos que se están leyendo
        .attr("x", width - 6)
        .attr("y", height - 6)
        .attr("transform", "translate(" + -margin.left + ",0)")
        .text(symbol);
});

var parse = d3.time.format("%b %Y").parse;

// Parse dates and numbers. We assume values are sorted by date.
// Also filter to one symbol; the S&P 500.
function type(d) {
    d.date = parse(d.date);
    d.price = +d.price;
    if (d.symbol == symbol) return d;
}