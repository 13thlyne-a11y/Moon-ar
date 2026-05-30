import * as THREE from "three";

/* ---------------------------
   1. 카메라 실행
--------------------------- */
const video = document.getElementById("camera");

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });

  video.srcObject = stream;

  video.setAttribute("playsinline", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("muted", "");

  await video.play(); // ⭐ 이게 핵심
}

startCamera();

/* ---------------------------
   2. Three.js 초기화
--------------------------- */
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
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0x000000, 0);

/* 조명 */
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

/* ---------------------------
   3. 보름달 생성 (GLB 대신 Sphere)
--------------------------- */
function createMoon() {
  const geometry = new THREE.SphereGeometry(0.6, 32, 32);

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1,
    metalness: 0
  });

  const moon = new THREE.Mesh(geometry, material);

  return moon;
}

let moons = [];

/* ---------------------------
   4. 터치로 배치
--------------------------- */
window.addEventListener("click", (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;

  const moon = createMoon();

  moon.position.set(x * 3, y * 3, 0);

  scene.add(moon);
  moons.push(moon);
});

/* ---------------------------
   5. 애니메이션 (회전)
--------------------------- */
function animate() {
  requestAnimationFrame(animate);

  moons.forEach((m) => {
    m.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
}

animate();

/* ---------------------------
   6. 사진 저장 (카메라 + 3D 합성)
--------------------------- */
document.getElementById("capture").addEventListener("click", async () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  /* 1) 카메라 그리기 */
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  /* 2) WebGL 캔버스 그리기 */
  ctx.drawImage(renderer.domElement, 0, 0);

  /* 3) 다운로드 */
  const link = document.createElement("a");
  link.download = "moon-ar.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

/* ---------------------------
   7. 리사이즈 대응
--------------------------- */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
