//Local date
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
    $("#location").html(city + "," + country);

    // Dark Sky API
    const DARK_SKY_KEY = "21f663e2e8b722d4e23b5749bcbcd4e4";
    var darkSkyUrl = `https://api.darksky.net/forecast/${DARK_SKY_KEY}/`;
    var weatherApi = darkSkyUrl + longlat + "?exclude=minutely,hourly,daily";
    console.log(weatherApi);

    // Get an input value and fetch data for it
    $('#search-city-btn').click(function(e) {
      e.preventDefault();

      city = $('#search-city').val();
      const API_KEY = "a2ad63e0576647360495140bd811409e";
      var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

      $.getJSON(url, function(data) {
        var rawJson = JSON.stringify(data);
        var json = JSON.parse(rawJson);
        country = json.sys.country;
        let lon = json.coord.lon;
        let lat = json.coord.lat;

        longlat = `${lat},${lon}`;
        weatherApi = darkSkyUrl + longlat + "?exclude=minutely,hourly,daily";

        let capitalizedCity = capitalize(city);
        city = capitalizedCity;
        $("#location").html(city + "," + country);

        getWeather(weatherApi);

        function capitalize(name) {
          return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }
      });
    });

    // Pass API url to getWeather
    getWeather(weatherApi);
  }
});


//Using the API Weather Url and storing it as a function
function getWeather(weatherApi) {
  $.ajax({
    type: "GET",
    url: weatherApi,
    dataType: "jsonp",
    success: displayWeather
  });

  function displayWeather(data) {
    var icon = data.currently.icon;
    var skycons = new Skycons({
      "color": "white"
    });

    // you can add a canvas by the canvas DOM element itself.
    skycons.add(document.getElementById("animated-icon"), icon);
    // start animation!
    skycons.play();

    //Updating the weather parameters
    var temp = Math.round(data.currently.temperature);
    var tempC = Math.round((temp - 32) * 5 / 9);
    $("#temperature").text(temp + "°");
    $(function() {
      $('#convert').change(function() {
        if ($(this).prop('checked')) {
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
