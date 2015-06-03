$(document).ready(function(){

  $('.call-graph-button').on('click', '.solid-orange-2', function(){
    console.log('test');
    d3.selectAll("svg > *").remove()
    // console.log($('#actual_graph').parent());
    debugger
    lineCharts.singleCity(cities.retrieve('to'),'#actual_graph', actualCity);
  });


  $('.call-graph-button').on('click', '.solid-darkgreen', function(){
    console.log('test');
    d3.selectAll("svg > *").remove()
    lineCharts.singleCity(cities.retrieve('to'),'#feels_like_graph', feelsLikeCity);
  });

  $('.call-graph-button').on('click', '.solid-blue', function(){
    d3.selectAll("svg > *").remove()
    //insert calls for the daylight
  });

  $('.call-graph-button').on('click', '.solid-red', function(){
    d3.selectAll("svg > *").remove()
    console.log('red');
    //insert calls for the daylight
  });
  

})
