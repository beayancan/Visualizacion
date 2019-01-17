var data = [6, 8, 9, 13, 16, 20, 24, 27, 29]; // datos aleatorios

var width = 800, // dimensiones
    height = 400,
    radio = Math.min(height,width) / 2;

var arc = d3.svg.arc() // para poder generar los arcos en los cuales se van a colocar
            .innerRadius(radio*2/5) // radio interior
            .outerRadius(radio); // exterior

var pie = d3.layout.pie()// para poder manejar los datos de acuerdo al grafico
            .padAngle(0.01); // transformado los datos a un formato especifico

var color = d3.scale.category10(); // generamos una escala de 10 colores

var svg = d3.select("#chart") // seleccionamos el html
            .append("svg") // agregamos el elemento svg
            .attr("width", width)
            .attr("height", height)
            .append("g") // agregamos un group centrado que contenga los elementos
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.selectAll("path") // opder cada dato generamos un path
    .data(pie(data)) // le entregamos los datos ya manejados por pie
    .enter().append("path")
    .style("fill", function (_, i) { return color(i); }) // entregamos su color según su indice
    .attr("d", arc); // le añadimos el area