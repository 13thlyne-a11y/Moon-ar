const video = document.getElementById("camera");

async function startCamera() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: true,
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
    }
}

startCamera();
