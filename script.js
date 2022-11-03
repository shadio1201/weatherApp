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
                    changeWeatherData(data)
                })

        })
    }
})

const debounceRequest = (cb, delay = 300) => {
    let timeout
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}


const updateSearch = debounceRequest((text) => {
    if (!text) {
        $('.searchResults').style.transform = "scaleY(0)";
        $(".searchResults").innerHTML = "";
        $(".searchResults").style.opacity = "0";
        return
    }
    fetch(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=cXgSSt7gILstdry1Az2yBRg2JHG8ryEN&q=${text}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            $(".searchResults").style.opacity = "1";
            $(".searchResults").innerHTML = "";
            $('.searchResults').style.transform = "scaleY(1)";
            for (let i = 0; i < data.length; i++) {
                let li = document.createElement('li');
                li.classList.add('resultItem');
                li.dataset.by = `${data[i].LocalizedName}`;
                li.innerText = `${data[i].LocalizedName}, ${data[i].Country.LocalizedName}`;

                // Eventlistener
                li.addEventListener('click', e => {
                    $(".searchResults").innerHTML = "";
                    $(".searchResults").style.opacity = "0";
                    fetchNewCity(e.target.dataset.by)
                    $('.searchTool').value = "";
                })

                //Add to list
                $(".searchResults").appendChild(li);
            }
        })
})

$(".searchTool").addEventListener('input', e => {
    updateSearch(e.target.value);
})

const fetchNewCity = (city) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=1b34bbea396b3a187b04eeb242b957e9`)
        .then(res => res.json())
        .then(data => {
            console.log('Booty')

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=1b34bbea396b3a187b04eeb242b957e9&units=metric`)
                .then(res => res.json())
                .then(data => {
                    changeWeatherData(data)
                })

        })
}

const changeWeatherData = (data) => {
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
}


$('.searchTool').addEventListener("focusout", () => {
    $('.searchTool').value = "";
    $(".searchResults").innerHTML = "";
});

