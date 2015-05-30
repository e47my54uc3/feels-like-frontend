/** @jsx React.DOM */

$(document).ready(function() {
  $('body').on('click','#compare',function(event){
    var c1 = $('input[name="c1"]').val();
    var c2 = $('input[name="c2"]').val();
    event.preventDefault();
    $.get('/'+c1+'/'+c2).done(function(data){
      console.log(data)
    });
  })
});
