$(document).ready(function(){
  $("img").on('click', function() {
    d3.selectAll("svg > *").remove()
    // debugger
  });

  
  // FEELS LIKE TEMP GRAPH
  $('.call-graph-button').on('click', '.solid-darkgreen', function(){
    d3.selectAll("svg > *").remove()
    lineCharts.singleCity(cities.retrieve('to'),'#feels_like_graph', feelsLikeCity);
  });

  feelsLikeArray = feelsLikeCity['params'];
  var feelsLikeIndex = 1;

  $('#panel1').on('click', '.transition-button-forward', function() {
    d3.selectAll("svg > *").remove();
    lineCharts.compareCities(cities.retrieve('from'), cities.retrieve('to'), '#feels_like_graph', feelsLikeCity['params'][feelsLikeIndex]);
    feelsLikeIndex = (feelsLikeIndex + 1) % (feelsLikeArray.length);
    ;
  })

  $('#panel1').on('click', '.transition-button-backward', function() {
    d3.selectAll("svg > *").remove();
    lineCharts.compareCities(cities.retrieve('from'), cities.retrieve('to'), '#feels_like_graph', feelsLikeCity['params'][feelsLikeIndex]);
    feelsLikeIndex = (feelsLikeArray.length + feelsLikeIndex - 1) % (feelsLikeArray.length);
    ;
  })



  // ACTUAL TEMP GRAPH
  $('.call-graph-button').on('click', '.solid-orange-2', function(){
    console.log('test');
    lineCharts.singleCity(cities.retrieve('to'),'#actual_graph', actualCity);
  });

  actualArray = actualCity['params'];
  var actualIndex = 1;

  $('#panel2').on('click', '.transition-button-forward', function() {
    d3.selectAll("svg > *").remove();
    lineCharts.compareCities(cities.retrieve('from'), cities.retrieve('to'), '#actual_graph', actualCity['params'][actualIndex]);
    actualIndex = (actualIndex + 1) % (actualArray.length);
  });

  $('#panel2').on('click', '.transition-button-backward', function() {
    d3.selectAll("svg > *").remove();
    lineCharts.compareCities(cities.retrieve('from'), cities.retrieve('to'), '#actual_graph', actualCity['params'][actualIndex]);
    actualIndex = (actualArray.length + actualIndex - 1) % (actualArray.length);
  });

  
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
    lineCharts.dayNight(cities.retrieve('to'), '#daylight_graph', dayNight)
  });

  $('#panel4').on('click', '.transition-button-forward', function() {
    d3.selectAll("svg > *").remove()
    lineCharts.dayNight(cities.retrieve('from'),'#daylight_graph', dayNight);
  });

  $('#panel4').on('click', '.transition-button-backward', function() {
    d3.selectAll("svg > *").remove()
    lineCharts.dayNight(cities.retrieve('to'),'#daylight_graph', dayNight);
  })
  
})