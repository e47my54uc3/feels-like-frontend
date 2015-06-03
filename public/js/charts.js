// Call first chart with lineCharts.feelsLike(cityData,targetElementId)

var lineCharts = (function(){
  var singleCity = function(raw,id,args){


    // Wipe Target div
    $(id).html('')


    // Create canvas
    $('<svg id="visualisation" width="'+parseInt(d3.select(id).style('width'),10)+'" height="500"></svg>').appendTo(id);

    // Initialize the canvas
    var vis = d3.select("#visualisation");

    // Define our line data
    var data = args.params.map( function(param) {
      return raw.data.map( function(obj) { return obj[param] })
    });

    // Define the line colors.
    var colors = args.colors;

    // Define the line names.
    var names = args.names;

    // To help pull the styles for height and width
    var style = function(selector,attr){
      return /\d+/.exec(d3.select(selector).style(attr))
    }

    // Set Width, Height, and Margin.
    var margin = { top: 20, right: 20, bottom: 20, left: 50 };
    var width = style(id,'width') - margin.left - margin.right;
    var height = style(id,'height') - margin.top - margin.bottom;

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
        d3.min([].concat.apply([],data),function (d) { return Math.round(d); }),
        d3.max([].concat.apply([],data),function (d) { return Math.round(d); })
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
    // Reset xAxis to Human read
    d3.selectAll('g.x .tick text').html(function(d){
      var current = raw.data[d-1];
      return parse.month(current.month)+' '+current.mday
    })

    // Reset yAxis to proper scale
    d3.selectAll('g.y .tick text').html(function(d){
      return d + ' F'
    })
  }

  var compareCities = function(from,to,id,param){
    // Wipe Target div
    $(id).html('')

    // easily access things
    var raw = [from,to];

    // Create canvas
    $('<svg id="visualisation" width="'+parseInt(d3.select(id).style('width'),10)+'" height="500"></svg>').appendTo(id);

    // Initialize the canvas
    var vis = d3.select("#visualisation");

    // Define our line data
    var data =
      [
        from.data.map( function(obj) { return obj[param] } ),
        to.data.map( function(obj) { return obj[param] } ),
      ];

    // Define the line colors.
    var colors = ['red','blue'];

    // Define the line names.
    var names = [from.city.name,to.city.name];

    // To help pull the styles for height and width
    var style = function(selector,attr){
      return /\d+/.exec(d3.select(selector).style(attr))
    }

    // Set Width, Height, and Margin.
    var margin = { top: 20, right: 20, bottom: 20, left: 50 };
    var width = style(id,'width') - margin.left - margin.right;
    var height = style(id,'height') - margin.top - margin.bottom;

    // Set xRange. The scale is set for months 1-12.
    var xRange = d3.scale.linear()
      .range([margin.left, width - margin.right])
      .domain([
        d3.min(from.data,function (d,i) { return d.yday; }),
        d3.max(from.data,function (d,i) { return d.yday; })
      ]);

    // Set yRange. The scale is set to the highest number and the lowest number in the dataset.
    var yRange = d3.scale.linear()
      .range([height - margin.top, margin.bottom])
      .domain([
        d3.min(data[0].concat(data[1]),function (d) { return Math.round(d); }),
        d3.max(data[0].concat(data[1]),function (d) { return Math.round(d); })
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
        temp = Math.round(d[i]),
        cityName = d3.select(this).attr('name'),
        city = raw.filter(function(obj){ return obj.city.name === cityName })[0];
        focus.style('display',null)
          .attr('transform',"translate("+m[0]+","+m[1]+")")
          .select('text').text(
            parse.month(city.data[i].month)+" "+city.data[i].mday+" "+cityName+": "+temp);
      })
    // Reset xAxis to Human read
    d3.selectAll('g.x .tick text').html(function(d){
      var current = from.data[d-1];
      return parse.month(current.month)+' '+current.mday
    })

    // Reset yAxis to proper scale
    d3.selectAll('g.y .tick text').html(function(d){
      return d + ' F'
    })
  }

  return {
    singleCity: singleCity,
    compareCities: compareCities,
  }

})();

var parse = (function(){
  return {
    month: function(number){
      var months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec']
      return months[number - 1]
    },
  }
})();