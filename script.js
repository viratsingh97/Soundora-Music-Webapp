console.log(`Lets write js`)
let currentSong = new Audio();
let songs;
let currFolder;
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href).split("\\").pop().replace(/\.mp3+$/i, ""))

        }

    }
    return songs;


}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
        `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

    // move seekbar
    if (!isNaN(currentSong.duration)) {
        let percent = (currentSong.currentTime / currentSong.duration) * 100;
        document.querySelector(".circle").style.left = percent + "%";
    }
});

const playMusic = (track) => {
    currentSong.src = `/${currFolder}/${track}.mp3`;
    currentSong.play();

    play.src = "img/pause.svg";

    // show song name
    document.querySelector(".songinfo").innerHTML = track;

    // wait for duration to load
    currentSong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerHTML =
            `00:00 / ${formatTime(currentSong.duration)}`;
    });
};
let seekbar = document.querySelector(".seekbar");

seekbar.addEventListener("click", (e) => {

    let seekbarWidth = seekbar.clientWidth;


    let clickPosition = e.offsetX;


    let percent = clickPosition / seekbarWidth;


    currentSong.currentTime = percent * currentSong.duration;
});
async function loadPlaylist(folder) {
    songs = await getSongs(`songs/${folder}`);

    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
        <li>
            <img class="invert" src="./img/music.svg">
            <div class="info">
                <div>${song}</div>
                <div>By Virat</div>
            </div>
            <div class="playnow">
                <span>Play now</span>
                <img class="invert" src="./img/play.svg">
            </div>
        </li>`;
    }

    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let track = e.querySelector(".info div").innerText.trim();
            playMusic(track);
        });
    });
}

async function main() {

    await loadPlaylist("ncs")
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="./img/music.svg" alt="">
                            <div class="info">
                                <div> ${song}</div>
                                <div>By Virat</div>
                            </div>

                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="./img/play.svg" alt=" ">
                            </div>
                        
        </li>`;

    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            let track = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(track);

        })

    })
    //Attacch eve listner to play next and prev
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        } else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })
    // var audio=new Audio(songs[0]); 
    // audio.play();
    // audio.addEventListener("loadeddata",()=>{
    //     //let duration=audio.duration;
    //     console.log(audio.duration,audio.currentSrc,audio.currentTime)
    // });        
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    previous.addEventListener("click", () => {
        let curr = decodeURIComponent(currentSong.src)
            .split("/")
            .pop()
            .replace(".mp3", "");

        let index = songs.indexOf(curr);
        if (index > 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        let curr = decodeURIComponent(currentSong.src)
            .split("/")
            .pop()
            .replace(".mp3", "");

        let index = songs.indexOf(curr);
        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        }
    });
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
    })

    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.dataset.folder;
            await loadPlaylist(folder);
        });
    });
    document.querySelector(".volume img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = "img/mute.svg";
            currentSong.volume = 0;
        } else {
            e.target.src = "img/volume.svg";
            currentSong.volume = 0.1;
        }
    });
    document.querySelector(".login-btn").addEventListener("click", function () {
        window.location.href = "login.html";
    })
    document.querySelector(".signup-btn").addEventListener("click", function () {
        window.location.href = "signup.html";
    })
    const username = localStorage.getItem("username");

    if (username) {
        document.getElementById("user-name").innerText = "Welcome, " + username;
        document.getElementById("user-name").style.display = "inline";

        document.querySelector(".signup-btn").style.display = "none";
        document.querySelector(".login-btn").style.display = "none";
        document.getElementById("logout-btn").style.display = "inline";
    }



}
main()
function logout() {
    localStorage.removeItem("username");
    window.location.reload();
} 