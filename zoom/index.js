var margin = {top: 20, right: 10, bottom: 40, left: 40 }, // dimensiones
    chartWidth = 700,
    chartHeight = 450,
    width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom,
    cantidad = 300,
    dispersion = -0.45,
    radio = 3,
    tiempo = 1350; // tiempo para volver al original

var svg = d3.select("#chart") // generamos el svg necesario
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .append("g") // group para añadirlos
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// generaremos valores aleatorios
var random = d3.randomNormal(0, 0.25), // generamos una funcion de valores aleatorios
    pointsX = d3.range(cantidad).map(_ => [random() + Math.sqrt(3), random() + 1, 0]), // generaremos tres conjutos de datos
    pointsY = d3.range(cantidad).map(_ => [random() - Math.sqrt(3), random() + 1, 1]),
    pointsColor = d3.range(cantidad).map(_ => [random(), random() - 1, 2]),
    points = d3.merge([pointsX, pointsY, pointsColor]); // arreglo con los datos, siendo sus coordenadas

var domX = [-4.5, 4.5],
    domY = [-4.5 * dispersion, 4.5 * dispersion];

var xScale = d3.scaleLinear() // generamos escalas necesarias
    .domain(domX)
    .range([0, width]);

var yScale = d3.scaleLinear()
               .domain(domY)
               .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10); // escala de color

var xAxis = d3.axisTop(xScale), // generamos los ejes
    yAxis = d3.axisRight(yScale);

svg.selectAll("circle") // agregamos los circulos con los datos
   .data(points)
   .enter().append("circle")
   .attr("cx", d => xScale(d[0])) // colocamos las coordenadas
   .attr("cy", d => yScale(d[1]))
   .attr("r", radio)
   .attr("fill", d => color(d[2])); // y su color

svg.append("g") // añadimos la visualizacion de los ejes
   .attr("class", "axis-x")
   .attr("transform", "translate(0," + (chartHeight -20) + ")")
   .call(xAxis);

svg.append("g")
   .attr("class", "axis-y")
   .attr("transform", "translate(-10,0)")
   .call(yAxis);

svg.selectAll(".domain")
   .style("display", "none");

var brush = d3.brush() // permite manejar la seleccion de un area gracias al mouse
              .on("end", brushended), // manejamos este evento
    idleTimeout; // permite el repetir la animacion

svg.append("g")
   .attr("class", "brush") // cuando se selecciona una region
   .call(brush); // llamamos al manejo brush

function brushended() {
    var s = d3.event.selection;
    if (!s) { // en caso d eno haber seleccionado nada, es decir, doble click
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 2*tiempo); // selecciona una funcion y una cantidad de tiempo
        xScale.domain(domX); // reestablecemos los valores iniciales
        yScale.domain(domY);
    } else { // en caso de haber seleccionado una region
        xScale.domain([s[0][0], s[1][0]].map(xScale.invert, xScale)); // colocamos los valores de la region como nuevo margen
        yScale.domain([s[1][1], s[0][1]].map(yScale.invert, yScale)); // en funcion de posiciones de los circulos, por lo que usamos la inversa

        svg.select(".brush") // y pasamos a la anumacion brush
           .call(brush.move, null);
    }
    zoom(); // realizamos le zoom
}

function idled() { // funcion para el tiempo que se tiene para volver a los margenes originales
    idleTimeout = null; // devuelve el timeout a nulo para poder repetir la accion
}

function zoom() { // funcion que permite manejar el evento de zoom
    var t = svg.transition() // permitirá los tiempos de transicion
               .duration(tiempo);

    svg.select(".axis-x") // realizamos los cambios de los ejes
       .transition(t)
       .call(xAxis);

    svg.select(".axis-y")
       .transition(t)
       .call(yAxis);

    svg.selectAll("circle") // cambiamos la posicion de los puntos de acuerdo a los nuevos ejes
       .transition(t)
       .attr("cx", d => xScale(d[0]))
       .attr("cy", d => yScale(d[1]));
}