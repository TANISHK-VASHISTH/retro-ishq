let player;
let currentSong = 0;
let isReady = false;

const songs = [
    {
        id: "7dO_MS9tZ5E",
        title: "Dekha Ek Khwab",
        artist: "Kishore Kumar & Lata Mangeshkar"
    },
    {
        id: "SE0Z1GSjS9w",
        title: "Song 2",
        artist: "Artist"
    },
    {
        id: "DIvHIjOYq3U",
        title: "Song 3",
        artist: "Artist"
    },
    {
        id: "Ki41AKu0iHc",
        title: "Pehla Nasha",
        artist: "Udit Narayan & Sadhana Sargam"
    },
    {
        id: "OgocnLh9P1M",
        title: "Aankh Hai Bhari Bhari",
        artist: "Kumar Sanu"
    }
];

const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const albumArt = document.getElementById("albumArt");

const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

const visualizer = document.querySelector(".visualizer");


/* =========================
   YOUTUBE PLAYER
========================= */

function onYouTubeIframeAPIReady() {

    player = new YT.Player("youtube-player", {

        height: "1",
        width: "1",

        videoId: songs[currentSong].id,

        playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            playsinline: 1
        },

        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    });
}


function onPlayerReady(event) {

    isReady = true;

    console.log("YouTube player is READY");

    updateSong();

    totalTime.textContent =
        formatTime(player.getDuration());
}


/* =========================
   SONG INFORMATION
========================= */

function updateSong() {

    const song = songs[currentSong];

    songTitle.textContent = song.title;
    artistName.textContent = song.artist;

    albumArt.src =
        "https://img.youtube.com/vi/" +
        song.id +
        "/hqdefault.jpg";

    progressBar.value = 0;
    currentTime.textContent = "0:00";

    setTimeout(() => {

        if (player && player.getDuration) {

            totalTime.textContent =
                formatTime(player.getDuration());

        }

    }, 500);
}


/* =========================
   PLAY / PAUSE
========================= */

playBtn.addEventListener("click", () => {

    console.log("PLAY BUTTON CLICKED");

    if (!isReady) {

        console.log("YouTube player is NOT ready");

        return;
    }

    const state = player.getPlayerState();

    console.log("Player state:", state);

    if (state === YT.PlayerState.PLAYING) {

        player.pauseVideo();

    } else {

        player.playVideo();

    }

});


/* =========================
   NEXT
========================= */

nextBtn.addEventListener("click", () => {

    nextSong();

});


function nextSong() {

    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    player.loadVideoById(
        songs[currentSong].id
    );

    updateSong();
}


/* =========================
   YOUTUBE STATE
========================= */

function onPlayerStateChange(event) {

    if (
        event.data ===
        YT.PlayerState.PLAYING
    ) {

        playBtn.textContent = "❚❚";

        visualizer.classList.add("playing");

    }

    else {

        playBtn.textContent = "▶";

        visualizer.classList.remove("playing");

    }


    if (
        event.data ===
        YT.PlayerState.ENDED
    ) {

        nextSong();

    }
}


/* =========================
   PROGRESS UPDATE
========================= */

setInterval(() => {

    if (
        player &&
        isReady &&
        player.getCurrentTime
    ) {

        const duration =
            player.getDuration();

        const current =
            player.getCurrentTime();

        if (duration > 0) {

            progressBar.value =
                (current / duration) * 100;

            currentTime.textContent =
                formatTime(current);

            totalTime.textContent =
                formatTime(duration);
        }
    }

}, 500);


/* =========================
   SEEK
========================= */

progressBar.addEventListener(
    "input",
    () => {

        if (!player || !isReady) return;

        const duration =
            player.getDuration();

        const newTime =
            (progressBar.value / 100) *
            duration;

        player.seekTo(
            newTime,
            true
        );

    }
);


/* =========================
   TIME FORMAT
========================= */

function formatTime(seconds) {

    if (!seconds || isNaN(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    return (
        minutes +
        ":" +
        secs.toString().padStart(2, "0")
    );
}