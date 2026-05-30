import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

document.addEventListener("DOMContentLoaded", async () => {

  /* -----------------------
     DOM
  ----------------------- */
  const video = document.getElementById("video");
  const canvas = document.getElementById("threeCanvas");

  const moonBtn = document.getElementById("moonBtn");
  const captureBtn = document.getElementById("captureBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const closeBtn = document.getElementById("closeBtn");

  /* -----------------------
     Renderer
  ----------------------- */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  /* -----------------------
     Scene / Camera
  ----------------------- */
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.z = 2;

  /* -----------------------
     LIGHT (안정형)
  ----------------------- */
  scene.add(new THREE.AmbientLight(0xffffff, 1.0));

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(3, 3, 3);
  scene.add(light);

  /* -----------------------
     VIDEO → TEXTURE (핵심)
  ----------------------- */
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });

  video.srcObject = stream;
  video.playsInline = true;
  video.muted = true;
  
  await video.play();

  /* -----------------------
     MOON (PBR 안정 버전)
  ----------------------- */
  function createMoon() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");

    const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    grad.addColorStop(0, "#f2efe6");
    grad.addColorStop(1, "#b9b2a3");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 3;

      ctx.fillStyle = "rgba(100,100,100,0.15)";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  const moonTex = createMoon();

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 48, 48),
    new THREE.MeshStandardMaterial({
      map: moonTex,
      roughness: 1.0
    })
  );

  moon.position.set(0.6, 0.5, 0);
  moon.visible = false;

  scene.add(moon);

  /* -----------------------
     RENDER LOOP
  ----------------------- */
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();

  /* -----------------------
     BUTTONS
  ----------------------- */
  document.getElementById("moonBtn").addEventListener("click", () => {
    moon.visible = !moon.visible;
  });

  document.getElementById("captureBtn").addEventListener("click", () => {

    const img = renderer.domElement.toDataURL("image/png");

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

  /* -----------------------
     RESIZE
  ----------------------- */
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

});
