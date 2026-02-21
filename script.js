// CARREGAR YOUTUBE API MANUALMENTE
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

const alarmSound = document.getElementById("alarmSound");

const timer = document.getElementById("timer");
const minutesInput = document.getElementById("minutesInput");
const themeSelect = document.getElementById("themeSelect");

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const musicToggle = document.getElementById("musicToggle");
const musicStatus = document.getElementById("musicStatus");

let countdown;
let timeLeft = 0;
let isRunning = false;
let isPaused = false;

let player;
let isPlayerReady = false;

// PLAYLIST LOFI
const lofiPlaylist = [
    "5qap5aO4i9A",
    "DWcJFNfaw9c",
    "jfKfPfyJRdk",
    "rUxyKA_-grg"
];

// =====================
// RESTORE ON LOAD
// =====================
window.addEventListener("load", () => {
    const savedTime = localStorage.getItem("timeLeft");
    const savedRunning = localStorage.getItem("isRunning");
    const savedPaused = localStorage.getItem("isPaused");
    const savedMinutes = localStorage.getItem("selectedMinutes");
    const savedTheme = localStorage.getItem("selectedTheme");

    if (savedMinutes) {
        minutesInput.value = savedMinutes;
    }

    if (savedTheme) {
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);
    }

    if (savedTime) {
        timeLeft = parseInt(savedTime);
        updateDisplay();
    }

    if (savedRunning === "true") {
        isRunning = true;
        isPaused = savedPaused === "true";
    }
});

// =====================
// TIMER FUNCTIONS
// =====================

function startTimer() {
    if (!isPaused) {
        timeLeft = parseInt(minutesInput.value) * 60;
    }

    isRunning = true;
    isPaused = false;

    document.body.classList.add("focus-active");

    countdown = setInterval(() => {
        timeLeft--;

        saveState();
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(countdown);
            isRunning = false;
            document.body.classList.remove("focus-active");

            alarmSound.play();

            if (player) {
                player.pauseVideo();
            }
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(countdown);
    isPaused = true;
    saveState();
}

function resetTimer() {
    clearInterval(countdown);

    isRunning = false;
    isPaused = false;

    timeLeft = parseInt(minutesInput.value) * 60;
    updateDisplay();

    localStorage.clear();
    document.body.classList.remove("focus-active");
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timer.textContent =
        `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function saveState() {
    localStorage.setItem("timeLeft", timeLeft);
    localStorage.setItem("isRunning", isRunning);
    localStorage.setItem("isPaused", isPaused);
    localStorage.setItem("selectedMinutes", minutesInput.value);
    localStorage.setItem("selectedTheme", themeSelect.value);
}

// =====================
// BUTTON EVENTS
// =====================

playBtn.addEventListener("click", () => {

    if (musicToggle.checked && !isPlayerReady) {
        musicStatus.textContent = "Loading music...";
        return;
    }

    if (!isRunning || isPaused) {
        startTimer();
    }

    if (musicToggle.checked && isPlayerReady) {
        musicStatus.textContent = "Playing lo-fi...";
        const randomVideo = getRandomLofi();
        player.loadVideoById(randomVideo);
        player.unMute();
        player.playVideo();
    }
});

pauseBtn.addEventListener("click", () => {
    if (isRunning && !isPaused) {
        pauseTimer();
    }

    if (player) {
        player.pauseVideo();
    }
});

resetBtn.addEventListener("click", resetTimer);

// =====================
// YOUTUBE API
// =====================

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: lofiPlaylist[0],
        playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0
        },
        events: {
            onReady: function () {
                isPlayerReady = true;
                musicStatus.textContent = "Music ready.";
            },
            onStateChange: function (event) {
                if (event.data === YT.PlayerState.BUFFERING) {
                    musicStatus.textContent = "Loading music...";
                }

                if (event.data === YT.PlayerState.PLAYING) {
                    musicStatus.textContent = "Playing lo-fi...";
                }
            }
        }
    });
}

musicToggle.addEventListener("change", () => {
    if (!isPlayerReady) return;

    if (!musicToggle.checked && player) {
        player.pauseVideo();
    }
});

function getRandomLofi() {
    const randomIndex = Math.floor(Math.random() * lofiPlaylist.length);
    return lofiPlaylist[randomIndex];
}

// =====================
// THEMES
// =====================

themeSelect.addEventListener("change", () => {
    applyTheme(themeSelect.value);
    localStorage.setItem("selectedTheme", themeSelect.value);
});

function applyTheme(theme) {
    if (theme === "deepblue") {
        document.body.style.background =
            "linear-gradient(-45deg, #0f2027, #203a43, #2c5364)";
    }

    if (theme === "mono") {
        document.body.style.background =
            "linear-gradient(-45deg, #1e1e1e, #2c2c2c, #3a3a3a)";
    }

    if (theme === "midnight") {
        document.body.style.background =
            "linear-gradient(-45deg, #0f0f1a, #1a1a2e, #16213e, #0f3460)";
    }

}



