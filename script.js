const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", startCamera);

async function startCamera() {

    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
    });

    alert("stream OK: " + stream.getVideoTracks().length);

    video.srcObject = stream;

    await video.play();

    alert("video play 시작");

    startBtn.style.display = "none";

    // 🔥 핵심: 프레임 콜백 기반 렌더링
    if (video.requestVideoFrameCallback) {
        video.requestVideoFrameCallback(drawFrame);
    } else {
        drawLegacy();
    }
}

function drawFrame() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    video.requestVideoFrameCallback(drawFrame);
}

// fallback
function drawLegacy() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    } catch (e) {}

    requestAnimationFrame(drawLegacy);
}
