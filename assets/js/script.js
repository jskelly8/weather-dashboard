// Function in order to only run once document is fully loaded and ready
$(document).ready(function () {
    const apiKey = 'b210e8d2620a54419160839100e5eec9'; 

    // Click Event Listener on Search Button
    $('#search-button').on('click', function () {

        // Get city name from entered form input (trimming white space)
        const cityName = $('.form-control').val().trim();

        // If city name isn't empty, *then* fetch the data
        if (cityName !== '') {
            fetchWeather(cityName);
        }
    });

    // Click Event Listener on saved Search History city
    $('#city-history').on('click', 'li', function () {
        const cityName = $(this).text(); // Pulls the city name text
        fetchWeather(cityName);
    });

    // Function to get city's weather data

    // Function to save city name to local storage
    function saveToLocalStorage(cityName) {

        // Retrieve city history from local storage, if there
        let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
        
        // If city name not already in local storage, add entered & update history list
        if (!cityHistory.includes(cityName)) {
            cityHistory.push(cityName);
            localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
            loadCityHistory();
        }
    }

    // Function to load & display city history list
    function loadCityHistory() {

        let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
        
        // Update history list, if needed
        $('#city-history').html(cityHistory.map(city => `<li>${city}</li>`).join(''));
    }

    // Load Event Listener to load & display city history list, if available
    $(window).on('load', function () {
        loadCityHistory();
    });
});