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

$(".searchTool").addEventListener('input', e => {
    if(!e.target.value){
        $(".searchResults").innerHTML = "";
        return
    }
    
    fetch(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=b8Fgeo1OoLGTenInNXa6O4VXJR8gNdZt&q=${e.target.value}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        $(".searchResults").innerHTML = "";
        for(let i = 0; i < data.length; i++){
            let li = document.createElement('li');
            li.classList.add('resultItem');
            li.innerText = `${data[i].LocalizedName}, ${data[i].Country.LocalizedName}`;
            $(".searchResults").appendChild(li);
        }
    })
})

$(".searchTool").addEventListener('input', e => {
    if(!e.target.value){
        $(".searchResults").innerHTML = "";
        return
    }
    
    fetch(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=b8Fgeo1OoLGTenInNXa6O4VXJR8gNdZt&q=${e.target.value}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        $(".searchResults").innerHTML = "";
        for(let i = 0; i < data.length; i++){
            let li = document.createElement('li');
            li.classList.add('resultItem');
            li.innerText = `${data[i].LocalizedName}, ${data[i].Country.LocalizedName}`;
            $(".searchResults").appendChild(li);
        }
    })
})

