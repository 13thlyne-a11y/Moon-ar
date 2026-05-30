import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

document.addEventListener("DOMContentLoaded", () => {

function createMoonTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;

  const ctx = canvas.getContext("2d");

  // 1. 기본 색 (달 베이스)
  const base = ctx.createRadialGradient(
    512, 512, 50,
    512, 512, 600
  );

  base.addColorStop(0, "#e6e1d3");
  base.addColorStop(1, "#cfc7b3");

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. 큰 크레이터
  for (let i = 0; i < 250; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random() * 30 + 5;

    ctx.beginPath();
    ctx.fillStyle = "rgba(120,110,95,0.15)";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. 미세 노이즈 (핵심)
  const imageData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 10;

    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }

  ctx.putImageData(imageData, 0, 0);

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

const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
dirLight.position.set(4, 2, 3);
scene.add(dirLight);

/* -------------------------
   2. 보름달 생성
------------------------- */
const geometry = new THREE.SphereGeometry(1, 64, 64);

const moonTexture = createMoonTexture();

const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  roughness: 0.95,
  metalness: 0.0
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

    captureCanvas.width = innerWidth;
    captureCanvas.height = innerHeight;

    const ctx = captureCanvas.getContext("2d");

    // 1. 카메라 화면
    ctx.drawImage(video, 0, 0);

    // 2. 3D 보름달 (WebGL)
    ctx.drawImage(renderer.domElement, 0, 0);

    const img = captureCanvas.toDataURL("image/png");

    // 3. 프레임 UI 열기
    document.getElementById("captureFrame")
      .classList.remove("hidden");

    document.getElementById("previewImg")
      .src = img;

    // 4. 저장 버튼
    document.getElementById("downloadBtn")
      .onclick = () => {
        const a = document.createElement("a");
        a.href = img;
        a.download = "moon.png";
        a.click();
      };

    // 5. 닫기 버튼
    document.getElementById("closeBtn")
      .onclick = () => {
        document.getElementById("captureFrame")
          .classList.add("hidden");
      };
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
});
