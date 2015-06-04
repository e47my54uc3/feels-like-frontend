$(function(){
$('.call-graph-button').on('click', '.solid-red', function(){
  var city_object = function(fromto){
            var retrievedObject = localStorage.getItem(fromto);
            return JSON.parse(retrievedObject);
        };

  var from_name = city_object("from").city.name.replace("_"," ");
  var to_name = city_object("to").city.name.replace("_"," ");


  

  if ($('.instructions').find('p').length){
    $('.instructions').find('p').replaceWith("<p style='display: inline-block'>Select a month to compare the weather of " + to_name + " to " + from_name + "</p>");
  } else {
    $(".instructions").prepend("<p style='display: inline-block'>Select a month to compare the weather of " + to_name + " to " + from_name + "</p>");
  }


  // var from = cities.retrieve('from');
  // var to = cities.retrieve('to');
  // attributes = [thing,thing,thing,thing,thing]
  // compareThing.go(target,from,to,attribute)
  $(".compare_month_form").on('submit', function(event){
    event.preventDefault();

    var selected_month = $(".compare_month_form option:selected").val();

    var city_object = function(fromto){
            var retrievedObject = localStorage.getItem(fromto);
            return JSON.parse(retrievedObject);
        };

    var avg_temps = function(city_object){

        var month_prop_totals = [0,0,0,0,0,0,0,0,0,0,0,0];
        var month_days_count = [0,0,0,0,0,0,0,0,0,0,0,0];
        var month_prop_avgs =  [0,0,0,0,0,0,0,0,0,0,0,0];


        var month_array = city_object.data;

        for(var i = 0; i < month_array.length; i++){
          month_prop_totals[month_array[i]["month"] - 1] += month_array[i]["avg_apparent_day_temp"];
          month_days_count[month_array[i]["month"] - 1] += 1;
        };

        for(var i = 0; i < month_prop_totals.length; i++){
          var month = month_prop_totals[i];
          var average = (Math.round(month/month_days_count[i]));
          month_prop_avgs[i] = average;
        };
        return month_prop_avgs;
      };


        var from_name = city_object("from").city.name.replace("_"," ");
        var to_name = city_object("to").city.name.replace("_"," ");

        var from_city_avgs = avg_temps(city_object("from"));
        var to_city_avgs = avg_temps(city_object("to"));
        // console.log("from_city_avgs:", from_city_avgs);
        // console.log("to_city_avgs:", to_city_avgs);


        var comparison = function(from_city_name, from_city_avgs,
                                  to_city_name, to_city_avgs){

          console.log("from_city_name:", from_city_name);
          console.log("from_city_avgs:", from_city_avgs)

          console.log("to_city_name:", to_city_name);
          console.log("to_city_avgs:", to_city_avgs)

          console.log("selected_month:", selected_month);

          var months = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

          var entry_index = months.indexOf(selected_month);

          console.log("entry_index:", entry_index)

          var to_city_temp = to_city_avgs[entry_index]

          console.log("to_city_temp:", to_city_temp)

          var differences_array = []

          for(var i = 0; i < from_city_avgs.length; i++){
            differences_array.push(Math.abs(from_city_avgs[i] - to_city_temp))
          };

          console.log("differences_array:", differences_array)

          smallest_number = Math.min.apply(Math, differences_array)
          console.log("smallest_number:", smallest_number)

          var array_of_indexes = []
          for(var i = 0; i < differences_array.length; i++){
            if(differences_array[i] === smallest_number){
              array_of_indexes.push(i)
            }
          };

          console.log("array_of_indexes:", array_of_indexes)

          var array_of_closest_matching_temps = []
          for(var i = 0; i < array_of_indexes.length; i++){
            array_of_closest_matching_temps.push(from_city_avgs[array_of_indexes[i]])
          }

          console.log("array_of_closest_matching_temps:", array_of_closest_matching_temps)

          var array_of_closest_matching_months = []

          for(var i = 0; i < array_of_indexes.length; i++){
            array_of_closest_matching_months.push(months[array_of_indexes[i]])
          };

          console.log("array_of_closest_matching_months:", array_of_closest_matching_months)

          var english_join = function(array){
            if(array.length <= 1){
              return array.join()
            } else {
              return array.slice(0, array.length - 1).join(', ') + " and " + array.slice(-1);
            }
          };

          var string_of_closest_matching_months = english_join(array_of_closest_matching_months)

          console.log("string_of_closest_matching_months:", string_of_closest_matching_months)


          var city_temps_html = ""

          for(var i = 0; i < array_of_closest_matching_months.length; i++){
            city_temps_html += "<p>" + from_name + ", " + array_of_closest_matching_months[i] + ": " + array_of_closest_matching_temps[i] + "°</p>"
          };

          console.log("city_temps_html:", city_temps_html)







          var biggest_from_city_number = Math.max.apply(Math, from_city_avgs)
          var smallest_from_city_number = Math.min.apply(Math, from_city_avgs)

          console.log("biggest_from_city_number:", biggest_from_city_number)
          console.log("smallest_from_city_number:", smallest_from_city_number)

          var first_month = array_of_closest_matching_months[0]
          var first_temp = array_of_closest_matching_temps[0]

          if(to_city_temp > biggest_from_city_number){
            var difference = to_city_temp - biggest_from_city_number
            var message = selected_month + " in " + to_city_name + " feels " + difference + "° hotter than the hottest month in " + from_city_name + "."
          } else if (to_city_temp < smallest_from_city_number){
            var difference = smallest_from_city_number - to_city_temp
            var message = selected_month + " in " + to_city_name + " feels " + difference + "° colder than the coldest month in " + from_city_name + "."
          } else {
            var message = selected_month + " in " + to_city_name + " feels like " + string_of_closest_matching_months + " in " + from_city_name + "."
          }

          console.log("message:", message)

          $(".comparisons").empty();

          $(".comparisons").append("<br><p>" + message + "</p><u><p>Average Temperatures:</p></u><p>" + to_city_name + ", " + selected_month + ": " + to_city_temp + "°</p>" + city_temps_html + "<br>")


        };

        comparison(from_name, from_city_avgs, to_name, to_city_avgs)


    });


  });
});