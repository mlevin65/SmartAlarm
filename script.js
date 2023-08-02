let isAlarmSet = false; // Flag to track if the alarm is set
let isAlarmRinging = false; // Flag to track if the alarm is currently ringing
let audio;
let isMilitaryTime = true; // Flag to track the current time format

// Function to remove the alarm time and update the clock when the alarm is canceled
function cancelAlarm() {
  localStorage.removeItem("alarmTime");
  isAlarmSet = false;
  document.body.style.backgroundColor = "black";
  updateClock();
}

document.getElementById("LightON").addEventListener("click", () => {
  fetch("/cgi-bin/ON.py")
    .then(response => response.text())
    .then(data => {
      // Process the response from the script
      console.log(data);
    })
    .catch(error => {
      console.error("Error invoking the script:", error);
    });
});

document.getElementById("LightOFF").addEventListener("click", () => {
  fetch("/cgi-bin/OFF.py")
    .then(response => response.text())
    .then(data => {
      // Process the response from the script
      console.log(data);
    })
    .catch(error => {
      console.error("Error invoking the script:", error);
    });
});

document.getElementById("HornOFF").addEventListener("click", () => {
  fetch("/cgi-bin/OFFHORN.py")
    .then(response => response.text())
    .then(data => {
      // Process the response from the script
      console.log(data);
    })
    .catch(error => {
      console.error("Error invoking the script:", error);
    });
});


// Function to trigger the alarm sound and stop it after a certain period
function triggerAlarm() {
  audio = new Audio("rain_alarm.mp3"); // Assign the audio object to the global variable
  audio.play();

  isAlarmRinging = true; // Set the flag to true when the alarm is ringing

  // Add a class to body for smooth background color transition
  document.body.classList.add("alarm-triggered");

  // Show the "Turn Off Alarm" button
  document.querySelector(".alarm-off").style.display = "block";

  // Stop the alarm sound after 30 seconds
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
    isAlarmRinging = false; // Set the flag to false when the alarm stops
    document.body.classList.remove("alarm-triggered");
    document.querySelector(".alarm-off").style.display = "none"; // Hide the "Turn Off Alarm" button
    cancelAlarm();

    // Reset the clock text color to white
    const clockDisplay = document.querySelector(".clock");
    clockDisplay.style.color = "white";

    // Code for what happens after 10 minutes of the alarm ringing
    setTimeout(() => {
      // Add your code here that you want to happen after 10 minutes of the alarm ringing
      // For example, you can turn off the alarm automatically or do any other task
      console.log("10 minutes have passed since the alarm started ringing.");
      // You can call any other function or perform any action here after 10 minutes.

      // Perform the fetch request to execute the ONHORN.py script
      fetch("/cgi-bin/ONHORN.py")
        .then(response => response.text())
        .then(data => {
          // Process the response from the script
          console.log(data);
        })
        .catch(error => {
          console.error("Error invoking the script:", error);
        });
    }, 60000); // 10 minutes = 60,000 milliseconds
  }, 30000); // Adjust this value to change the alarm duration
}



// Function to turn off the alarm manually
function turnOffAlarm() {
  if (audio && isAlarmRinging) { // Check if the audio object exists and the alarm is currently ringing
    audio.pause();
    audio.currentTime = 0;
    isAlarmRinging = false; // Set the flag to false when the alarm stops
    document.body.classList.remove("alarm-triggered");
    document.querySelector(".alarm-off").style.display = "none"; // Hide the "Turn Off Alarm" button
    cancelAlarm();

    // Reset the clock text color to white
    const clockDisplay = document.querySelector(".clock");
    clockDisplay.style.color = "white";
  }
}

function setAlarm(isAnnoyingAlarm = false) {
  const alarmTimeInput = document.getElementById("alarm-time");
  const alarmTime = alarmTimeInput.value;

  if (alarmTime === "") {
    alert("Please set the alarm time.");
    return;
  }

  localStorage.setItem("alarmTime", alarmTime);
  isAlarmSet = true; // Set the flag to true when the alarm is set

  if (isAnnoyingAlarm) {
    triggerAnnoyingAlarm(); // Set the annoying alarm
  } else {
    updateClock(); // Update the clock immediately after setting the regular alarm
    alert("Alarm set successfully!");
  }
}


// Function to update the clock and check if the alarm time is reached
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const clockDisplay = document.querySelector(".clock");
  clockDisplay.textContent = formatTime(hours, minutes, seconds);

  // Check if the alarm time is set
  if (isAlarmSet) {
    // Calculate the time difference in seconds
    const alarmTimeString = localStorage.getItem("alarmTime");
    const alarmTime = new Date(`${now.toDateString()} ${alarmTimeString}`);
    const timeDiffInSeconds = Math.floor((alarmTime - now) / 1000);

    // Calculate the percentage of time passed (closer to 1 as alarm time approaches)
    const timePercentage = Math.min(1, Math.max(0, 1 - timeDiffInSeconds / (60 * 5))); // Change the '5' to control how fast the transition occurs

    // Calculate the RGB values based on the percentage (linear interpolation from black to white)
    const r = Math.round(255 * timePercentage);
    const g = Math.round(255 * timePercentage);
    const b = Math.round(255 * timePercentage);

    // Set the background color using the calculated RGB values
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // Calculate the color of the clock text based on timePercentage (closer to 0 as alarm time approaches)
    const textColorPercentage = isAlarmSet ? 1 - timePercentage : 1; // Set to 1 (white) when alarm is not triggered
    const textColor = `rgb(${Math.round(255 * textColorPercentage)}, ${Math.round(255 * textColorPercentage)}, ${Math.round(255 * textColorPercentage)})`;
    clockDisplay.style.color = textColor;

    // Check if the alarm time is reached
    if (timeDiffInSeconds <= 0) {
      triggerAlarm();
    }
  }
}

function updateWeatherData() {
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

function toggleTimeFormat() {
  isMilitaryTime = !isMilitaryTime; // Toggle the time format flag
  updateClock(); // Update the clock with the new time format
}

function formatTime(hours, minutes, seconds) {
  if (isMilitaryTime) {
    // Return the time in military format (24-hour format)
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } else {
    // Return the time in standard format (12-hour format with AM/PM)
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12) || 12; // Convert to 12-hour format
    return `${formattedHours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} ${period}`;
  }
}

function scrollToSetAlarm() {
  window.scrollBy({ top: 600, behavior: "smooth" });
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update the clock every second
setInterval(updateClock, 1000);
setInterval(updateWeatherData, 60000); // 60000 milliseconds = 1 minute

// Fetch weather data when the page loads
window.addEventListener('load', updateWeatherData);

// Initialize the background color to black
document.body.style.backgroundColor = "black";