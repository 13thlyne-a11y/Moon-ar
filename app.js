import * as THREE from "three";

/* -----------------------------
   1. 카메라 시작 (가장 중요)
----------------------------- */
const video = document.getElementById("video");

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }
      },
      audio: false
    });

    video.srcObject = stream;

    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");

    await video.play();

    console.log("camera started");

    console.log("videoWidth =", video.videoWidth);
    console.log("videoHeight =", video.videoHeight);

  } catch (e) {
    console.error("camera error", e);
    alert("카메라 권한이 필요합니다");
  }
}

startCamera();

/* -----------------------------
   2. THREE.JS 초기화
----------------------------- */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  preserveDrawingBuffer: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.setClearColor(0x000000, 0);

document.getElementById("three").appendChild(renderer.domElement);

/* 조명 */
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
scene.add(light);

/* -----------------------------
   3. 보름달 (Sphere)
----------------------------- */
function createMoon() {
  const geometry = new THREE.SphereGeometry(0.6, 32, 32);

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1
  });

  const moon = new THREE.Mesh(geometry, material);

  return moon;
}

let moons = [];

/* -----------------------------
   4. 터치 배치
----------------------------- */
document.getElementById("three").addEventListener("click", (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;

  const moon = createMoon();

  moon.position.set(x * 3, y * 3, 0);

  scene.add(moon);
  moons.push(moon);
});

/* -----------------------------
   5. 애니메이션 루프
----------------------------- */
function animate() {
  requestAnimationFrame(animate);

  moons.forEach(m => {
    m.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
}

animate();

/* -----------------------------
   6. 캡처 (카메라 + 3D 합성)
----------------------------- */
document.getElementById("captureBtn").addEventListener("click", () => {

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 1. 카메라
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 2. three.js
  ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);

  // 3. 다운로드
  const link = document.createElement("a");
  link.download = "ar-photo.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

/* -----------------------------
   7. 리사이즈 대응
----------------------------- */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
