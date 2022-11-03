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
                    const { humidity, temp, temp_max, temp_min } = data.main
                    const { deg, speed } = data.wind
                    const { country } = data.sys
                    const { description, main } = data.weather[0]

                    const weatherCondition = 'assets/' + String(main).toLowerCase() + '.json';

                    $('.currentLocation').innerHTML = data.name + ', ' + land[`${country}`];

                    $(".currentTemp").innerHTML = Math.round(temp) + "°C";
                    $(".currentMaxTemp").innerHTML = Math.round(temp_max) + "°C";
                    $(".currentMinTemp").innerHTML = Math.round(temp_min) + "°C";

                    // Wind data
                    $('.VindValue').innerHTML = Math.round(speed) + " m/s"
                    $(':root').style.setProperty('--wind-deg', `${deg}deg`)
                    $('.windDescription').innerHTML = deg + ' °';

                    //Luftfugtighed
                    $('.fugtValue').innerHTML = humidity + ' g/m³';
                })

            fetch(`api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=e8c02fa7ada103d246d7af923fe66aa9`)
                .then(res => res.json())
                .then(data => {
                    console.log(data)

                })
        })
    }
})