console.log('connected');

var cityButton;
var cityVal;
var cityInput = $('#search-city');
var searchForm = $('#search-form');
var city;

searchForm.on('submit', function(){
    event.preventDefault();
    cityVal = cityInput.val();
    $.trim(cityVal);
    cityVal = cityVal.toLowerCase();
    console.log(cityVal);

    if (cityVal === ""){
        return;//do nothing if empty
    };

    // ajax call
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityVal + "&appid=249cf9c2f4417e3498f1e0b995288085";

    $.ajax({
        url: queryURL,
        method: "GET"
        })
    
        .then(function(response){
            var results = response;
            console.log(results);
        })

    // add button to list
    cityButton = $('<div class="results" data-city=' + '"' + cityVal + '">');
    cityButton.text(cityVal);
    $('.results-list').append(cityButton);

    cityInput.val('');

});

// button event listener with ajax call
$(document.body).on('click', '.results', function(){
    console.log('clicked');
    city = $(this).attr("data-city");
    console.log(city);
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        city + "&appid=249cf9c2f4417e3498f1e0b995288085";
    
    $.ajax({
    url: queryURL,
    method: "GET"
    })

    .then(function(response){
        var results = response; 
        console.log(results);
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
