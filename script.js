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
    }
}

// Update the clock time every second
function updateClock() {
    const currentTime = new Date();
    const timeDisplay = document.getElementById("time-display");
    const timeString = currentTime.toLocaleTimeString();
    timeDisplay.textContent = timeString;
}

const interval = setInterval(updateClock, 1000);
