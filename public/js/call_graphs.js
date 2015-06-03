$(document).ready(function(){
  $("img").on('click', function() {
    d3.selectAll("svg > *").remove()
    // debugger
  });

  
  // FEELS LIKE TEMP GRAPH
  $('.call-graph-button').on('click', '.solid-darkgreen', function(){
    console.log('test');
    d3.selectAll("svg > *").remove()
    lineCharts.singleCity(cities.retrieve('to'),'#feels_like_graph', feelsLikeCity);
  });

  chartArray = feelsLikeCity['params'];
  var feelsLikeIndex = 1;

  $('#panel1').on('click', '.transition-button-forward', function() {
    d3.selectAll("svg > *").remove();
    lineCharts.compareCities(cities.retrieve('from'), cities.retrieve('to'), '#feels_like_graph', feelsLikeCity['params'][feelsLikeIndex]);
    feelsLikeIndex = (feelsLikeIndex + 1) % (chartArray.length);
    ;
  })

  $('#panel1').on('click', '.transition-button-backward', function() {
    d3.selectAll("svg > *").remove();
    lineCharts.compareCities(cities.retrieve('from'), cities.retrieve('to'), '#feels_like_graph', feelsLikeCity['params'][feelsLikeIndex]);
    feelsLikeIndex = (chartArray.length + feelsLikeIndex - 1) % (chartArray.length);
    ;
  })



  // ACTUAL TEMP GRAPH
  $('.call-graph-button').on('click', '.solid-orange-2', function(){
    console.log('test');
    // d3.select('svg').remove()
    // debugger
    // console.log($('#actual_graph').parent());
    lineCharts.singleCity(cities.retrieve('to'),'#actual_graph', actualCity);
  });

  $('#panel2').on('click', '.transition-button-forward', function() {
    d3.selectAll("svg > *").remove()
    lineCharts.singleCity(cities.retrieve('from'),'#actual_graph', actualCity);
  })

  
  // RAIN SNOW GRAPH
  $('.call-graph-button').on('click', '.solid-red', function(){
    d3.selectAll("svg > *").remove()
    console.log('red');
    //insert calls for the daylight
  });

  $('#panel3').on('click', '.transition-button-forward', function() {
    d3.selectAll("svg > *").remove()
    lineCharts.singleCity(cities.retrieve('from'),'#rain_snow_graph', rainSnowCity);
  })
 


  // DAYLIGHT GRAPH
  $('.call-graph-button').on('click', '.solid-blue', function(){
    d3.selectAll("svg > *").remove()
    //insert calls for the daylight
  });

  $('#panel4').on('click', '.transition-button-forward', function() {
    d3.selectAll("svg > *").remove()
    lineCharts.singleCity(cities.retrieve('from'),'#sunlight_graph', SunlightCity);
  })
  
})

