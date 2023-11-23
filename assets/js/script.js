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
    function fetchWeather(cityName) {
        // Fetch latitude and longitude using Direct Geocoding API
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}&units=imperial`)
            .then(response => response.json())
            .then(geoData => {

                // If able, extract lat & lon data
                if (geoData.length > 0) {
                    const { lat, lon } = geoData[0];

                    // Fetch current weather data using Current Weather Data API
                    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
                        .then(response => response.json())
                        .then(data => {
                            // Display data
                            displayCurrentWeather(data);

                            // Fetch 5-day forecast using 5 Day / 3 Hour Forecast API
                            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
                        })
                        .then(response => response.json())
                        .then(data => {
                            // Display data
                            displayForecast(data);

                            // Save city name to local storage
                            saveToLocalStorage(cityName);
                        })
                        .catch(error => {
                            console.error('Error fetching weather data:', error);
                        });
                } 
            });
    }

    // Function to display current weather data on the page
    function displayCurrentWeather(data) {
        $('#chosen-city').html(`
            <h2>${data.name}</h2>
            <p>Date: ${dayjs().format('DD/MM/YYYY')}</p>
            <p>Temperature: ${data.main.temp} °F</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `);
    }

    // Function to display the 5-day forecast data on the page
    function displayForecast(data) {

        // Clear existing forecast content
        $('#city-forecast').empty();

        // Iterate over forecast data & display only desired info
        for (let i = 0; i < data.list.length; i += 8) {
            const forecast = data.list[i];
            const date = new Date(forecast.dt_txt);
            $('#city-forecast').append(`
                <div class="forecast-item">
                    <p>Date: ${dayjs(date).format('DD/MM/YYYY')}</p>
                    <p>Temperature: ${forecast.main.temp} °F</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                    <p>Wind Speed: ${forecast.wind.speed} m/s</p>
                </div>
            `);
        }
    }

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