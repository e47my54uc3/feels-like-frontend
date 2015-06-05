// Helps parse strings and integers
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
    param: function(param){
      var names = {
        'avg_apparent_day_temp': 'Feels Like Day',
        'avg_apparent_night_temp': 'Feels Like Night',
        'high_apparent_temp': 'Feels Like High',
        'low_apparent_temp': 'Feels Like Low',
        'avg_temp': 'Average Temp',
        'high_temp': 'High Temp',
        'low_temp': 'Low Temp',
      };
      return names[param]
    },
    city: function(cityName){
      return cityName.replace('_',' ')
    }
  }
})();
// Abstracts out common code between charts
var helpers = (function(){
  return {
    highlight: function(){
      d3.select(this).attr('stroke-width',5);
      var name = d3.select(this).attr('name');
      d3.selectAll('.keys text').text('');
      d3.select('#'+name).text(name);
    },
    lowlight: function(){
      d3.select(this).attr('stroke-width',2);
      d3.selectAll('.keys text').text(function(d,i){ return d });
    },
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
    makeCompareData2: function(from,to,args){
      var output = [];
      args.params.map( function(param) {
        output.push(from.data.map( function(obj) { return obj[param] }));
        output.push(to.data.map( function(obj) { return obj[param] }));
      });
      return output;
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
        .domain([0, 110]);
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
    appendAxes: function(vis,xRange,yRange,height,margin,raw){
      vis.append("g")
        .attr("class","x axis")
        .attr("transform","translate(0,"+(height - margin.bottom)+")")
        .call(helpers.xAxis(xRange));
      vis.append("g")
        .attr("class","y axis")
        .attr("transform","translate("+(margin.left) +",0)")
        .call(helpers.yAxis(yRange));
      helpers.resetAxis(raw)
    },
    addLegend: function(width,margin,legendSpacing,legendRectSize,args,vis){
      var legend = vis.append('g')
        .attr('class','legend')
        .attr('transform','translate('+(width - margin.right)+','+margin.top+')')

      legend.selectAll('.keys')
        .data(args.names)
        .enter()
        .append('g')
        .attr('class', 'keys')
        .attr('id',function(d,i){
          if (i === args.names.length - 1){
            return 'key1';
          } else if ( i === args.names.length - 2){
            return 'key2';
          };
        })
        .attr('transform', function(d,i){
          var height = legendRectSize + legendSpacing;
          var offset =  height * args.names.length / 2;
          var horz = -2 * legendRectSize;
          var vert = i * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
        });

      var tooltip = legend.append('g')
        .attr('class','tooltip')
        .attr('transform',function(d,i){
          var key1 = parseInt(d3.select('#key1').attr('transform').split(',')[1]);
          var key2 = parseInt(d3.select('#key2').attr('transform').split(',')[1]);
          var horz = -2 * legendRectSize;
          var vert = key1 + (key1 - key2)
          return 'translate(' + horz + ',' + vert + ')';
        })

      tooltip.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill','black')
        .style('stroke','black')

      tooltip.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)

      d3.selectAll('.keys')
        .append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function(d,i){ return args.colors[i] })
        .style('stroke', function(d,i){ return args.colors[i] });

      d3.selectAll('.keys')
        .append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .attr('id',function(d) { return d; })
        .text(function(d) { return d; });

      return legend
    },
    title: function(vis,width,height,margin,text){
      var title = vis.append('g')
        .attr('class','title')
        .attr('width',width)
        .attr('height',height)
        .attr('transform','translate('+(width/2)+','+(margin.top - 10)+')')

      title.append('text')
        .text(text)
        .attr('text-anchor','middle')
        .attr('font-size',30)

      return title
    }
  }
})();
// Creates the charts
var lineCharts = (function(){
  return {
    singleCity: function(raw,id,args){
      // Wipe Target div
      $(id).html('')
      // Create canvas
      var vis = helpers.initCanvas(id),
      // Define our line data
      data = helpers.makeLineData(raw,args),
      // Set Width, Height, and Margin.
      margin = helpers.margins(),
      width = helpers.width(id,margin),
      height = helpers.height(id,margin),
      // Set xRange. See helpers for details
      xRange = helpers.setXRange(raw,margin,width),
      // Set yRange. See helpers for details
      yRange = helpers.setYRange(data,margin,height),
      // Initialize tooltip group
      focus = helpers.initTooltip(vis),
      // Legend constants
      legendRectSize = 18,
      legendSpacing = 4,
      // Add the legend
      legend = helpers.addLegend(width,margin,legendSpacing,legendRectSize,args,vis),
      // Initialize the title group
      title = helpers.title(vis,width,height,margin,(args.title+parse.city(raw.city.name)));
      // Append the Axises and fix the numbers there.
      helpers.appendAxes(vis,xRange,yRange,height,margin,raw);
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
          d3.select('.tooltip text').text(raw.data[i].mday+" "+parse.month(raw.data[i].month)+" : "+temp+" F");
          d3.select('.tooltip rect')
            .style('stroke',d3.select(this).style('stroke'))
            .style('fill',d3.select(this).style('stroke'));
        })
    },
    compareCities: function(from,to,id,param){
      // Wipe Target div
      $(id).html('')
      // Create canvas
      var vis = helpers.initCanvas(id),
      // Define our line data
      data = helpers.makeCompareData(from,to,param),
      // Define the line colors.
      colors = ['red','blue'],
      // Define the line names.
      names = [parse.city(from.city.name),parse.city(to.city.name)],
      args = { colors: colors, names: names },
      // Set Width, Height, and Margin.
      margin = helpers.margins(),
      width = helpers.width(id,margin),
      height = helpers.height(id,margin),
      // Set xRange. See helpers above
      xRange = helpers.setXRange(from,margin,width),
      // Set yRange. See helpers above
      yRange = helpers.setYRange(data,margin,height),
      // Initialize tooltip group
      focus = helpers.initTooltip(vis),
      // Legend constants
      legendRectSize = 18,
      legendSpacing = 4,
      // Add the legend
      legend = helpers.addLegend(width,margin,legendSpacing,legendRectSize,args,vis),
      // Initialize the title group
      title = helpers.title(vis,width,height,margin,(parse.param(param)+" comparison: "+parse.city(from.city.name)+" & "+parse.city(to.city.name)));
      // Append the Axises.
      helpers.appendAxes(vis,xRange,yRange,height,margin,from);
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
          city = [from,to].filter(function(obj){ return parse.city(obj.city.name) === cityName })[0];
          focus.style('display',null)
            .attr('transform',"translate("+m[0]+","+m[1]+")")
          d3.select('.tooltip text').text(
              city.data[i].mday+" "+parse.month(city.data[i].month)+": "+temp+" F");
          d3.select('.tooltip rect')
            .style('stroke',d3.select(this).style('stroke'))
            .style('fill',d3.select(this).style('stroke'));
        })
    },
    dayNight: function(raw,id,args){
      // Wipe Target div
      $(id).html('');
      // Create canvas
      var vis = helpers.initCanvas(id),
      // Define our line data
      data = helpers.makeLineData(raw,args),
      // Set Width, Height, and Margin.
      margin = helpers.margins(),
      width = helpers.width(id,margin),
      height = helpers.height(id,margin),
      // Set xRange. See helpers
      xRange = helpers.setXRange(raw,margin,width),
      // Set yRange. Needs custom domain for number of min in a day.
      yRange = d3.scale.linear()
        .range([height - margin.top, margin.bottom])
        .domain([0,1440]),
      // Initialize tooltip group
      focus = helpers.initTooltip(vis),
      // Legend constants
      legendRectSize = 18,
      legendSpacing = 4,
      // Add the legend
      legend = helpers.addLegend(width,margin,legendSpacing,legendRectSize,args,vis),
      // Initialize the Title group
      title = helpers.title(vis,width,height,margin,(args.title+parse.city(raw.city.name)));
      // Create a blank line
      line = d3.svg.line()
        .x(function(d,i){ return xRange(i+1);})
        .y(function(d){ return yRange(parse.toMinutes(d))})
        .interpolate('basis');
      // Append the Axises.
      helpers.appendAxes(vis,xRange,yRange,height,margin,raw);
      helpers.resetAxisDates(raw)
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
          d3.select('.tooltip text').text(raw.data[i].mday+" "+parse.month(raw.data[i].month)+": "+time);
          d3.select('.tooltip rect')
            .style('stroke',d3.select(this).style('stroke'))
            .style('fill',d3.select(this).style('stroke'));
        })
    },
  }
})();