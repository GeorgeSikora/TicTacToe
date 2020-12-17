
function refreshTimer() {
    if (secondTimer < millis()) {
        secondTimer = millis() + 1000;

        time--;
        timeout--;

        if (time < 0) {
            time = 0;
            // GAME END
        }

        if (timeout < 0) {
            timeout = 15;
            // SWITCH PLAYER ROUND
        }

        updateTimer();
    }
}

function updateTimer() {
    // refresh time
    var m = floor(time / 60);
    var s = time % 60;
    document.getElementById("time").innerHTML = nf(m, 2, 0) + ":" + nf(s, 2, 0); 
    
    // refresh timeout
    document.getElementById("timeout-value").innerHTML = nf(timeout, 2, 0); 

    // blinking effect
    var timeoutClass = document.getElementById("timeout").classList;
    if (timeout <= 4) {
        if (timeoutClass.length == 0) {
            timeoutClass.add("warning");
        }
    } else {
        if (timeoutClass.length != 0) {
            timeoutClass.remove("warning");
        }
    }
}