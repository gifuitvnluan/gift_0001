/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";
import { LoveOrbitConfig } from "../types";
import { config } from "../config";

interface GlassHeart3DProps {
  onIntroFinished: () => void;
  hoverActive: boolean;
  setHoverActive: (active: boolean) => void;
  playlistPlaying: boolean;
}

export default function GlassHeart3D({
  onIntroFinished,
  hoverActive,
  setHoverActive,
  playlistPlaying,
}: GlassHeart3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Ref to track play status in render loop without re-rendering everything
  const playingRef = useRef(playlistPlaying);
  useEffect(() => {
    playingRef.current = playlistPlaying;
  }, [playlistPlaying]);

  // Track loaded state
  const [initFinished, setInitFinished] = useState(false);

// Configuration for spelling-out/satellite orbits
  const orbits: LoveOrbitConfig[] = config.orbits;

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene & Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0512, 0.05); // Night misty fog

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    // Cinematic far-start for onboarding zoom
    camera.position.set(0, 1.5, 28);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 3.5. Post-Processing Bloom Setup
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Unreal Bloom parameters: (Resolution size, Bloom strength, Glow radius, threshold limit)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.85, // Balanced, romantic bloom strength (tamed down so text isn't overwhelming)
      0.4,  // Soft, glowing radius
      0.35  // Higher threshold so text doesn't bloom with high intensity, but heart and highlights still do
    );
    composer.addPass(bloomPass);

    // 4. Orbit Controls (Clamped constraints)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3.8;
    controls.maxDistance = 14.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.3; // Limit looking fully upside down
    controls.minPolarAngle = Math.PI / 4;
    controls.enablePan = false; // Keep centered strictly around the core heart

    // 5. Ambient & Accent Lighting
    const ambientLight = new THREE.AmbientLight(0xffb6c1, 0.45);
    scene.add(ambientLight);

    const pinkLight = new THREE.PointLight(0xff1493, 10, 15);
    pinkLight.position.set(0, 0, 0); // Put light directly inside/near heart
    scene.add(pinkLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const purpleFillLight = new THREE.DirectionalLight(0x8a2be2, 1.5);
    purpleFillLight.position.set(-5, -3, -5);
    scene.add(purpleFillLight);

    const topGlowLight = new THREE.PointLight(0xff69b4, 8, 10);
    topGlowLight.position.set(0, 4, 2);
    scene.add(topGlowLight);

    // 6. Draw Procedural Textures
    // A. Transparent Twinkling Star Texture
    const createStarTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(255, 182, 193, 0.8)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    // B. Floating Hearts design
    const createMiniHeartTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 128, 128);
        ctx.shadowColor = "#ff1493";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#ff69b4";
        ctx.beginPath();
        ctx.moveTo(64, 40);
        ctx.bezierCurveTo(64, 24, 88, 8, 104, 24);
        ctx.bezierCurveTo(120, 40, 104, 80, 64, 112);
        ctx.bezierCurveTo(24, 80, 8, 40, 24, 24);
        ctx.bezierCurveTo(40, 8, 64, 24, 64, 40);
        ctx.closePath();
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    // C. Drift Rose Petal Texture
    const createPetalTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 128, 128);
        const grad = ctx.createRadialGradient(64, 64, 5, 64, 64, 60);
        grad.addColorStop(0, "#ff4d6d");
        grad.addColorStop(0.45, "#ff0054");
        grad.addColorStop(0.8, "#c71585");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(64, 15);
        ctx.bezierCurveTo(110, 15, 110, 85, 64, 115);
        ctx.bezierCurveTo(18, 85, 18, 15, 64, 15);
        ctx.closePath();
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    // E. Glowing Dot Texture for point-based Heart Core
    const createGlowDotTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
        gradient.addColorStop(0.2, "rgba(255, 105, 180, 1.0)");
        gradient.addColorStop(0.65, "rgba(255, 20, 147, 0.45)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, Math.PI * 2);
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    };

    // D. Canvas Texture For Text Labels (Satellites)
    const createTextTexture = (text: string, color: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        
        // Cute pill button style background
        ctx.fillStyle = "rgba(12, 1, 20, 0.72)";
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        
        const r = 35; // corner radius
        const x = 30, y = 20, w = canvas.width - 60, h = canvas.height - 40;
        
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw centered text
        ctx.font = "bold 38px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#000000";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      return tex;
    };

    // 7. Starfield (Thousands of sparkles)
    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSpeeds = new Float32Array(starCount);

    for (let i = 0; i < starCount * 3; i += 3) {
      // Cylindrical distribution around a centered chamber
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 25;
      starPos[i] = Math.cos(angle) * radius;
      starPos[i + 1] = (Math.random() - 0.5) * 30; // height
      starPos[i + 2] = Math.sin(angle) * radius;

      starSpeeds[i / 3] = 0.5 + Math.random() * 1.5;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starTexture = createStarTexture();
    const starMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starPoints = new THREE.Points(starGeo, starMaterial);
    scene.add(starPoints);

    // 8. 3D Crystal Heart Core
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.4);
    shape.bezierCurveTo(0.12, 0.72, 0.5, 0.72, 0.5, 0.32);
    shape.bezierCurveTo(0.5, -0.08, 0.16, -0.38, 0, -0.84);
    shape.bezierCurveTo(-0.16, -0.38, -0.5, -0.08, -0.5, 0.32);
    shape.bezierCurveTo(-0.5, 0.72, -0.12, 0.72, 0, 0.4);

    const extrudeSettings = {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const heartGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    heartGeometry.center();

    // Luxurious physical pink glass material - now invisible, serving as high-performance collider for Pointer Hover
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff69b4,
      transparent: true,
      opacity: 0.0,
      depthWrite: false, // Do not block depth representation
    });

    const heartMesh = new THREE.Mesh(heartGeometry, glassMaterial);
    heartMesh.scale.set(1.8, 1.8, 1.8);
    scene.add(heartMesh);

    // Create a magnificent, sparkling dense heart made of thousands of pink dots!
    const heartPointsCount = 6000;
    const heartPointsPos = new Float32Array(heartPointsCount * 3);
    const heartPointsColors = new Float32Array(heartPointsCount * 3);

    const pinkColor = new THREE.Color("#ff69b4"); 
    const deepPinkColor = new THREE.Color("#ff1493");
    const roseColor = new THREE.Color("#ff4d6d");
    const lightPinkColor = new THREE.Color("#ffb6c1");
    const colorChoices = [pinkColor, deepPinkColor, roseColor, lightPinkColor];

    for (let i = 0; i < heartPointsCount; i++) {
      // Parametric formula for perfect volumetric 3D heart density
      const t = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      // Generates thicker volumetric structure inside rather than just a flat boundary shell
      const r = 0.5 + Math.random() * 0.5; // distribution radius factor
      const scaleFactor = 0.091 * r;

      const baseX = 16 * Math.pow(Math.sin(t), 3);
      const baseY = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) - 2.5;
      const baseZ = 7.5 * Math.sin(t) * Math.cos(phi);

      heartPointsPos[i * 3] = baseX * scaleFactor;
      heartPointsPos[i * 3 + 1] = baseY * scaleFactor;
      heartPointsPos[i * 3 + 2] = baseZ * scaleFactor;

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)].clone();
      
      // Give organic lighting heights
      col.addScalar((baseY / 20) * 0.12);
      
      heartPointsColors[i * 3] = col.r;
      heartPointsColors[i * 3 + 1] = col.g;
      heartPointsColors[i * 3 + 2] = col.b;
    }

    const heartPointsGeo = new THREE.BufferGeometry();
    heartPointsGeo.setAttribute("position", new THREE.BufferAttribute(heartPointsPos, 3));
    heartPointsGeo.setAttribute("color", new THREE.BufferAttribute(heartPointsColors, 3));

    const glowDotTex = createGlowDotTexture();
    const heartPointsMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: glowDotTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const heartPoints = new THREE.Points(heartPointsGeo, heartPointsMaterial);
    // Add heartPoints as child of heartMesh so it rotates and pulses dynamically!
    heartMesh.add(heartPoints);

    // Subtle larger glowing outer shell of dot sparkles
    const outerPointsCount = 1500;
    const outerPointsPos = new Float32Array(outerPointsCount * 3);
    const outerPointsColors = new Float32Array(outerPointsCount * 3);

    for (let i = 0; i < outerPointsCount; i++) {
      const t = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      // Scatter slightly wider as a sparkling halo wrapping the heart
      const scaleFactor = 0.096 * (1.05 + Math.random() * 0.1); 

      const baseX = 16 * Math.pow(Math.sin(t), 3);
      const baseY = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) - 2.5;
      const baseZ = 7.5 * Math.sin(t) * Math.cos(phi);

      outerPointsPos[i * 3] = baseX * scaleFactor;
      outerPointsPos[i * 3 + 1] = baseY * scaleFactor;
      outerPointsPos[i * 3 + 2] = baseZ * scaleFactor;

      const col = new THREE.Color("#ff85a1").clone();
      // add a bit of gold sparkle or lavender
      if (Math.random() > 0.6) {
        col.set("#ffd700"); // gold sparkle dots!
      }
      outerPointsColors[i * 3] = col.r;
      outerPointsColors[i * 3 + 1] = col.g;
      outerPointsColors[i * 3 + 2] = col.b;
    }

    const outerPointsGeo = new THREE.BufferGeometry();
    outerPointsGeo.setAttribute("position", new THREE.BufferAttribute(outerPointsPos, 3));
    outerPointsGeo.setAttribute("color", new THREE.BufferAttribute(outerPointsColors, 3));

    const outerPointsMaterial = new THREE.PointsMaterial({
      size: 0.10,
      map: createStarTexture(), // Star texture for outer twinkling dots
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const outerHeartPoints = new THREE.Points(outerPointsGeo, outerPointsMaterial);
    heartMesh.add(outerHeartPoints);

    // 9. Orbits, Orbit Rails, and Satellites Setup
    const satelliteGroups: THREE.Group[] = [];
    const satelliteSprites: THREE.Sprite[] = [];
    const orbitLines: THREE.Line[] = [];
    const orbitLights: THREE.Mesh[] = [];

    orbits.forEach((orbit) => {
      // Create orbit container (which rotates around center)
      const orbitGroup = new THREE.Group();
      // Apply tilted inclinations
      orbitGroup.rotation.x = (orbit.tiltX * Math.PI) / 180;
      orbitGroup.rotation.z = (orbit.tiltZ * Math.PI) / 180;
      scene.add(orbitGroup);
      satelliteGroups.push(orbitGroup);

      // Create faded circular rail line
      const pathSegments = 120;
      const pathGeo = new THREE.BufferGeometry();
      const pathPoints = [];
      for (let s = 0; s <= pathSegments; s++) {
        const theta = (s / pathSegments) * Math.PI * 2;
        pathPoints.push(
          new THREE.Vector3(
            Math.cos(theta) * orbit.radius,
            0,
            Math.sin(theta) * orbit.radius
          )
        );
      }
      pathGeo.setFromPoints(pathPoints);

      const railMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(orbit.color),
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
      });
      const rail = new THREE.Line(pathGeo, railMat);
      orbitGroup.add(rail);
      orbitLines.push(rail);

      // Create Satellite Label
      const labelText = orbit.text;
      const labelTexture = createTextTexture(labelText, orbit.color);
      const spriteMat = new THREE.SpriteMaterial({
        map: labelTexture,
        transparent: true,
        opacity: 0.0, // Instantiated unseen, faded in during welcome GSAP
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const sprite = new THREE.Sprite(spriteMat);
      const wSize = textMeasurementWidth(orbit.text);
      sprite.scale.set(wSize, 0.45, 1.0);
      
      // Position on rail
      sprite.position.set(orbit.radius, 0, 0);
      orbitGroup.add(sprite);
      satelliteSprites.push(sprite);

      // Create "glowing energy seed" running along each line
      const seedGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const seedMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(orbit.color),
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });
      const seed = new THREE.Mesh(seedGeo, seedMat);
      // Place offset on orbit
      seed.position.set(orbit.radius, 0, 0);
      orbitGroup.add(seed);
      orbitLights.push(seed);
    });

    // Custom text measurement scaling helper
    function textMeasurementWidth(txt: string) {
      if (txt.includes("LINH")) return 1.6;
      if (txt.includes("LOVE")) return 2.1;
      if (txt.includes("20-10")) return 1.8;
      return 2.1;
    }

    // 10. Floating Environmental Flutter (Hearts, Petals, Fairy Dust)
    const floatPool: {
      mesh: THREE.Mesh;
      type: "petal" | "heart" | "sparkle";
      posY: number;
      speedY: number;
      speedRot: number;
      timePhase: number;
      radiusX: number;
      radiusZ: number;
    }[] = [];

    const floatCount = 75;
    const petalTex = createPetalTexture();
    const miniHeartTex = createMiniHeartTexture();
    const sparksTex = createStarTexture();

    const petalMat = new THREE.MeshBasicMaterial({
      map: petalTex,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const fHeartMat = new THREE.MeshBasicMaterial({
      map: miniHeartTex,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const floatSparkMat = new THREE.MeshBasicMaterial({
      map: sparksTex,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Create 3D planes to rotate and tumble beautifully
    const floatGeo = new THREE.PlaneGeometry(0.24, 0.24);

    for (let f = 0; f < floatCount; f++) {
      const chance = Math.random();
      let type: "petal" | "heart" | "sparkle" = "sparkle";
      let material = floatSparkMat;
      let scaleOffset = 0.5 + Math.random() * 0.8;

      if (chance < 0.38) {
        type = "petal";
        material = petalMat;
        scaleOffset = 1.0 + Math.random() * 0.8;
      } else if (chance < 0.75) {
        type = "heart";
        material = fHeartMat;
        scaleOffset = 0.8 + Math.random() * 0.7;
      }

      const fMesh = new THREE.Mesh(floatGeo, material);
      fMesh.scale.set(scaleOffset, scaleOffset, scaleOffset);

      // Scatter in a cylindrical cloud around core
      const angle = Math.random() * Math.PI * 2;
      const orbitRad = 1.5 + Math.random() * 6.5;
      
      const startX = Math.cos(angle) * orbitRad;
      const startY = (Math.random() - 0.5) * 11 + 2;
      const startZ = Math.sin(angle) * orbitRad;

      fMesh.position.set(startX, startY, startZ);
      fMesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      scene.add(fMesh);

      floatPool.push({
        mesh: fMesh,
        type,
        posY: startY,
        speedY: 0.015 + Math.random() * 0.024,
        speedRot: 0.2 + Math.random() * 1.5,
        timePhase: Math.random() * 100,
        radiusX: startX,
        radiusZ: startZ,
      });
    }

    // 11. Mouse / Touch Hover Spark Burst System
    const sparkBurstArray: {
      mesh: THREE.Mesh;
      vel: THREE.Vector3;
      rotVel: THREE.Vector3;
      life: number;
    }[] = [];

    const spawnSparkBurst = (pos: THREE.Vector3, count = 3) => {
      for (let s = 0; s < count; s++) {
        // Create tiny glowing 3D vector heart sprite
        const bGeo = new THREE.PlaneGeometry(0.16, 0.16);
        const bMat = new THREE.MeshBasicMaterial({
          map: miniHeartTex,
          transparent: true,
          opacity: 1.0,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        const bMesh = new THREE.Mesh(bGeo, bMat);
        
        // Offset slightly
        const randomDir = new THREE.Vector3(
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6
        );
        bMesh.position.copy(pos).add(randomDir);

        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05 + 0.02, // slight upward float
          (Math.random() - 0.5) * 0.05
        ).normalize().multiplyScalar(0.04 + Math.random() * 0.06);

        const rotVel = new THREE.Vector3(
          Math.random() * 3,
          Math.random() * 3,
          Math.random() * 3
        );

        scene.add(bMesh);
        sparkBurstArray.push({
          mesh: bMesh,
          vel: velocity,
          rotVel,
          life: 1.0, // starts full life
        });
      }
    };

    // 12. Interactivity and Mouse Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const onPointerMove = (event: PointerEvent) => {
      // Normalize mouse coordinates for Raycaster
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener("pointermove", onPointerMove);

    // 13. Window resize optimization (Fluid layouts)
    const onResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      composer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    // 14. INITIATE WELCOME ONBOARD FLY-IN (GSAP)
    let introFinishedCalled = false;
    
    // Animate camera and glowing scales
    gsap.to(camera.position, {
      z: 7.2,
      y: 0.1,
      x: 0,
      duration: 3.8,
      ease: "power3.out",
      onComplete: () => {
        setInitFinished(true);
        if (onIntroFinished && !introFinishedCalled) {
          introFinishedCalled = true;
          onIntroFinished();
        }
      },
    });

    // Fade in satellites nicely on intro
    satelliteSprites.forEach((sprite, index) => {
      gsap.to(sprite.material, {
        opacity: 0.95,
        duration: 2.2,
        delay: 1.0 + index * 0.45,
        ease: "power2.inOut",
      });
    });

    // Heart scaling and pulsing is now animated programmatically in 60fps animateLoop below
    // for seamless music/beat synchronization control.

    // 15. The Animation Rendering Loop (Core 60 FPS Engine)
    const clock = new THREE.Clock();
    let frameId = 0;
    let isHoveringHeart = false;

    const animateLoop = () => {
      frameId = requestAnimationFrame(animateLoop);
      const elapsed = clock.getElapsedTime();

      // Rotate camera controls with inertia damping
      controls.update();

      // Handle Twinkling Stars (Adjust opacity rhythmically)
      const starPositions = starGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < starCount; i++) {
        // Soft twinkle speed variations
        const idx = i * 3;
        starPositions[idx + 1] += Math.sin(elapsed * starSpeeds[idx / 3] * 0.4) * 0.001; // subtle float
      }
      starGeo.attributes.position.needsUpdate = true;
      starPoints.rotation.y = elapsed * 0.015;

      // Spin central crystal heart slowly on Y axis
      heartMesh.rotation.y = elapsed * 0.16;

      // Handle Mouse Raycasting to trigger Heart Hover Glow and Sparks
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(heartMesh);

      if (intersects.length > 0) {
        if (!isHoveringHeart) {
          isHoveringHeart = true;
          setHoverActive(true);
          
          // Animate material glow boost using GSAP
          gsap.to(glassMaterial, {
            emissiveIntensity: 0.95,
            ior: 1.62, // deeper gemstone cut refraction on hover
            duration: 0.4,
            ease: "power2.out",
          });
        }

        // Spawn interactive glowing sparkles dynamically from heart core at 60 FPS
        if (Math.random() < 0.25) {
          const hitPoint = intersects[0].point;
          spawnSparkBurst(hitPoint, 3);
        }
      } else {
        if (isHoveringHeart) {
          isHoveringHeart = false;
          setHoverActive(false);

          gsap.to(glassMaterial, {
            emissiveIntensity: 0.4,
            ior: 1.48, // restored
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      }

      // Dynamically scale heart and pulse lights in perfect rhythm with the background music
      if (playingRef.current) {
        // Lub-dub double-beat heartbeat rhythm
        const phase = elapsed * 1.35 * Math.PI; // Romantic tempo (~81 BPM)
        const p1 = Math.pow(Math.sin(phase), 18) * 0.22; // Sharp first contraction (Lub)
        const p2 = Math.pow(Math.sin(phase - 0.45), 18) * 0.12; // Echoing second contraction (Dub)
        const musicPulse = p1 + p2;
        const scaleVal = 1.75 + musicPulse;
        heartMesh.scale.set(scaleVal, scaleVal, scaleVal);

        // Pulse lights in perfect sync with the heartbeat
        pinkLight.intensity = 11 + musicPulse * 18;
      } else {
        // Gentle slow breathing scale when paused/idle
        const breathe = Math.sin(elapsed * 1.5) * 0.07;
        const scaleVal = 1.75 + breathe;
        heartMesh.scale.set(scaleVal, scaleVal, scaleVal);

        pinkLight.intensity = 8.5 + breathe * 2.5;
      }

      // Render Active Spark Bursts (Sparks generated on hover)
      for (let s = sparkBurstArray.length - 1; s >= 0; s--) {
        const item = sparkBurstArray[s];
        item.mesh.position.add(item.vel);
        
        // Spin sparks
        item.mesh.rotation.x += item.rotVel.x * 0.01;
        item.mesh.rotation.y += item.rotVel.y * 0.01;
        item.mesh.rotation.z += item.rotVel.z * 0.01;

        // Age items
        item.life -= 0.024;
        const mat = item.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = item.life;
        
        // Shrink slightly
        item.mesh.scale.multiplyScalar(0.96);

        if (item.life <= 0) {
          scene.remove(item.mesh);
          // Free resources
          item.mesh.geometry.dispose();
          mat.dispose();
          sparkBurstArray.splice(s, 1);
        }
      }

      // Rotate each Satellite Pivot according to layout configuration
      orbits.forEach((orbit, index) => {
        const rotPivot = satelliteGroups[index];
        // Rotate pivot either clockwise or counter-clockwise
        rotPivot.rotation.y = elapsed * 0.12 * orbit.speed * orbit.direction;

        // Maintain billboard-facing sprite alignment optionally, 
        // though standard is facing camera so text is readable from drag angles
        const sprite = satelliteSprites[index];
        
        // Glow running seeds along circular rail path
        const seedMesh = orbitLights[index];
        const seedAngle = elapsed * 0.7 * orbit.speed * orbit.direction;
        seedMesh.position.set(
          Math.cos(seedAngle) * orbit.radius,
          0,
          Math.sin(seedAngle) * orbit.radius
        );
      });

      // Update Environmental Flying Flutters (Hearts, Rose Petals, Fairy Dust)
      floatPool.forEach((item) => {
        // Drift slow downward
        item.mesh.position.y -= item.speedY;

        // Organic sinusoidal sway
        const swayForce = 0.005;
        item.timePhase += 0.015;
        item.mesh.position.x += Math.sin(item.timePhase) * swayForce;
        item.mesh.position.z += Math.cos(item.timePhase * 0.6) * swayForce;

        // Spin slightly
        item.mesh.rotation.x += 0.005 * item.speedRot;
        item.mesh.rotation.y += 0.007 * item.speedRot;

        // Reset to top if drifting off-bottom
        if (item.mesh.position.y < -5.5) {
          item.mesh.position.y = 6.0;
          item.mesh.position.x = (Math.random() - 0.5) * 11;
          item.mesh.position.z = (Math.random() - 0.5) * 11;
        }
      });

      composer.render();
    };

    // Fire rendering loop
    animateLoop();

    // 16. Cleanup resources beautifully on unmount (Anti-memory-leak)
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);

      // Dispose lights, cameras, elements
      scene.remove(starPoints);
      starGeo.dispose();
      starMaterial.dispose();
      starTexture.dispose();

      scene.remove(heartMesh);
      heartGeometry.dispose();
      glassMaterial.dispose();

      // Dispose newly added heart point clouds and textures
      heartPointsGeo.dispose();
      heartPointsMaterial.dispose();
      glowDotTex.dispose();

      outerPointsGeo.dispose();
      outerPointsMaterial.dispose();

      satelliteGroups.forEach((group) => {
        scene.remove(group);
      });
      satelliteSprites.forEach((sprite) => {
        sprite.geometry.dispose();
        if (Array.isArray(sprite.material)) {
          sprite.material.forEach((m) => m.dispose());
        } else {
          sprite.material.dispose();
        }
      });
      orbitLines.forEach((line) => {
        line.geometry.dispose();
        if (Array.isArray(line.material)) {
          line.material.forEach((m) => m.dispose());
        } else {
          line.material.dispose();
        }
      });
      orbitLights.forEach((seed) => {
        seed.geometry.dispose();
        if (Array.isArray(seed.material)) {
          seed.material.forEach((m) => m.dispose());
        } else {
          seed.material.dispose();
        }
      });

      floatPool.forEach((item) => {
        scene.remove(item.mesh);
        item.mesh.geometry.dispose();
      });
      petalTex.dispose();
      miniHeartTex.dispose();
      sparksTex.dispose();
      petalMat.dispose();
      fHeartMat.dispose();
      floatSparkMat.dispose();

      sparkBurstArray.forEach((s) => {
        scene.remove(s.mesh);
        s.mesh.geometry.dispose();
        (s.mesh.material as THREE.Material).dispose();
      });

      controls.dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: "none" }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" id="canvas-love-3d" />
      
      {/* Interactive Micro Tip on Idle */}
      {/* <div className="absolute bottom-5 right-5 text-pink-300/60 font-mono text-xs tracking-wider bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-500/10 hidden md:block">
        <span>Kéo chuột để xoay 360° • Lướt để Zoom</span>
      </div> */}
    </div>
  );
}
