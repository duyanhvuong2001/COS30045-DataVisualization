function init() {
    //--------VISUALIZATION 2: INTERACTIVE PIE CHART------

    // setting up and radius for visualization
    w = 600;
    h = 600;
    margin = 90;
    var radius = Math.min(w, h) / 2 - margin;
    // color of visualization
    var color = d3
                    .scaleOrdinal()
                    .range([
                    "#8c510a",
                    "#bf812d",
                    "#dfc27d",
                    "#f6e8c3",
                    ]);

    // Duration of animations
    var ANIMATION_DURATION = 1000;
    
    var labelDictionary = {//Dictionary for nicer label displays
        "coal": "Coal",
        "non_metered_fossil_fuels": "Non-metered Fossil Fuels",
        "renewables": "Renewables",
        "liquids": "Liquids",
        "gas":"Gas"
    };
    // Pie chart variable
    var pie = d3
        .pie()
        .sort(null)
        .value(function (d) {
        return d.percentage;
        });

    // Circular arcs for donut pie chart
    var arc = d3
                .arc()
                .innerRadius(radius*0.5)
                .outerRadius(radius*0.8);

    var outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

    // var label = d3
    //     .arc()
    //     .innerRadius(innerRadius)
    //     .outerRadius(outerRadius - 80);

    // setting up SVG for visualization
    var svg = d3
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
        var arcs = svg
        .selectAll("g.arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");
        //-----------------------PIE SLICES--------------------------------//

        // adding color to chords of pie chart
        arcs.append("path")
            .attr("fill", function (d) {//color
                if(d.data.types=="renewables") {
                    return "#35978f"//green
                }
                else {
                    return color(d.data.types)
                }
            })
            .attr("stroke", "white")
            .attr("d",function (d,i) {//arc
                return arc(d,i);
            });
        

        //-----------------------TEXT LABELS--------------------------------//
        // data written on graph
        svg
            .selectAll('allLabels')
            .data(pie(data))
            .enter()
            .append('text')
              .text( function(d) {
                   return labelDictionary[d.data.types];
                } )
              .attr('transform', function(d) {
                  var pos = outerArc.centroid(d);
                  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                  pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                  return 'translate(' + pos + ') rotate(-60)';
              })
              .style('text-anchor', function(d) {
                  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                  return (midangle < Math.PI ? 'start' : 'end')
              })

        //-----------------------SLICE TO TEXT POLYLINES--------------------------------//
        svg
            .selectAll('allPolylines')
            .data(pie(data))
            .enter()
            .append('polyline')
                .attr("stroke", "black")
                .style("fill", "none")
                .attr("stroke-width", 1)
                .attr('points', function(d) {
                var posA = arc.centroid(d) // line insertion in the slice
                var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                var posC = outerArc.centroid(d); // Label position = almost the same as posB
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
                });
        
        
     });

}

window.addEventListener("load",init);