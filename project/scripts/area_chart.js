function init() {
     //--------VISUALIZATION 3: AREA CHART------

    // setting up and radius for visualization
    var margin = { top: 50, right: 50, bottom: 70, left: 70 },
    w = 1200 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom;
    
    
   

    //store buttons in an array
    var stateButtons = document.getElementsByClassName("stateBtn");

        for (var i = 0; i < stateButtons.length; i++) {

        stateButtons[i].onclick = function() {
            d3.selectAll("#area_graph > *").remove(); //clear the svg

            var svg = d3.select("#area_graph")
            .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
    
            var filepath = "data/" + this.textContent + "ElectricityGeneration08-21.csv"//concatenate strings based on buttons clicked
            this.addEventListener("click",changeData(filepath,w,h,svg));

        }
    }
}

function changeData(filepath, w, h, svg) {
    

    var dataset;

     // color of visualization
     var color = {
        "black_coal": "#4d4d4d",//black
        "brown_coal": "#8c510a",//brown
        "natural_gas": "#f6e8c3",//light brown
        "oil_products": "#999999",//gray
        "other_a": "#f5f5f5",
        "bagasse_wood": "#c7eae5",
        "biogas": "#90ee90",
        "wind": "#35978f",
        "hydro": "#4393c3",
        "large_scale_solar_PV": "#80cdc1",
        "small_scale_solar_PV": "#01665e"
    }
    
    var rowConverter = function(d) {//converter function
        return {
            year: new Date(d.year),
            black_coal: d.black_coal,
            brown_coal: d.brown_coal,
            natural_gas: d.natural_gas,
            oil_products: d.oil_products,
            other_a: d.other_a,
            bagasse_wood: d.bagasse_wood,
            biogas: d.biogas,
            wind: d.wind,
            hydro: d.hydro,
            large_scale_solar_PV: d.large_scale_solar_PV,
            small_scale_solar_PV: d.small_scale_solar_PV
        }
    }
    d3.csv(filepath, rowConverter, function(error, data) {
        if(error) {
            throw error;//throw error if any;
        }

        dataset = data;
         // group the data: one array for each value of the X axis.
        console.log(dataset);

        var stack = d3.stack()
        .keys([
            "black_coal",
            "brown_coal",
            "natural_gas",
            "oil_products",
            "other_a",
            "bagasse_wood",
            "biogas","wind",
            "hydro",
            "large_scale_solar_PV",
            "small_scale_solar_PV"
        ])

        var stackedData = stack(dataset);

        console.log(stackedData);

        var xScale = d3.scaleTime()//x axis and scale is the year
            .domain([
                d3.min(dataset, function(d) { return d.year}),//minimum date
                d3.max(dataset, function(d) { return d.year})//maximum date
            ])
            .range([0,w]);

        var yScale = d3.scaleLinear()//y axis and scale is the data
                .domain([
                    0,
                    d3.max(stackedData[stackedData.length - 1], function(d) {
                        return d[1];
                    })
                ])
                .range([h,0]);
        
        //set up area
        var area = d3.area()
                        .x(function(d) {
                            return xScale(d.data.year)
                        })
                        .y0(function(d) {
                            return yScale(d[0]);
                        })
                        .y1(function(d) {
                            return yScale(d[1]);
                        });
        
        //draw area
        var series = svg.selectAll('g.series')
                        .data(stackedData)
                        .enter()
                        .append("g")
                        .attr("class","series");
        
        series.append("path")
                .attr("fill",function(d,i) {
                    return color[d.key];
                })
                .attr("d",function(d){
                    return area(d);
                })
        //draw xAxis
        var xAxis = d3.axisBottom()
                        .scale(xScale)
                        .ticks(dataset.length);

        svg.append("g")
            .attr("transform", "translate(0, "+h+")")//move the axis to the bottom of the chart, added some padding
            .call(xAxis);
            
        //draw yAxis
        var yAxis = d3.axisLeft()
                        .scale(yScale)
        svg.append("g")
            .call(yAxis);
    });
}

window.addEventListener("load",init);