$(function(){
  var slides = ["#tech-stack","#dynamics","#successes","#hurdles","#next-steps"]
  $.each(slides, function(i,v){ return $(v).hide(); })
  var counter = 0;
  $('#presentation').on('click', function(event){
    var cur = $(slides[counter]);
    $.each(slides, function(i,v){ return $(v).hide(); });
    cur.show();
    console.log(counter)
    console.log(cur)
    counter++
  });
});
  