// Call first chart with lineCharts.feelsLike(cityData,targetElementId)

var lineCharts = (function(){
  var feelsLike = function(apiData,id){

    // Parse raw API data
    var raw = apiData

    // Create canvas
    $('<svg id="visualisation" width="'+parseInt(d3.select(id).style('width'),10)+'" height="500"></svg>').appendTo(id);

    // Initialize the canvas
    var vis = d3.select("#visualisation");

    // Define our line data
    var data =
      [
        raw.data.map( function(obj) { return obj.avg_apparent_day_temp } ),
        raw.data.map( function(obj) { return obj.avg_apparent_night_temp } ),
        raw.data.map( function(obj) { return obj.high_apparent_temp } ),
        raw.data.map( function(obj) { return obj.low_apparent_temp } )
      ];

    // Define the line colors.
    var colors = ['yellow','grey','red','blue'];

    // Define the line names.
    var names = ['Daytime','Nighttime','High','Low'];

    // Set Width, Height, and Margin.
    var margin = { top: 20, right: 20, bottom: 20, left: 50 };
    var width = 1000 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    // Set xRange. The scale is set for months 1-12.
    var xRange = d3.scale.linear()
      .range([margin.left, width - margin.right])
      .domain([
        d3.min(raw.data,function (d,i) { return d.yday; }),
        d3.max(raw.data,function (d,i) { return d.yday; })
      ]);

    // Set yRange. The scale is set to the highest number and the lowest number in the dataset.
    var yRange = d3.scale.linear()
      .range([height - margin.top, margin.bottom])
      .domain([
        d3.min(data[3],function (d) { return Math.round(d); }),
        d3.max(data[2],function (d) { return Math.round(d); })
      ]);

    // Append the x,y axis and specify tick specifics.
    var xAxis = d3.svg.axis()
      .scale(xRange)
      .tickSize(2)
      .tickSubdivide(true)

    var yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(2)
      .orient("left")
      .tickSubdivide(true);

    // Append the Axises.
    vis.append("g")
      .attr("class","x axis")
      .attr("transform","translate(0,"+(height - margin.bottom)+")")
      .call(xAxis);

    vis.append("g")
      .attr("class","y axis")
      .attr("transform","translate("+(margin.left) +",0)")
      .call(yAxis);

    // Initialize tooltip group
    var focus = vis.append("g")
      .attr("class", "focus")
      .style("display", "none");

    // Tooltip circle
    focus.append("circle")
      .attr("r", 4.5);

    // Tooltip text
    focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

    // Create a blank line
    var line = d3.svg.line()
      .x(function(d,i){ return xRange(i+1);})
      .y(function(d){return yRange(d)})
      .interpolate('basis')

    // Create all the lines
    vis.selectAll('.line')
      .data(data)
      .enter().append('path')
      .attr('class','line')
      .attr('d',line)
      .attr("stroke", function(d,i){ return colors[i] })
      .attr('name', function(d,i){ return names[i] })
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .on('mouseover',
        function(d) {
          d3.select(this).attr('stroke-width',5);
        })
      .on('mouseout',
        function(d) {
          d3.select(this).attr('stroke-width',2);
        })
      .on('mousemove', function(d){
        var m = d3.mouse(this),
        i = Math.round(xRange.invert(m[0])) - 1,
        temp = Math.round(d[i]);
        focus.style('display',null)
          .attr('transform',"translate("+m[0]+","+m[1]+")")
          .select('text').text(
            parse.month(raw.data[i].month)+" "+raw.data[i].mday+" "+d3.select(this).attr('name')+": "+temp);
      })
  }

  return {
    feelsLike: feelsLike
  }

})();

var parse = (function(){
  return {
    month: function(number){
      var months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec']
      return months[number - 1]
    }
  }
})();