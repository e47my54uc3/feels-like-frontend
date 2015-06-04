// parse module helps to parse various strings and integers that help make up the chart
var parse = (function(){
  return {
    month: function(number){
      var months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec']
      return months[number - 1]
    },
    toMinutes: function(timeString){
      var hourMinute = timeString.split(':');
      return (hourMinute[0]*60 + parseInt(hourMinute[1]))
    },
    minutesToString: function(minutes){
      var hourMinute = [Math.floor(minutes/60),minutes % 60];
      hourMinute[0].toString().length === 2 ? null : hourMinute[0] = '0' + hourMinute[0];
      hourMinute[1].toString().length === 2 ? null : hourMinute[1] = '0' + hourMinute[1];
      return hourMinute.join(':');
    },
    style: function(selector,attr){
      return /\d+/.exec(d3.select(selector).style(attr))
    },
  }
})();
// helpers module abstracts out common logic between the different charts
var helpers = (function(){
  return {
    highlight: function(){ d3.select(this).attr('stroke-width',5); },
    lowlight: function(){ d3.select(this).attr('stroke-width',2); },
    resetAxis: function(raw){
      d3.selectAll('g.x .tick text').html(function(d){
        var current = raw.data[d-1];
        return parse.month(current.month)+' '+current.mday
      })
      d3.selectAll('g.y .tick text').html(function(d){
        return d + ' F'
      })
    },
    resetAxisDates: function(raw){
      d3.selectAll('g.x .tick text').html(function(d){
        var current = raw.data[d-1];
        return parse.month(current.month)+' '+current.mday
      })
      d3.selectAll('g.y .tick text').html(function(d){
        return parse.minutesToString(d)
      })
    },
    initCanvas: function(id){
      return d3.select(id).append('svg')
        .style('width', function(){ return parseInt(d3.select(id).style('width'),10)} )
        .style('height', 500)
        .attr('id', 'visualisation')
    },
    makeLineData: function(raw,args){
      return args.params.map( function(param) {
        return raw.data.map( function(obj) { return obj[param] })
      });
    },
    makeCompareData: function(from,to,param){
      return [
          from.data.map( function(obj) { return obj[param] } ),
          to.data.map( function(obj) { return obj[param] } ),
        ];
    },
    setXRange: function(raw,margin,width){
      return d3.scale.linear()
        .range([margin.left, width - margin.right])
        .domain([
          d3.min(raw.data,function (d,i) { return d.yday; }),
          d3.max(raw.data,function (d,i) { return d.yday; })
        ]);
    },
    setYRange: function(data,margin,height){
      return d3.scale.linear()
        .range([height - margin.top, margin.bottom])
        .domain([
          d3.min([].concat.apply([],data),function (d) { return Math.round(d); }),
          d3.max([].concat.apply([],data),function (d) { return Math.round(d); })
        ]);
    },
    margins: function(){
      return { top: 50, right: 20, bottom: 50, left: 50 };
    },
    width: function(id,margin){
      return parse.style(id,'width') - margin.left - margin.right;
    },
    height: function(id,margin){
      return parse.style(id,'height') - margin.top - margin.bottom;
    },
    xAxis: function(xRange){
      return d3.svg.axis()
        .scale(xRange)
        .tickSize(2)
        .tickSubdivide(true)
    },
    yAxis: function(yRange){
      return d3.svg.axis()
        .scale(yRange)
        .tickSize(2)
        .orient("left")
        .tickSubdivide(true);
    },
    line: function(xRange,yRange){
      return d3.svg.line()
        .x(function(d,i){ return xRange(i+1);})
        .y(function(d){return yRange(d)})
        .interpolate('basis')
    },
    initTooltip: function(vis){
      var focus = vis.append("g")
        .attr("class", "focus")
        .style("display", "none");
      // Tooltip circle
      focus.append("circle")
        .attr('fill','none')
        .attr('stroke','blue')
        .attr("r", 6);
      // Tooltip text
      focus.append("text")
        .attr("x", 10)
        .attr("dy", ".35em");
      return focus
    },
  }
})();
// calls the other methods and creates the lineCharts
var lineCharts = (function(){
  return {
    singleCity: function(raw,id,args){
      // Wipe Target div
      $(id).html('')
      // Create canvas
      var vis = helpers.initCanvas(id)
      // Define our line data
      var data = helpers.makeLineData(raw,args)
      // Set Width, Height, and Margin.
      var margin = helpers.margins()
      var width = helpers.width(id,margin)
      var height = helpers.height(id,margin)
      // Set xRange. See helpers for details
      var xRange = helpers.setXRange(raw,margin,width)
      // Set yRange. See helpers for details
      var yRange = helpers.setYRange(data,margin,height)
      // Append the Axises.
      vis.append("g")
        .attr("class","x axis")
        .attr("transform","translate(0,"+(height - margin.bottom)+")")
        .call(helpers.xAxis(xRange));
      vis.append("g")
        .attr("class","y axis")
        .attr("transform","translate("+(margin.left) +",0)")
        .call(helpers.yAxis(yRange));
      // Initialize tooltip group
      var focus = helpers.initTooltip(vis)
      // Create all the lines
      vis.selectAll('.line')
        .data(data)
        .enter().append('path')
        .attr('class','line')
        .attr('d',helpers.line(xRange,yRange))
        .attr("stroke", function(d,i){ return args.colors[i] })
        .attr('name', function(d,i){ return args.names[i] })
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .on('mouseover', helpers.highlight)
        .on('mouseout', helpers.lowlight)
        .on('mousemove', function(d){
          var m = d3.mouse(this),
          i = Math.round(xRange.invert(m[0])) - 1,
          temp = Math.round(d[i]);
          focus.style('display',null)
            .attr('transform',"translate("+m[0]+","+m[1]+")")
            .select('text').text(
              parse.month(raw.data[i].month)+" "+raw.data[i].mday+" "+d3.select(this).attr('name')+": "+temp);
        })
        // Change the Axis to human readable
        helpers.resetAxis(raw);
    },
    compareCities: function(from,to,id,param){
      // Wipe Target div
      $(id).html('')
      // Create canvas
      var vis = helpers.initCanvas(id)
      // Define our line data
      var data = helpers.makeCompareData(from,to,param)
      // Define the line colors.
      var colors = ['red','blue'];
      // Define the line names.
      var names = [from.city.name,to.city.name];
      // Set Width, Height, and Margin.
      var margin = helpers.margins()
      var width = helpers.width(id,margin)
      var height = helpers.height(id,margin)
      // Set xRange. See helpers above
      var xRange = helpers.setXRange(from,margin,width)
      // Set yRange. See helpers above
      var yRange = helpers.setYRange(data,margin,height)
      // Append the Axises.
      vis.append("g")
        .attr("class","x axis")
        .attr("transform","translate(0,"+(height - margin.bottom)+")")
        .call(helpers.xAxis(xRange));
      vis.append("g")
        .attr("class","y axis")
        .attr("transform","translate("+(margin.left) +",0)")
        .call(helpers.yAxis(yRange));
      // Initialize tooltip group
      var focus = helpers.initTooltip(vis)
      // Create all the lines
      vis.selectAll('.line')
        .data(data)
        .enter().append('path')
        .attr('class','line')
        .attr('d',helpers.line(xRange,yRange))
        .attr("stroke", function(d,i){ return colors[i] })
        .attr('name', function(d,i){ return names[i] })
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .on('mouseover', helpers.highlight)
        .on('mouseout', helpers.lowlight)
        .on('mousemove', function(d){
          var m = d3.mouse(this),
          i = Math.round(xRange.invert(m[0])) - 1,
          temp = Math.round(d[i]),
          cityName = d3.select(this).attr('name'),
          city = [from,to].filter(function(obj){ return obj.city.name === cityName })[0];
          focus.style('display',null)
            .attr('transform',"translate("+m[0]+","+m[1]+")")
            .select('text').text(
              parse.month(city.data[i].month)+" "+city.data[i].mday+" "+cityName+": "+temp);
        })
      helpers.resetAxis(from)
    },
    dayNight: function(raw,id,args){
      // Wipe Target div
      $(id).html('');
      // Create canvas
      var vis = helpers.initCanvas(id);
      // Define our line data
      var data = helpers.makeLineData(raw,args)
      // Set Width, Height, and Margin.
      var margin = helpers.margins()
      var width = helpers.width(id,margin)
      var height = helpers.height(id,margin)
      // Set xRange. See helpers
      var xRange = helpers.setXRange(raw,margin,width);
      // Set yRange. See helpers
      var yRange = d3.scale.linear()
        .range([height - margin.top, margin.bottom])
        .domain([0,1440]);
      // Append the Axises.
      vis.append("g")
        .attr("class","x axis")
        .attr("transform","translate(0,"+(height - margin.bottom)+")")
        .call(helpers.xAxis(xRange));
      vis.append("g")
        .attr("class","y axis")
        .attr("transform","translate("+(margin.left) +",0)")
        .call(helpers.yAxis(yRange));
      // Initialize tooltip group
      var focus = helpers.initTooltip(vis)
      // Create a blank line
      var line = d3.svg.line()
        .x(function(d,i){ return xRange(i+1);})
        .y(function(d){ return yRange(parse.toMinutes(d))})
        .interpolate('basis')
      // Create all the lines
      vis.selectAll('.line')
        .data(data)
        .enter().append('path')
        .attr('class','line')
        .attr('d',line)
        .attr("stroke", function(d,i){ return args.colors[i] })
        .attr('name', function(d,i){ return args.names[i] })
        .attr("stroke-width", 2)
        .attr("fill", 'none')
        .on('mouseover', helpers.highlight)
        .on('mouseout', helpers.lowlight)
        .on('mousemove', function(d){
          var m = d3.mouse(this),
          i = Math.round(xRange.invert(m[0])) - 1,
          time = d[i];
          focus.style('display',null)
            .attr('transform',"translate("+m[0]+","+m[1]+")")
            .select('text') .text(parse.month(raw.data[i].month)+" "+raw.data[i].mday+" "+d3.select(this).attr('name')+": "+time);
        })
      helpers.resetAxisDates(raw);
    },
  }
})();