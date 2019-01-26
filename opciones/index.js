var margin = {top: 20, right: 10, bottom: 40, left: 40 }, // dimensiones
    chartWidth = 400,
    chartHeight = 400,
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    radio = 10,
    tiempo = 60;

var svg = d3.select("#chart") // generamos el svg necesario
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .append("g") // group para añadirlos
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleLinear() // generamos la escala de los datos, la cual será un cuadrado
               .domain([0, 20]) // para que la visualizacion se vea homogenea
               .range([0, width]);

var yScale = d3.scaleLinear()
               .domain([0, 20])
               .range([height, 0]);

var xAxis = d3.axisBottom(xScale) // generamos los ejes
              .tickSize(-height); // agregamos grilla

var yAxis = d3.axisLeft(yScale)
              .tickSize(-width);

svg.append("g") // agregamos los elementos para los ejes
   .attr("class", "y axis")
   .call(yAxis) // los llamamos
   .append("g")
   .attr("class", "x axis")
   .attr("transform", "translate(0," + height + ")")
   .call(xAxis);

var color = d3.scaleSequential(d3.interpolateSinebow); // generamos una escala de colores

d3.csv("./data/circulos.csv").then(function (data) { // cargamos los datos de forma asincrona

    window.data = data; // colocamos el data como variable global para después usarlo en la transicion

    var grupos = d3.set(data.map(d => d.grupo)) // arreglo con los grupos de la info
                   .values();

    datos = data.filter(d => d.grupo == grupos[0]);

    datos.sort((a, b) => a.x - b.x);

    color.domain([0, datos.length - 1])

    var circulos = svg.selectAll(".circulo") // seleccionamos los elementos circulos
                      .data(datos) // aquellos que contendrán los datos del grupo actual
                      .enter().append("g")// añadimos los datos
                      .attr("class", "circulo")
                      .attr("transform", // los colocamos en su posicion
                      d => "translate(" + xScale(d.x) + "," + yScale(d.y) + ")")
                      // generaremos animaciones para destacar el circulo
                      // sobre el cual se tiene el mouse
                      .on("mouseenter", function (d) { // mouse sobre circulo
                          d3.select(this) // seleccionamos el dato actual
                            .append("text") // le añadimos un label
                            .attr("dx", 10)
                            .attr("dy", -20)
                            .text("(" + d.x + ", " + d.y + ")"); // de su posición

                          d3.selectAll("circle") // hacemos transparentes los demás circulos
                            .style("fill-opacity", .4);

                          d3.select(this) // pero destacamos el actual agrandando su radio y siendo opaco
                            .select("circle")
                            .transition() // realizamos la transicion
                            .duration(1250)
                            .ease(d3.easeElastic) // agregamos un comportamiento elastico al circulo
                            .attr("r", radio * 2)
                            .style("fill-opacity", 1);
                      })
                      .on("mouseleave", function (d) { // animacion cuando aparta el mouse

                          d3.select(this) // selecciona el texo del circulo que dejó
                            .select("text") // quitamos el texto
                            .style("opacity", 0)
                            .transition()
                            .remove();

                          d3.select(this) // seleccionamos el circulo
                            .select("circle")
                            .transition()
                            .duration(1250)
                            .ease(d3.easeElastic) // comportamiento elastico
                            .attr("r", 10); // le retornamos su tamaño original

                          d3.selectAll("circle") // volvemos opacos los circulos nuevamente
                            .style("fill-opacity", 1);
                      });

    /* las funciones deben ir dentro de las definiciones, ya que utilizamos this para
    poder seleccionar los elementos, ie, no se puede definir una funcion para su manejo*/

    circulos.append("circle") // los agregamos al chart como circulos
            .attr("r", radio)
            .style("fill", (d, i) => color(i)); // les entregamos color

    d3.select("#botones") // seleccionamos el html que contendrá a los botones
      .selectAll("button") // los añadimos
      .data(grupos) // según los grupos que tengamos
      .enter().append("button")
      .text(d => "Grupo " + d) // les damos un titulo
      .on("click", d => buttonClick(d)); // cuando sean presionados, cambiaran la opcion de visualizacion

    svg.append("text") // añadimos un titulo
       .attr("class", "title")
       .attr("dx", width/3)
       .attr("dy", -5)
       .text("Grupo " + datos[0].grupo) // mostramos el grupo actual
})

// funcion que permitirá cambiar la visualizacion de los datos
// segun el botón que se utilice, modificando la posicion de los circulos

function buttonClick(grupo) { // on click, entrega como argumento el grupo al cual pertenece el botón

    var datosTransicion = data.filter(d => d.grupo == grupo); // elemento con los datos del grupo actual

    datosTransicion.sort((a, b) => a.x - b.x);

    svg.selectAll(".circulo") // seleccionamos los circulos de los datos
       .data(datosTransicion) // les pasaremos lo nuevos datos
       .transition() // haremos la transicion al trasladarlos
       .delay((d, i) => i * tiempo) // se moveran uno a la vez según su posicion
       .attr("transform",
       d => "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"); // los trasladamos

    d3.select(".title").text("Grupo " + grupo); // cambiamos el titulo
}