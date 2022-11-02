const $ = (input) => {
    return document.querySelector(input);
}
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=1b34bbea396b3a187b04eeb242b957e9&units=metric`)
                .then(res => res.json())
                .then(data => {

                    const land = { DK: 'Danmark', NO: 'Norge', SE: 'Sverige' }
                    console.log(data)
                    const { temp, temp_max, temp_min } = data.main
                    const { country } = data.sys
                    const { description, main } = data.weather[0]

                    const weatherCondition = 'assets/' + String(main).toLowerCase() + '.json';

                    $('.currentLocation').innerHTML = data.name + ', ' + land[`${country}`];

                    $(".currentTemp").innerHTML = Math.round(temp) + "°C";
                    $(".currentMaxTemp").innerHTML = Math.round(temp_max) + "°C";
                    $(".currentMinTemp").innerHTML = Math.round(temp_min) + "°C";
                })
        })
    }
})