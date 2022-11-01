const $ = (input) => {
    return document.querySelector(input);
}
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=1b34bbea396b3a187b04eeb242b957e9`)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    const { temp } = data.main

                    $(".currentTemp").innerHTML = temp + "°C";
                })
        })
    }
})

