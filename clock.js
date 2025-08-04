function digitalClock() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    
    var clockElement = document.getElementById("id_clock");
    if (clockElement) {
        clockElement.textContent = hours + ":" + minutes + ":" + seconds;
    }
    
    setTimeout(digitalClock, 1000);
}

if (window.addEventListener) {
    window.addEventListener('load', digitalClock);
} else if (window.attachEvent) {
    window.attachEvent('onload', digitalClock);
} else {
    window.onload = digitalClock;
}