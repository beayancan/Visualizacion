
var margin = {top: 20, right: 10, bottom: 40, left: 60 }, // dimensiones
    chartWidth = 960,
    chartHeight = 500,
    width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom;

var svg = d3.select("#chart") // generamos el svg
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .append("g")
            .attr("transform", `translate(${margin.left} , ${margin.top})`);

var parse = d3.time.format("%m/%d/%y").parse; // formato para poder pasar la fecha a date

var xScale = d3.time.scale() // generamos las escalas lineales
                    .range([0, width]);

var yScale = d3.scale.linear()
                     .range([height, 0]);

var color = d3.scale.category10(); // color para cada area variará

var xAxis = d3.svg.axis() // generamos los ejes
              .scale(xScale)
              .orient("bottom") // inferior
              .ticks(d3.time.days); // solo mostrará días

var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .tickSize(-width); // grilla horizontal

var stack = d3.layout.stack() // generamos el stack que después contendrá los datos
                     .offset("zero") // de esta forma genera el formato querido
                     .values(d => d.values)
                     .x(d => d.date)
                     .y(d => d.value);

var area = d3.svg.area() // elemento para poder designar el área a ocupar
                 .x(d => xScale(d.date))
                 .y0(d => yScale(d.y0))
                 .y1(d => yScale(d.y0 + d.y));

d3.csv("./data/data.csv", function (error, data) {
    if (error) throw error; // en caso de fallar

    data.forEach(function (d) { // hacemos la conversion de los datos a date y int
        d.date = parse(d.date);
        d.value = +d.value;
    });

    var layers = stack(d3.nest() // tomamos los datos y los agrupamos según el key
                         .key(d => d.key)
                         .entries(data));

    xScale.domain(d3.extent(data, d => d.date)); // entregamos el dominio ya con los datos cargados
    yScale.domain([0, d3.max(data, d => d.y0 + d.y) *10/9 ]);

    svg.selectAll(".layer") // agregamos el layer/area de cada elemento
        .data(layers)
        .enter().append("path") // elemento para ingresar visualizaciones nuevas
        .attr("class", "layer")
        .attr("d", d => area(d.values)) // le entregamos el área en el formato adecuado
        .style("fill", (d, i) => color(i)); // con un color adecuado

    svg.append("g") // añadimos los ejes
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
});