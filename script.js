const video = document.getElementById("camera");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", startCamera);

async function startCamera() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

        video.srcObject = stream;

        alert("카메라 연결 성공");

        startBtn.style.display = "none";

    } catch (err) {

        alert(
            "에러명: " + err.name +
            "\n메시지: " + err.message
        );
    }
}

startCamera();
