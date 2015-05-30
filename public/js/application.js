/** @jsx React.DOM */

$(document).ready(function() {
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them

  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()

  // $('#feel-form').on('submit', function(e){
  //   e.preventDefault();

  //   $.ajax({
  //     type: "GET",
  //     data: e
  //   })
  // })
  // var form= $('#feel-form').serialize();
  // debugger

  var Fuckit = React.createClass({
      render: function(){
        return (
          <div>
            <form>
              <input type="text" name="city1" placeholder="Enter a reference city"></input>
              <input type="text" name="city1" placeholder="Enter a destination"></input>
              <input type="submit" value="Compare"></input>
            </form>
          </div>
        )
      }
    })
    
    React.render(
      <Fuckit />,
      document.getElementById('fucking-react')
    )

});
