const accuweather_api_key = 'hTAV4tLYiRhBSRVdBrjvrnqj38DwvZ8r'

const $ = (input) => {
    return document.querySelector(input);
}

const tid = () => {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    $('.clock').innerText = h + ":" + m;
    setTimeout(tid, 1000);
}

function checkTime(i) {
    if (i < 10) { i = "0" + i };  // Tilføjer Nul foran nummer mindre end 10
    return i;
}


// Lottiefile
const lottie = $('.lottieWeather');

function setIcon(iconName) {
    let weatherAni = bodymovin.loadAnimation({
        wrapper: lottie,
        animType: 'svg',
        loop: true,
        autoplay: true,
        path: `assets/${iconName}.json`
    });
    weatherAni.setSpeed(0.5);
    weatherAni.play();
}
let firstData;

window.addEventListener('load', () => {
    tid();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=1b34bbea396b3a187b04eeb242b957e9&units=metric`)
                .then(res => res.json())
                .then(data => {
                    let cityName = data.city.name;
                    let country = data.city.country;
                    changeWeatherData(data, cityName, country)
                })
            fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${accuweather_api_key}&q=${lat}%2C${long}`)
                .then(res => res.json())
                .then(data => {
                    fetchNewCity(data.LocalizedName, data.Key)
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
    fetch(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${accuweather_api_key}&q=${text}`)
        .then(res => res.json())
        .then(data => {
            $(".searchResults").style.opacity = "1";
            $(".searchResults").innerHTML = "";
            $('.searchResults').style.transform = "scaleY(1)";
            for (let i = 0; i < data.length; i++) {
                let li = document.createElement('li');
                li.classList.add('resultItem');
                li.dataset.by = `${data[i].LocalizedName}`;
                li.dataset.location = `${data[i].Key}`;
                li.innerText = `${data[i].LocalizedName}, ${data[i].Country.LocalizedName}`;
                // Eventlistener
                li.addEventListener('click', (e) => {
                    $(".searchResults").innerHTML = "";
                    $(".searchResults").style.opacity = "0";
                    fetchNewCity(e.target.dataset.by, e.target.dataset.location)
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

const fetchNewCity = (city, locationKey) => {

    fetch(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${accuweather_api_key}&metric=true`)
        .then(res => res.json())
        .then(forecast => {
            $('.timeKortBeholder').innerHTML = "";
            for (let i = 0; i < forecast.length; i++) {
                let span = document.createElement('span');
                let firstP = document.createElement('p');
                let secondP = document.createElement('p');
                let img = document.createElement('img');


                span.classList.add('timeKort');
                firstP.classList.add('timeKortTitel');
                secondP.classList.add('timeKortTid');
                img.classList.add('timeKortIkon');

                img.src = `assets/png/${forecast[i].IconPhrase.split(' ').join('').replace(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, '')}.png`

                firstP.innerText = forecast[i].Temperature.Value + '°C';
                secondP.innerText = forecast[i].DateTime.split('').splice(11, 5).join('')

                span.append(firstP, img, secondP);

                $('.timeKortBeholder').appendChild(span);
            }
        })

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=1b34bbea396b3a187b04eeb242b957e9`)
        .then(res => res.json())
        .then(data => {
            let placeName = data[0].name;
            let country = data[0].country;
            let lat = data[0].lat;
            let long = data[0].lon;
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=1b34bbea396b3a187b04eeb242b957e9&units=metric`)
                .then(res => res.json())
                .then(data => {
                    changeWeatherData(data, placeName, country)
                })

        })
}

const changeWeatherData = (weather, place, country) => {
    let data = weather.list[0];
    console.log(data)
    $('.lottieWeather').innerHTML = "";
    let currentIcon = data.weather[0].main.split(' ').join('').toLowerCase();
    setIcon(currentIcon);

    const land = { DK: 'Danmark', NO: 'Norge', SE: 'Sverige', ES: 'Spanien' }
    const { feels_like, humidity, temp, temp_max, temp_min } = data.main
    const { deg, speed } = data.wind
    const { description, main } = data.weather[0]

    const weatherCondition = 'assets/' + String(main).toLowerCase() + '.json';

    $('.currentLocation').innerHTML = place + ', ' + land[`${country}`];

    $(".currentTemp").innerHTML = Math.round(temp) + "°C";
    $(".currentMaxTemp").innerHTML = Math.round(temp_max) + "°C";
    $(".currentMinTemp").innerHTML = Math.round(temp_min) + "°C";

    // Wind data
    $('.VindValue').innerHTML = Math.round(speed) + " m/s"
    $(':root').style.setProperty('--wind-deg', `${deg}deg`)
    $('.windDescription').innerHTML = deg + ' °';

    $('.feelsValue').innerHTML = Math.floor(feels_like) + "°C";

    //Luftfugtighed
    $('.fugtValue').innerHTML = humidity + ' g/m³';

    //regn
    $('.regnChance').innerHTML = Math.round(data.pop * 100) + '%'
}

let listValues;

$('.searchTool').addEventListener("focusout", (e) => {
    listValues = $(".searchResults").innerHTML;
    setTimeout(() => {
        $(".searchResults").innerHTML = "";
    }, 200)
});

$('.searchTool').addEventListener("focus", () => {
    $(".searchResults").innerHTML = listValues;
});

