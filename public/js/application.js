// TWO CITY PARAMS THAT WORK
// 'avg_apparent_day_temp'
// 'avg_apparent_night_temp'
// 'high_apparent_temp'
// 'low_apparent_temp'
// 'avg_temp'
// 'high_temp'
// 'low_temp'
// 'avg_dewpt'
// 'avg_wind_dir'
// 'avg_wind_spd'
// 'cloud_cover'
// 'humidity'


// SINGLE CITY ARGS HASHES THAT WORK
var feelsLikeCity = {
  params: ['avg_apparent_day_temp','avg_apparent_night_temp','high_apparent_temp','low_apparent_temp'],
  colors: ['yellow','grey','red','blue'],
  names: ['Daytime','Nighttime','High','Low'],
}

var actualCity = {
  params: ['avg_temp','high_temp','low_temp'],
  colors: ['black','red','blue'],
  names: ['Average','High','Low'],
}

// DAYNIGHT ARGS HASH
var dayNight = {
  params: ['sunrise','sunset'],
  colors: ['yellow','black'],
  names: ['Sunrise', 'Sunset'],
}

// TODO TOOLTIP UPGRADE
// TODO LEGEND
// Stretch is precipitation block chart

$(function(){
  cities.setEventListeners();
  $('#go').on('click',function(){
    var from = cities.retrieve('from');
    var to = cities.retrieve('to');

    // Shows the set piece single city charts
    // lineCharts.singleCity(from,'#target',argsHash)

    // Shows the comparison between two cities for any of the params listed above
    // lineCharts.compareCities(from,to,'#target',param)

    // Shows the time of Sunrise and Sunset for a single city
    // lineCharts.dayNight(from, '#target', dayNight)

  });
})