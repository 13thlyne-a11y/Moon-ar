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

        console.log("카메라 시작");

    } catch (err) {

        console.error(err);
        alert("카메라 접근 실패");
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
