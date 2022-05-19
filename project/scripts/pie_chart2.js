function init() {
  //--------VISUALIZATION 2: 2ND INTERACTIVE PIE CHART------

  // setting up and radius for visualization
  w = 600;
  h = 600;
  margin = 90;
  var radius = Math.min(w, h) / 2 - margin;
  // color of visualization
  var color = d3
    .scaleOrdinal()
    .range([
      "#8dd3c7",
      "#ffffb3",
      "#bebada",
      "#fb8072",
      "#80b1d3",
      "#fdb462",
      "#b3de69",
      "#fccde5",
      "#d9d9d9",
      "#bc80bd",
      "#ccebc5",
      "#ffed6f",
    ]);

  // Duration of animations
  var ANIMATION_DURATION = 200;

  var labelDictionary = {
    //Dictionary for nicer label displays
    wind: "Wind",
    small_scale_solar: "Small Scale Solar",
    hydro: "Hydro",
    large_scale_solar: "Large Scale Solar",
    bioenergy: "Bioenergy",
    medium_scale_solar: "Medium Scale Solar",
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
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.8);

  // Circular arc for the pop-out functionality
  var popoutArc = d3
    .arc()
    .innerRadius(radius * 0.7)
    .outerRadius(radius * 1.0);

  // Outer arc for labeling
  var outerArc = d3
    .arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  // var label = d3
  //     .arc()
  //     .innerRadius(innerRadius)
  //     .outerRadius(outerRadius - 80);

  // setting up SVG for visualization
  var svg = d3
    .select("#pie_2")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  d3.csv("data/renewablePercentageGeneration2021.csv", function (error, data) {
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
      .attr("class", "arc")
      .on("mouseover", function (d) {
        d3.select(this)
          .append("title")
          .text(function (d) {
            return "This value is " + d;
          });
      });
    //-----------------------PIE SLICES--------------------------------//

    // adding color to chords of pie chart
    arcs
      .append("path")
      .attr("fill", function (d) {
        //color
        if (d.data.types == "renewables") {
          return "#35978f"; //green
        } else {
          return color(d.data.types);
        }
      })
      .attr("stroke", "white")
      .attr("d", function (d, i) {
        //arc
        return arc(d, i);
      });

    //-----------------------TEXT LABELS--------------------------------//
    // data written on graph
    svg
      .selectAll("allLabels")
      .data(pie(data))
      .enter()
      .append("text")
      .text(function (d) {
        //    return labelDictionary[d.data.types];
        return d.data.percentage + "%";
      })
      .attr("transform", function (d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return "translate(" + pos + ") rotate(-60)";
      })
      .style("text-anchor", function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      });

    //-----------------------SLICE TO TEXT POLYLINES--------------------------------//
    svg
      .selectAll("allPolylines")
      .data(pie(data))
      .enter()
      .append("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", function (d) {
        var posA = arc.centroid(d); // line insertion in the slice
        var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC];
      });

    //-----------------------TOOLTIPS---------------------------------------------//
    var tooltip = d3
      .select("#pie_tooltip2")
      .append("div")
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "none")
      .style("position", "relative")
      .style("text-align", "center")
      .style("border-width", "1px")
      .style("width", "150px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    tooltip.append("div").attr("class", "types");

    tooltip.append("div").attr("class", "percentage");
    //-----------------------MOUSEOVER ACTIONS------------------------------------//

    arcs.on("mouseover", function (d) {
      tooltip.select(".types").html(labelDictionary[d.data.types]);
      tooltip.style("opacity", 1);
      tooltip.style("border", "solid");
      // mouseover pie chart slices
      d3.select(this)
        .style("stroke", "rgb(0,0,0)")
        .style("opacity", 1)
        .style("stroke-width", 1);
    });

    arcs.on("mouseleave", function (d) {
      tooltip.style("opacity", 0);
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .style("stroke-width", 0)
        .style("border", "none");
    });

    arcs.on("mousemove", function (d) {
      tooltip
        // .style("top", d3.select(this).attr("cy") + "px")
        // .style("left", d3.select(this).attr("cx") + "px");
        .style("left", d3.mouse(this)[0] + 800 + "px")
        .style("top", d3.mouse(this)[1] - 300 + "px");
    });
  });
}

window.addEventListener("load", init);
