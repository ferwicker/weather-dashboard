console.log('connected');

var cityButton;
var cityVal;
var cityInput = $('#search-city');
var searchForm = $('#search-form');
var city;
var apiKey = '249cf9c2f4417e3498f1e0b995288085';

var dateToday = moment().format('DD/MM/YY');

// RETRIEVE & RENDER SAVED CITY LIST

var cityList = [];

function renderCityList(){
    for(i = 0; i < cityList.length; i++){
        cityButton = $('<div class="row results d-flex justify-content-between align-items-center" data-city=' + '"' + cityList[i] + '">');
        cityButton.text(cityList[i]);
        $('.results-list').append(cityButton);
        var trashButton = $('<i class="far fa-trash-alt fa-xs" data-city=' + '"' + cityList[i] + '">');
        cityButton.append(trashButton);
    };
};

cityList = JSON.parse(localStorage.getItem('city list'));
//if there are to do items saved then append list item for each
if(cityList){
    renderCityList();
    //retrieve last city seen
    city = localStorage.getItem('last seen');
    // get weather for last city seen
    getWeather();

} else {
    cityList = [];
};

// SAVE LAST CITY VIEWED

function lastSeen (city){
    localStorage.setItem('last seen', city);
}

// ADD BUTTON AND SAVE ARRAY

function addButton (){
    //check if city already in array
    var checkarray = jQuery.inArray(city, cityList);

    if (checkarray > -1) {
        return; //don't add button or save to array if already exists
    };
    
    // add button to list
    cityButton = $('<div class="row results d-flex justify-content-between align-items-center" data-city=' + '"' + city + '">');
    cityButton.text(city);
    $('.results-list').append(cityButton);
    var trashButton = $('<i class="far fa-trash-alt fa-xs" data-city=' + '"' + city + '">');
    cityButton.append(trashButton);

    // save city to local storage
    cityList.push(city);
    localStorage.setItem('city list', JSON.stringify(cityList));
};

// MAIN FUNCTION

function getWeather(){

    // ajax call
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
    city + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
        })
    
        .then(function(response){

            lastSeen (city);
            addButton(city);

            var results = response;
            //console.log(results);

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
                    //console.log(response)

                    // CURRENT
                    // get current temperature
                    var currentTemp = (response.current.temp - 273.15).toFixed(2);
                    $('#current-temp').text(currentTemp + ' °C');
                    // get current humidity
                    var currentHumid = response.current.humidity;
                    $('#current-humidity').text(currentHumid + '%');
                    // get current wind
                    var currentWind = response.current.wind_speed;
                    $('#current-wind').text(currentWind + ' mph');
                    // get current icon
                    var currentIconEl = $('#current-icon');
                    currentIconEl.removeClass('fa-sun'); // bug here
                    var currentIconID = response.current.weather[0].icon;
                    var currentIconClass = icons[currentIconID];
                    currentIconEl.addClass(currentIconClass);
                    // get current UV
                    var currentUV = response.current.uvi;
                    //console.log(currentUV);
                        // print UV index
                        $('#current-UV').text(currentUV);
                        // set colour according to value
                        $('#current-UV').removeClass();

                        if (currentUV => 0 && currentUV < 3) {
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

                        // FORECAST
                        // empty forecast of previous results
                        $('#forecast-row').html('');
                        // render new results
                        for(i = 1; i < 6; i++){
                            // create and append blocks
                            var forecastEl = $('<div class="col-sm future-forecast-block">');
                            $('#forecast-row').append(forecastEl);
                            // create date paragraph
                            var dateEl = $('<p class="forecast-date">');
                            dateEl.text(moment().add(i, 'days').format('DD/MM/YY'));
                            forecastEl.append(dateEl);
                            // weather icon  
                            var iconEl = $('<i class="fas fa-3x forecast-icon">');
                            forecastEl.append(iconEl);

                            // get current icon
                            var forecastIconID = response.daily[i].weather[0].icon;
                            //console.log(forecastIconID);
                            var forecastIconClass = icons[forecastIconID];
                            iconEl.addClass(forecastIconClass);

                            // create and append temperature
                            var tempEl = $('<p class="forecast-stat">');
                            var tempVal = (response.daily[i].temp.day - 273.15).toFixed(2);
                            tempEl.text('Temp: ' + tempVal + ' °C');
                            forecastEl.append(tempEl);
                            // create and append humidity
                            var humidityEl = $('<p class="forecast-stat">');
                            var humidityVal = response.daily[i].humidity;
                            humidityEl.text('Humidity: ' + humidityVal + '%');
                            forecastEl.append(humidityEl);
                        }
                        
                })

                //addButton(city);
        })
    
}

// CLEAR LIST BUTTON

var clearButton = $('.clear-button');

clearButton.on('click', function(){
    $('.results-list').html('');
    localStorage.removeItem('city list');
    cityList = [];
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

    getWeather();

    //clear input value
    cityInput.val('');

});

// city button event listeners
$(document.body).on('click', '.results', function(){
   
    city = $(this).attr("data-city");

    //target trash button
    var target = $( event.target );
    if (target.is('i')) {
        city = $(this).attr("data-city");
        cityList = $.grep(cityList, function(value){
            return value !== city;
        });
        localStorage.setItem('city list', JSON.stringify(cityList));
        $('.results-list').html('');
        renderCityList();
        return;
    };
    getWeather();
})