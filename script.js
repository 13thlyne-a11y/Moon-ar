import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

function createMoonTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#d9d2b6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 3 + 1;

    const shade = Math.random() * 40;

    ctx.beginPath();
    ctx.fillStyle = `rgba(${200 - shade}, ${190 - shade}, ${160 - shade}, 0.4)`;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

const video = document.getElementById("video");
const canvas = document.getElementById("threeCanvas");

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  preserveDrawingBuffer: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 3;

/* -------------------------
   1. 조명
------------------------- */
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(3, 1, 2);
scene.add(dirLight);

/* -------------------------
   2. 보름달 생성
------------------------- */
const geometry = new THREE.SphereGeometry(1, 64, 64);

const moonTexture = createMoonTexture();

const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  roughness: 1
});

const moon = new THREE.Mesh(geometry, moonMaterial);

moon.visible = false;
scene.add(moon);

function updateMoonScale() {
  const size =
    Math.min(window.innerWidth, window.innerHeight) * 0.0015;

  moon.scale.set(size, size, size);
}

// 최초 1회 실행
updateMoonScale();

/* -------------------------
   3. 카메라 시작
------------------------- */
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { 
      facingMode: { ideal: "environment" },
      width: { ideal: 1280 },
      height: { ideal: 720 },
      aspectRatio: { ideal: 16 / 9 }
    },
    audio: false
  });

  video.srcObject = stream;

  // 카메라 제어
  const track = stream.getVideoTracks()[0];
  const capabilities = track.getCapabilities?.();

  if (capabilities?.zoom) {
    track.applyConstraints({
      advanced: [{ zoom: 1 }]
    });
  }
}

startCamera();

/* -------------------------
   4. 렌더 루프
------------------------- */
function animate() {
  requestAnimationFrame(animate);

  moon.rotation.y += 0.002;

  renderer.render(scene, camera);
}

animate();

/* -------------------------
   5. 버튼: 보름달 ON/OFF
------------------------- */
document.getElementById("moonBtn")
  .addEventListener("click", () => {
    moon.visible = !moon.visible;
  });

/* -------------------------
   6. 촬영 기능
   (video + canvas 합성)
------------------------- */
document.getElementById("captureBtn")
  .addEventListener("click", () => {

    const captureCanvas =
      document.createElement("canvas");

    captureCanvas.width = window.innerWidth;
    captureCanvas.height = window.innerHeight;

    const ctx = captureCanvas.getContext("2d");

    // 1. 카메라 화면
    ctx.drawImage(video, 0, 0,
      captureCanvas.width,
      captureCanvas.height
    );

    // 2. Three.js 캔버스
    ctx.drawImage(renderer.domElement, 0, 0,
                  captureCanvas.width,
                  captureCanvas.height);

    // 3. 저장
    const link = document.createElement("a");
    link.download = "moon-shot.png";
    link.href = captureCanvas.toDataURL("image/png");
    link.click();
  });

/* -------------------------
   7. 화면 리사이즈 대응
------------------------- */
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  updateMoonScale();
});
