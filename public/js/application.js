var lineChart = (function(){
  var initChart = function(fkData){
    var vis = d3.select("#visualisation"),
      WIDTH = 1000,
      HEIGHT = 500,
      MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
      },
    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(fkData, function (d) {
        return d.time;
      }),
      d3.max(fkData, function (d) {
        return d.time;
      })
    ]),
    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(fkData, function (d) {
        return d.cloudCover;
      }),
      d3.max(fkData, function (d) {
        return d.cloudCover;
      })
    ]),
    xAxis = d3.svg.axis()
      .scale(xRange)
      .tickSize(5)
      .tickSubdivide(true),
    yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(5)
      .orient("left")
      .tickSubdivide(true);
    vis.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
      .call(xAxis);
    vis.append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + (MARGINS.left) + ",0)")
      .call(yAxis);
    var lineFunc = d3.svg.line()
    .x(function (d) {
      return xRange(d.time);
    })
    .y(function (d) {
      return yRange(d.cloudCover);
    })
    .interpolate('linear');
    vis.append("svg:path")
      .attr("d", lineFunc(fkData))
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("fill", "none");
    };

  return {
    initChart: initChart
  }

})();


$(document).ready(function() {
  $('body').on('click','#compare',function(event){
    var c1 = $('input[name="c1"]').val();
    var c2 = $('input[name="c2"]').val();
    event.preventDefault();
    $.get("/things").done(function(data){
      var fk_resp = JSON.parse(data).hourly.data;
      $('<svg id="visualisation" width="1000" height="500"></svg>').appendTo('#things');
      lineChart.initChart(fk_resp);
    });
  })
});
