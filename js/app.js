var options = {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit"
};
var d = new Date();
$("#cur-date").html(d.toLocaleTimeString('en-US', options));

$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "https://ipinfo.io/json/",
    success: coordinates
  });
  // coordinates callback function
 function coordinates(data) {
   var longlat = data.loc;
   var city = data.city;
   var country = data.country;

//Locate the city
   $("#location").html(city + "," + country) ;

   // Dark Sky API
   var url= "https://api.darksky.net/forecast/c1c79c93374cb0e0b5e2439d84fd12f5/";
   var WeatherAPI = url + longlat + "?exclude=minutely,hourly,daily";
   console.log(WeatherAPI);

   // Pass API url to getWeather
   getWeather(WeatherAPI);
 }
});

function getWeather(WeatherAPI) {
   $.ajax({
     type: "GET",
     url: WeatherAPI,
     dataType: "jsonp",
     success: displayWeather
   });

   function displayWeather(data){
    var icon = data.currently.icon;
    var skycons = new Skycons({"color": "white"});
      // on Android, a nasty hack is needed: {"resizeClear": true}

      // you can add a canvas by the canvas DOM element itself.
      skycons.add(document.getElementById("animated-icon"), icon);
      // start animation!
      skycons.play();
     var temp = Math.round(data.currently.temperature);
     var tempC = Math.round((temp - 32) * 5/9);
     $("#temperature").text(temp + "°");
     $(function() {
        $('#convert').change(function() {
          if ($(this).prop('checked')){
    				$('#temperature').html(tempC + "° C ");
    			} else {
    				$('#temperature').html(temp + "° F");
    			}
        })
      });

     $("#conditions").text(data.currently.summary);
     $("#winds").text("Windspeed: " + data.currently.windSpeed);
     $("#pressure").text("Pressure: " + data.currently.pressure);
     $("#humidity").text("Humidity: " + data.currently.humidity);
     };
   }

 $(".btn-search").click(function(){
 var city_name = document.getElementsByClassName('user-location').value;
 const API_KEY = "a2ad63e0576647360495140bd811409e";
 var url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}`;

             $.getJSON(url, function (data) {
            var rawJson = JSON.stringify(data);
            var json = JSON.parse(rawJson);
        });




 $("#location").html(city + ", " + country) ;

 })
