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
  title: 'Feels Like for '
}

var actualCity = {
  params: ['avg_temp','high_temp','low_temp'],
  colors: ['black','red','blue'],
  names: ['Average','High','Low'],
  title: 'Actual Temps for '
}

// DAYNIGHT ARGS HASH
var dayNight = {
  params: ['sunrise','sunset'],
  colors: ['yellow','purple'],
  names: ['Sunrise', 'Sunset'],
  title: "Sunrise and Sunset times for "
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
    // lineCharts.singleCity(from,'#target',actualCity)

    // Shows the comparison between two cities for any of the params listed above
    // lineCharts.compareCities(from,to,'#target','avg_temp')

    // Shows the time of Sunrise and Sunset for a single city
    // lineCharts.dayNight(from, '#target', dayNight)
  });
})