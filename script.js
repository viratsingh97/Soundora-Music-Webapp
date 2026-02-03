
console.log("Lets write js");

let currentSong = new Audio();
let songs = [];
let currFolder = "";
let currentIndex = -1;

async function getSongs(folder) {
    currFolder = folder;
    try {
        const response = await fetch(`songs/${folder}/songs.json`);
        const data = await response.json();
        return data.songs;
    } catch (err) {
        console.error("Error loading songs:", err);
        return [];
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerText =
        `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

    if (!isNaN(currentSong.duration)) {
        const percent = (currentSong.currentTime / currentSong.duration) * 100;
        document.querySelector(".circle").style.left = percent + "%";
    }
});

function playMusic(trackPath, index) {
    currentIndex = index;
    currentSong.src = trackPath;
    currentSong.play();
    play.src = "img/pause.svg";

    const name = decodeURIComponent(
        trackPath.split("/").pop().replace(".mp3", "")
    );
    document.querySelector(".songinfo").innerText = name;

    currentSong.onloadedmetadata = () => {
        document.querySelector(".songtime").innerText =
            `00:00 / ${formatTime(currentSong.duration)}`;
    };
}

document.querySelector(".seekbar").addEventListener("click", (e) => {
    const percent = e.offsetX / e.target.clientWidth;
    currentSong.currentTime = percent * currentSong.duration;
});

async function loadPlaylist(folder) {
    songs = await getSongs(folder);
    currentIndex = -1;

    const songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    songs.forEach((song, index) => {
        const name = decodeURIComponent(
            song.split("/").pop().replace(".mp3", "")
        );

        songUL.innerHTML += `
            <li>
                <img class="invert" src="./img/music.svg">
                <div class="info">
                    <div>${name}</div>
                    <div>By Virat</div>
                </div>
                <div class="playnow">
                    <span>Play now</span>
                    <img class="invert" src="./img/play.svg">
                </div>
            </li>`;
    });

    Array.from(songUL.children).forEach((li, index) => {
        li.addEventListener("click", () => {
            playMusic(songs[index], index);
        });
    });
}

async function main() {

    await loadPlaylist("ncs");

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    previous.addEventListener("click", () => {
        if (currentIndex > 0) {
            playMusic(songs[currentIndex - 1], currentIndex - 1);
        }
    });

    next.addEventListener("click", () => {
        if (currentIndex < songs.length - 1) {
            playMusic(songs[currentIndex + 1], currentIndex + 1);
        }
    });

    currentSong.addEventListener("ended", () => {
        if (currentIndex < songs.length - 1) {
            playMusic(songs[currentIndex + 1], currentIndex + 1);
        }
    });

    document.querySelector(".range input").addEventListener("input", e => {
        currentSong.volume = e.target.value / 100;
    });

    document.querySelector(".volume img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = "img/mute.svg";
            currentSong.volume = 0;
        } else {
            e.target.src = "img/volume.svg";
            currentSong.volume = 0.5;
        }
    });

    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async () => {

            await loadPlaylist(card.dataset.folder);

            if (window.innerWidth <= 1200) {
                document.querySelector(".left").classList.add("active");
            }
        });
    });


    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").classList.add("active");
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").classList.remove("active");
    });

    const username = localStorage.getItem("username");
    if (username) {
        document.getElementById("user-name").innerText = "Welcome, " + username;
        document.getElementById("user-name").style.display = "inline";
        document.querySelector(".signup-btn").style.display = "none";
        document.querySelector(".login-btn").style.display = "none";
        document.getElementById("logout-btn").style.display = "inline";
    }
}

main();

function logout() {
    localStorage.removeItem("username");
    window.location.reload();
}



const loginBtn = document.querySelector(".login-btn");
const signupBtn = document.querySelector(".signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const userNameEl = document.getElementById("user-name");

loginBtn?.addEventListener("click", () => {
    window.location.href = "login.html";
});

signupBtn?.addEventListener("click", () => {
    window.location.href = "signup.html";
});

const username = localStorage.getItem("username");

if (username) {
    if (userNameEl) {
        userNameEl.innerText = `Welcome, ${username}`;
        userNameEl.style.display = "inline";
    }

    loginBtn && (loginBtn.style.display = "none");
    signupBtn && (signupBtn.style.display = "none");

    logoutBtn && (logoutBtn.style.display = "inline");
}

function logout() {
    localStorage.removeItem("username");
    window.location.href = "login.html";
}
