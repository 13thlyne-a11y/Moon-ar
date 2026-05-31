const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");

let scene, camera, renderer;
let character;

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

    // 3. 카메라 영상 텍스처
    const texture = new THREE.VideoTexture(video);

    const bgGeometry = new THREE.PlaneGeometry(16, 9);
    const bgMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const bg = new THREE.Mesh(bgGeometry, bgMaterial);

    bg.scale.set(1.5, 1.5, 1);
    scene.add(bg);

    // 4. 3D 캐릭터 로드
    const loader = new THREE.GLTFLoader();

    loader.load("assets/character.glb", (gltf) => {

        character = gltf.scene;

        character.scale.set(1, 1, 1);
        character.position.set(0, -0.8, 0);

        scene.add(character);
    });

    // resize
    window.addEventListener("resize", () => {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function animate() {

    requestAnimationFrame(animate);

    if (character) {
        character.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}
