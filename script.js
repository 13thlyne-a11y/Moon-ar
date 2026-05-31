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

        video.srcObject = stream;

        alert("카메라 연결 성공");

        // 🔥 핵심: 프레임을 canvas로 직접 복사
        requestAnimationFrame(draw);

        startBtn.style.display = "none";

    } catch (err) {

        alert(err.name + "\n" + err.message);
    }
}

function draw() {

    if (video.readyState >= 2) {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    requestAnimationFrame(draw);
}
