const video = document.getElementById("camera");

async function startCamera() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: {
                        ideal: "environment"
                    }
                },
                audio: false
            });

        video.srcObject = stream;

        await video.play();

        alert("카메라 시작 성공");

    } catch (err) {

        alert(
            "에러명: " + err.name +
            "\n메시지: " + err.message
        );

        console.error(err);
    }
}

startCamera();

document
.getElementById("captureBtn")
.addEventListener("click", capture);

function capture() {

    const canvas =
        document.getElementById("captureCanvas");

    const ctx =
        canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const link =
        document.createElement("a");

    link.download = "ar-photo.png";

    link.href =
        canvas.toDataURL("image/png");

    link.click();
}
