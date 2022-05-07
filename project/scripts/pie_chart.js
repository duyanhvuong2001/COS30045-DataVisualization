function init() {
    //--------VISUALIZATION 2: INTERACTIVE PIE CHART------

    // setting up and radius for visualization
    w = 600;
    h = 600;
    var innerRadius = w/2;
    var outerRadius = 0;
    // color of visualization
    var color1 = d3
        .scaleOrdinal(d3.schemeCategory10);

    // Duration of animations
    var duration = 2000;

    // Pie chart variable
    var pie = d3
        .pie()
        .value(function (d) {
        console.log(d.percentage);
        return d.percentage;
        });

    // Circular arcs for donut pie chart
    var arc = d3
                .arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

    var label = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius - 80);

    // setting up SVG for visualization
    var svg2 = d3
        .select("#pie_1")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .append("g")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
    

    d3.csv("data/totalPercentageGeneration2021.csv", function (error, data) {
        // troubleshoot if error exist
        if (error) {
        throw error;
        }

        // setting up arcs for visualization
        var arcs = svg2
        .selectAll("g.arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform","translate("+outerRadius+","+outerRadius+")")//make a pie chart with 0 inner radius;

        // adding color to chords of pie chart
        arcs.append("path")
            .attr("fill", function (d) {
            return color1(d.data.types);
            })
            .attr("d",function (d,i) {
            return arc(d,i);
            });

        console.log("ditme");
        // data written on graph
        arcs
        .append("text")
        .text(function (d) {
            return d.value;
        })
        .attr("transform", function (d) {
            return "translate(" + label.centroid(d) + ")";
        });
    });
}

window.addEventListener("load",init);