const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", startCamera);

async function startCamera() {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
        });

        alert("stream OK: " + stream.getVideoTracks().length);

        video.srcObject = stream;

        video.onloadedmetadata = async () => {
            await video.play();
            alert("video play 시작");
        };

        startBtn.style.display = "none";

        draw();

    } catch (err) {
        alert(err.name + "\n" + err.message);
    }
}

function draw() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    } catch (e) {
        alert("drawImage error: " + e.message);
    }

    requestAnimationFrame(draw);
}
