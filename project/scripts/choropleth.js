//==========================================================================
//---------------------------VISUALIZATION SCRIPT---------------------------
// Team members: Duy Anh Vuong (Jeff) & Minh Vu Nguyen (Brian)
// Last editted: 5th May 2022
// Purpose: Script to run visualizations in HTML
//==========================================================================


function init() {
    var w = 700;
    var h = 710;

    //--------VISUALIZATION 1: AUSTRALIAN CHOROPLETH-------

    var projection = d3.geoMercator() //projection of the map
                        .center([135, -26])
                        .translate([w/2,h/2])
                        .scale(850);//expand the map

    var path = d3.geoPath().projection(projection);//map projection 

    var svg = d3.select("#australia_choropleth")//set up the svg
                .append("svg")
                .attr("width",w)
                .attr("height",h)
                .attr("fill","teal");

    var color = d3.scaleQuantize()
                    .range(['#543005','#8c510a','#bf812d','#dfc27d','#f6e8c3','#c7eae5','#80cdc1','#35978f','#01665e','#003c30']);

    d3.csv("data/auElectricityGeneration2021.csv", function(data){
        //map the color range based on loaded data
        color.domain(
            [
                d3.min(data,function(d){return d.percent_renewable_generation;}),
                d3.max(data,function(d){return d.percent_renewable_generation;})
            ]
        );
        
        

        d3.json("json/auGeoJson.json", function(json) {
            //merge unemployment data and GeoJSON
            //Loop through once for each unemployment value
            
            for(var i=0; i < data.length; i++){
                //town name
                var dataState = data[i].state;
                
                //data value, convert from string to float
                var dataVal = parseFloat(data[i].percent_renewable_generation);
                
                //find corresponding town inside GeoJSON
                for (var j = 0; j < json.features.length; j++){
                    var jsonState = json.features[j].properties.STATE_CODE;
                    
                    if(dataState == jsonState) {
                        //Copy the data value into the JSON
                        var properties = json.features[j].properties;
                        properties.value = dataVal;
                        properties.black_coal = data[i].black_coal;
                        properties.brown_coal = data[i].brown_coal;
                        properties.natural_gas = data[i].natural_gas;
                        properties.oil_products = data[i].oil_products;
                        properties.bagasse_wood = data[i].bagasse_wood;
                        properties.biogas = data[i].biogas;
                        properties.wind = data[i].wind;
                        properties.hydro = data[i].hydro;
                        properties.large_scale_solar_PV = data[i].large_scale_solar_PV;
                        properties.small_scale_solar_PV = data[i].small_scale_solar_PV;
                        //stop looping through JSON;
                        break;
                    }
                }
            };
            //GeoJSON 
            
            svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d",path)
            .attr("class",function(d){//give each feature a class
                return "state";
            })
            .style("fill",function(d){
                //get data value
                var value = d.properties.value;
                if(value) {
                    //value exists?
                    return color(value);
                }
                else {
                    //if value is undefined, return
                    return "#ccc";
                }
            })
            .style("stroke","black")//stroke color
            .style("stroke-width",0.8)
            .style("opacity", 0.8)//opacity
            .on("mouseover", mouseOverMap)//mouse over trigger
            .on("mouseleave", mouseLeaveMap)//mouse out trigger
            ;
        });
    });

    //_____________________________________________________

    //--------VISUALIZATION 2: INTERACTIVE PIE CHART------
    
    // setting up and radius for visualization
    var radius = Math.min(width, height) / 2;
    
    // Variable that keeps track of boolean value
    var initValue = true;

    // color of visualization
    var color1 = d3.scaleOrdinal(d3.schemeCategory20);
    
    // Duration of animations
    var duration = 600;

    // Pie chart variable
    var pie = d3.pie()
    .value(function(d) { return d.count; })
    .sort(null);

    // Circular arcs for donut pie chart
    var arc = d3.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 20);

    var svg2 = d3.select("infographic_2")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");





    //==========================================================================
    //---------------------------INTERACTIVITY FUNCTIONS------------------------
    //==========================================================================

    //mouseOver function
    var mouseOverMap = function(d) {
        //----------FIRST HIGHLIGHT THE STATE--------------------------------
        d3.selectAll(".state")
            .transition()
            .duration(200)
            .style("opacity", .5)//fade other states
            .style("stroke","black")//stroke color
            ;
            

        d3.select(this) //highlight this state
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "red")

        //--------THEN SHOW ANOTHER DATA VISUALIZATION-------

        //---A CHART--------------------------------

        d3.selectAll("#detailed_info > *").remove();//clear the svg
        
        // set the dimensions and margins of the graph
        var margin = {top: 50, right: 50, bottom: 70, left: 70},
        w = 800 - margin.left - margin.right,
        h = 600 - margin.top - margin.bottom;
        var paddingInner = 0.05;
        var dataset = [
                        ["Black Coal", d.properties.black_coal],
                        [ "Brown Coal",d.properties.brown_coal],
                        ["Natural Gas",d.properties.natural_gas],
                        ["Oil Products",  d.properties.oil_products],
                        ["Bagasse/Wood ", d.properties.bagasse_wood],
                        ["Biogas",  d.properties.biogas],
                        ["Wind", d.properties.wind],
                        [ "Hydro",  d.properties.hydro],
                        [ "Large Solar PV",  d.properties.large_scale_solar_PV],
                        [ "Small Solar PV", d.properties.small_scale_solar_PV]
                        ];
        
        //Arrays of categories for color assignments
        var non_renewable = ["Black Coal", "Brown Coal", "Natural Gas","Oil Products"];
                        
        document.getElementById("state_name").innerHTML = d.properties.STATE_NAME;//change title to state state_name
        
        
        var svg1 = d3.select("#detailed_info")//create the svg
        .append("svg")
        .attr("width",w + margin.left + margin.right)
        .attr("height",h + margin.top + margin.bottom)
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

        ;
        
        var xScale = d3.scaleBand() //Ordinal scale
                    .domain(dataset.map(function(d) { 
                        return d[0];
                    })) //domain will be the first column
                    .range([0,w])
                    .paddingInner(paddingInner)//specify the mapped range, round it to minimize decimal places
                    ; //add padding value
    

        var yScale = d3.scaleLinear()
                .domain([
                    0,//min value = 0
                    d3.max(dataset, function(d) { return parseFloat(d[1])*1.1}),//maximum value
                ])
                .range([h,0])
                ;//range of the domain
    
        //color scales for different categories


        
        svg1.selectAll("rect")
            .data(dataset)//dataset used
            .enter()//data placeholder
            .append("rect")//draw the rectangle for each data
            .attr("x", function(d,i){
                return xScale(d[0])+margin.left;
            })
            .attr("y", function(d){
                return yScale(d[1]); //reverse the axis
            })
            .attr("width",xScale.bandwidth())
            .attr("height",function(d){
                return h-yScale(d[1]);
            })
            .attr("fill",function(d,i){
                if(non_renewable.includes(d[0])) {
                    return '#bf812d'
                }
                else {
                    return '#35978f'
                }
            })
            ;

        svg1.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .attr("x", function(d,i){
                return xScale(d[0])+margin.left;
            })
            .attr("y", function(d){
                return yScale(d[1]); //reverse the axis
            })
            .text(function(d){
                return d[1];
            })
        
        //add xAxis
        var xAxis = d3.axisBottom()
                        .scale(xScale);

        svg1.append("g")
            .attr("transform", "translate("+margin.left+", "+h+")")//add some padding
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-60)")
            .attr("font-size","15px")
            .style("text-anchor", "end");

        //add yAxis
        var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(5);
        
        svg1.append("g")
            .attr("transform", "translate("+margin.left+", 0)")//add some padding
            .call(yAxis)
            .selectAll("text")
            .attr("font-size","15px")
            .se;
    }

    //mouseOut function
    var mouseLeaveMap = function(d) {
        d3.selectAll(".state")
            .transition()
            .duration(200)
            .style("stroke","black")//stroke color
            .style("stroke-width",0.8)
            .style("opacity", 0.8)//opacity
    }

}

window.onload =init;