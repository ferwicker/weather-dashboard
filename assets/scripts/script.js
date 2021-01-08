console.log('connected');

var cityButton;
var cityVal;
var cityInput = $('#search-city');
var searchForm = $('#search-form');
var city;
var apiKey = '249cf9c2f4417e3498f1e0b995288085';

var dateToday = moment().format('DD/MM/YY');

// CLEAR LIST BUTTON

var clearButton = $('.clear-button');

clearButton.on('click', function(){
    $('.results-list').html('');
})

//SEARCH FORM

searchForm.on('submit', function(){
    event.preventDefault();
    cityVal = cityInput.val();
    $.trim(cityVal);
    city = cityVal.toLowerCase();

    if (city === ""){
        return;//do nothing if empty
    };

    // ajax call
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
    city + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
        })
    
        .then(function(response){
            var results = response;
            console.log(results);

            // render city and date in h1
            $('#current-city').text(city);
            $('#current-date').text('(' + dateToday + ')');

            // get coordinates
            var lat = results.coord.lat;
            var lon = results.coord.lon;

            //get 5 day forecast

            var onecallQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +"&exclude=minutely,hourly,alerts&appid=" + apiKey;
            $.ajax({
                url: onecallQueryURL,
                method: "GET"
                })

                .then(function(response){
                    console.log(response)

                    //UPDATE!
                    // get current temperature
                    var currentTemp = (response.current.temp - 273.15).toFixed(2);
                    $('#current-temp').text(currentTemp + ' °C');
                    // get current humidity
                    var currentHumid = response.current.humidity;
                    $('#current-humidity').text(currentHumid + '%');
                    // get current wind
                    var currentWind = response.current.wind_speed;
                    $('#current-wind').text(currentWind + ' mph');
                    // get current UV
                    var currentUV = response.current.uvi;
                    //console.log(currentUV);
                        // print UV index
                        $('#current-UV').text(currentUV);
                        // set colour according to value
                        $('#current-UV').removeClass();

                        if (currentUV > 0 && currentUV < 3) {
                            $('#current-UV').addClass('green'); 
                        } 
                        if (currentUV > 3 && currentUV < 6){
                            $('#current-UV').addClass('yellow');
                        }
                        if (currentUV > 6 && currentUV < 8){
                            $('#current-UV').addClass('orange');
                        }
                        if (currentUV > 8 && currentUV < 11){
                            $('#current-UV').addClass('red');
                        }
                        if (currentUV > 11){
                            $('#current-UV').addClass('violet');
                        }
                })

        })

    // add button to list
    cityButton = $('<div class="results" data-city=' + '"' + city + '">');
    cityButton.text(city);
    $('.results-list').append(cityButton);

    cityInput.val('');

});

// button event listener with ajax call
$(document.body).on('click', '.results', function(){
    console.log('clicked');
    city = $(this).attr("data-city");
    console.log(city);
    // ajax call
    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    
    $.ajax({
    url: queryURL,
    method: "GET"
    })

    .then(function(response){
        var results = response; 
        console.log(results);
            // render city and date in h1
            $('#current-city').text(city);
            $('#current-date').text('(' + dateToday + ')');
    })
})


/* NOTES 
    when form search is submitted
    get value

    add button to list with value - done

    do ajax call using value

    Do buttons need to be saved to local storage

    need to get variables for all the values needed?

    how to consolidate functions?

*/
