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
                    console.log(data)
                    const { temp } = data.main

                    $(".currentTemp").innerHTML = Math.round(temp) + "°C";
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

