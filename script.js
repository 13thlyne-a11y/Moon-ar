const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");

let scene, camera, renderer;
let moon;

startBtn.addEventListener("click", startAR);

async function startAR() {

    // 1. 카메라
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
    });

    video.srcObject = stream;
    await video.play();

    startBtn.style.display = "none";

    // 2. Three.js 초기화
    initThree();

    animate();
}

function initThree() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = 2;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(renderer.domElement);

    // 조명 관련
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load("assets/moon.jpg");
    const moonGeometry = new THREE.SphereGeometry(0.6, 64, 64);
    const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTexture
    });

    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(0, -0.5, -1);
    scene.add(moon);
    moon.renderOrder = 1;

    // 3. 카메라 영상 텍스처
    video.onloadedmetadata = () => {

        const texture = new THREE.VideoTexture(video);

        const bgGeometry = new THREE.PlaneGeometry(16, 9);
        const bgMaterial = new THREE.MeshBasicMaterial({ map: texture });

        const bg = new THREE.Mesh(bgGeometry, bgMaterial);
        bg.scale.set(1.5, 1.5, 1);
        scene.add(bg);
        bg.renderOrder = 0;
    };

    // resize
    window.addEventListener("resize", () => {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function animate() {

    requestAnimationFrame(animate);

    if (moon) {
        moon.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
}
