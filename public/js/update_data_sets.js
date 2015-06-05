
var cities = (function(){
    return {
        setEventListeners: function(){
            $('#city-1-data').change(function(){
                var cityVal = $(this).find(":selected").val();
                $.ajax({
                    type: "GET",
                    dataType: "JSON",
                    url: "http://dbc-feels-like.herokuapp.com/city/" + cityVal + "/weather"
                }).done(function(data){
                    localStorage.setItem('from', JSON.stringify(data));
                })
            });
            $('#city-2-data').change(function(){
                var cityVal = $(this).find(":selected").val();
                $.ajax({
                    type: "GET",
                    dataType: "JSON",
                    url: "http://dbc-feels-like.herokuapp.com/city/" + cityVal + "/weather"
                }).done(function(data){
                    localStorage.setItem('to', JSON.stringify(data));
                })
            });
        },
        retrieve: function(fromto){
            var retrievedObject = localStorage.getItem(fromto);
            return JSON.parse(retrievedObject);
        }
    }

})()