function setAlarm() {
    const time = prompt("Enter the time for the alarm (HH:mm:ss):");
    if (time) {
        const [hours, minutes, seconds] = time.split(":");
        const alarmTime = new Date();
        alarmTime.setHours(hours);
        alarmTime.setMinutes(minutes);
        alarmTime.setSeconds(seconds);

        setInterval(() => {
            const currentTime = new Date();
            if (currentTime >= alarmTime) {
                alert("Alarm! Time to wake up!");
                clearInterval(interval);
            }
        }, 1000);
    const alarmTimeInput = document.getElementById("alarm-time");
    const alarmTime = alarmTimeInput.value;

    if (alarmTime === "") {
      alert("Please set the alarm time.");
      return;
    }
}

// Update the clock time every second
function updateClock() {
    const currentTime = new Date();
    const timeDisplay = document.getElementById("time-display");
    const timeString = currentTime.toLocaleTimeString();
    timeDisplay.textContent = timeString;
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
    const audio = new Audio("alarm_sound.mp3");
    audio.play();

const interval = setInterval(updateClock, 1000);
    document.body.style.backgroundColor = "#FF0000";
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
  }

  // Update the clock every second
  setInterval(updateClock, 1000);
