var chart = (function(){
  return {
    resize: function(elementId){
      d3.select(window).on('resize', resize(elementId));

      function resize(elementId) {
          // update width
          width = parseInt(d3.select(elementId).style('width'), 10) - margin.left - margin.right;

          // resize the chart
          xRange.range([margin.left, width - margin.right]);
          d3.select(chart.node().parentNode)
              .style('height', (y.rangeExtent()[1] + margin.top + margin.bottom) + 'px')
              .style('width', (width + margin.left + margin.right) + 'px');

          chart.selectAll('rect.background')
              .attr('width', width);

          chart.selectAll('rect.percent')
              .attr('width', function(d) { return x(d.percent); });

          // update median ticks
          var median = d3.median(chart.selectAll('.bar').data(),
              function(d) { return d.percent; });

          chart.selectAll('line.median')
              .attr('x1', x(median))
              .attr('x2', x(median));


          // update axes
          chart.select('.x.axis.top').call(xAxis.orient('top'));
          chart.select('.x.axis.bottom').call(xAxis.orient('bottom'));
      }
    }
  }
})();