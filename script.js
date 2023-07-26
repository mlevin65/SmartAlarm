function setAlarm() {
  const alarmTimeInput = document.getElementById("alarm-time");
  const alarmTime = alarmTimeInput.value;

  if (alarmTime === "") {
    alert("Please set the alarm time.");
    return;
  }

  const [alarmHour, alarmMinute] = alarmTime.split(":");
  const now = new Date();
  const alarm = new Date(now);
  alarm.setHours(alarmHour);
  alarm.setMinutes(alarmMinute);
  alarm.setSeconds(0);

  const currentTime = now.getTime();
  const alarmTimeInMillis = alarm.getTime();

  if (currentTime > alarmTimeInMillis) {
    alarm.setDate(alarm.getDate() + 1);
  }

  const timeUntilAlarm = alarmTimeInMillis - currentTime;
  setTimeout(triggerAlarm, timeUntilAlarm);
}

function triggerAlarm() {
  // Play the alarm sound
  const audio = new Audio("rain_alarm.mp3");
  audio.play();

  document.body.style.backgroundColor = "#FFFFFF"; // White background
  document.body.style.color = "#000000"; // Black text

  // You can add additional actions here, such as showing a message, changing the background color, etc.
  // For now, let's show an alert.
  // alert("ALARM! Wake up!");

}

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const clockDisplay = document.querySelector(".clock");
  clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;

  // Calculate the time difference in milliseconds
  const alarmTimeString = localStorage.getItem("alarmTime");
  const alarmTime = new Date(`${now.toDateString()} ${alarmTimeString}`);
  const timeDiff = alarmTime - now;

  // Calculate the percentage of time passed (closer to 0 as alarm time approaches)
  const timePercentage = Math.max(0, timeDiff / (alarmTime - new Date(alarmTime.toDateString())));

  // Calculate the RGB values based on the percentage (linear interpolation from black to white)
  const r = Math.round(255 * timePercentage);
  const g = Math.round(255 * timePercentage);
  const b = Math.round(255 * timePercentage);

  // Set the background color using the calculated RGB values
  document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

  // Check if the alarm time is reached
  if (timeDiff <= 0) {
    triggerAlarm();
  }
}

function getWeatherData() {
  const apiKey = 'caa1c258b1eef023f2eb40d779313d4b';
  const city = 'Rockville, US';
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
      const weatherIcon = data.weather[0].icon;
      const temperature = data.main.temp;
      const weatherDescription = data.weather[0].description;

      const weatherIconElement = document.getElementById('weather-icon');
      weatherIconElement.innerHTML = `<img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">`;

      const weatherDetailsElement = document.getElementById('weather-details');
      weatherDetailsElement.textContent = `${Math.round(temperature)}°F, ${weatherDescription}`;
    })
    .catch(error => console.error('Error fetching weather data:', error));
}

// Update the clock every second
setInterval(updateClock, 1000);

// Fetch weather data when the page loads
window.addEventListener('load', getWeatherData);
