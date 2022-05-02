function init() {
    var w = 700;
    var h = 500;

    var projection = d3.geoMercator() //projection of the map
                        .center([135, -26])
                        .translate([w/2,h/2])
                        .scale(600);//expand the map

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

    //---------------------------INTERACTIVITY FUNCTIONS------------------------

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

        var w = 300;
        var h = 300;
        var horizontalPadding = 10;
        var verticalPadding = 30;

        var dataset = [
                        {category: "Black Coal", value: d.properties.black_coal},
                        {category: "Brown Coal", value: d.properties.brown_coal},
                        {category: "Natural Gas", value: d.properties.natural_gas},
                        {category: "Oil Products", value: d.properties.oil_products},
                        {category: "Bagasse/Wood ", value: d.properties.bagasse_wood},
                        {category: "Biogas", value: d.properties.biogas},
                        {category: "Wind", value: d.properties.wind},
                        {category: "Hydro", value: d.properties.hydro},
                        {category: "Large Scale Solar PV", value: d.properties.large_scale_solar_PV},
                        {category: "Small Scale Solar PV", value: d.properties.small_scale_solar_PV}
                        ];
        document.getElementById("state_name").innerHTML = d.properties.STATE_NAME;//change title to state state_name

        var svg = d3.select("#detailed_info")//create the svg
        .append("svg")
        .attr("width",w)
        .attr("height",h);

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