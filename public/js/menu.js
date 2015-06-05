$(document).ready(function() {
  $('.menu_image').mouseenter(function() {
    var cityHash = cities.retrieve('to').city;
    var name = $(this).attr('name');
    if (name === 'looks-like'){
      $('#'+name+' img').attr('store', $('#'+name+' img').attr('src'));
      $('#'+name+' img').attr('src', cityHash.looks_like);
    } else {
      $('#'+name+' img').fadeTo('fast',0);
      $(this).children('p').html(cityHash[name.replace('-','_')]);
    }
  });
  $('.menu_image').mouseleave(function() {
    var name = $(this).attr('name');
    if (name === 'looks-like'){
      $('#'+name+' img').attr('src', $('#'+name+' img').attr('store'))
    } else {
      $('#'+name+' img').fadeTo("fast", 1);
      $(this).children('p').html('')
    }
  });
});