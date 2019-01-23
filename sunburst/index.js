var width = 960,
    height = 700,
    radio = (Math.min(width, height) / 2) - 10,
    gist = "https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json";


// vamos a utilizar escalas polares con lo cual

var xScale = d3.scaleLinear() // realizamos una escala del angulo
          .range([0, 2 * Math.PI]); // dandole como rango una circunferencia

var yScale = d3.scaleSqrt() // generamos la escala del radio
          .range([0, radio]); // el cual poseera escala cuadratica

var color = d3.scaleOrdinal(d3.schemeCategory20); // generamos una escala de colores para entregar

var partition = d3.partition(); // permite generar los diagramas y completarlos

var arc = d3.arc() // generamos el arc que nos permitirá definir el formato adecuado para los circulos
            .startAngle(d => Math.max(0, Math.min(2 * Math.PI, xScale(d.x0))))// definimos el angulo inicial
            .endAngle(d => Math.max(0, Math.min(2 * Math.PI, xScale(d.x1)))) // donde termina el actual
            .innerRadius(d => Math.max(0, yScale(d.y0))) // donde parte su radio
            .outerRadius(d => Math.max(0, yScale(d.y1))); // en donde termina

var svg = d3.select("#chart") // seleccionamos el id chart
            .append("svg") // generamos el svg
            .attr("width", width) // dimensiones
            .attr("height", height)
            .append("g") // group
            .attr("transform", "translate(" + (width / 2) // trasladamos al centro de la circunferencia
                        + "," + (height / 2) + ")");

d3.json(gist, function (error, data) { // leemos el documento desde gist
    if (error) throw error; // en caso de error

    root = d3.hierarchy(data); // los datos ya están jerarquizados por lo que se los pasamos
    root.sum(d =>d.size); // reflejamos la jerarquía en la visualizacion

    svg.selectAll("path")
        .data(partition(root).descendants()) //agregamos los datos
        .enter().append("path") // lo agregamos a la visualizacion
        .attr("d", arc) // completamos el área segun lo que nos entregue arc.
        .style("fill", d => color((d.children ? d : d.parent).data.name)) // diferenciamos en caso de ser nodo u hoja

        /*partition() permite completar los espacios
        descendats() va recorriendo los nodos, desde el actual pasando por sus hojas*/
    });