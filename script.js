import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

document.addEventListener("DOMContentLoaded", async () => {

  const video = document.getElementById("video");
  const canvas = document.getElementById("threeCanvas");

  const moonBtn = document.getElementById("moonBtn");
  const captureBtn = document.getElementById("captureBtn");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.z = 2;

  /* -------------------------
     카메라 (핵심 안정 구조)
  ------------------------- */
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment"
      },
      audio: false
    });

    video.srcObject = stream;
    video.playsInline = true;
    video.muted = true;

    await video.play();

  } catch (e) {
    console.log("camera error", e);
  }

  /* -------------------------
     달 생성 (최소 안정 버전)
  ------------------------- */
  const geometry = new THREE.SphereGeometry(0.5, 48, 48);

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1
  });

  const moon = new THREE.Mesh(geometry, material);
  moon.visible = false;
  scene.add(moon);

  /* 조명 */
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(3, 2, 2);
  scene.add(light);

  /* -------------------------
     렌더 루프 (절대 단순 유지)
  ------------------------- */
  function animate() {
    requestAnimationFrame(animate);

    moon.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  animate();

  /* -------------------------
     버튼
  ------------------------- */
  moonBtn.addEventListener("click", () => {
    moon.visible = !moon.visible;
  });

  /* -------------------------
     캡처 (안정 버전)
  ------------------------- */
  captureBtn.addEventListener("click", () => {

    const w = video.videoWidth;
    const h = video.videoHeight;

    const canvas2 = document.createElement("canvas");
    canvas2.width = w;
    canvas2.height = h;

    const ctx = canvas2.getContext("2d");

    ctx.drawImage(video, 0, 0, w, h);

    const img = canvas2.toDataURL("image/png");

    document.getElementById("captureFrame").classList.remove("hidden");
    document.getElementById("previewImg").src = img;

    document.getElementById("downloadBtn").onclick = () => {
      const a = document.createElement("a");
      a.href = img;
      a.download = "moon.png";
      a.click();
    };

    document.getElementById("closeBtn").onclick = () => {
      document.getElementById("captureFrame").classList.add("hidden");
    };
  });

  /* -------------------------
     리사이즈
  ------------------------- */
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

});
