// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { createNoise2D } from "simplex-noise";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import "../Styles/SpaceScene.css";

// const SpaceScene = () => {
//   const mountRef = useRef(null);
//   const effectRef = useRef(null);

//   useEffect(() => {
//     effectRef.current = new Effect();
//     effectRef.current.init(mountRef.current);

//     // Handle scroll to scale nucleus
//     const handleScroll = () => {
//       const scrollY = window.scrollY;
//       const maxScroll = window.innerHeight * 0.5; // Scale until scrolled 50% of viewport height
//       const scaleFactor = Math.min(scrollY / maxScroll, 1) * 2 + 1; // Scale from 1 to 3
//       effectRef.current.updateNucleusScale(scaleFactor);

//       // Enable scrolling by removing overflow: hidden when max scale is reached
//       if (scaleFactor >= 3) {
//         document.body.style.overflow = "auto";
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       effectRef.current.cleanup();
//     };
//   }, []);

//   const handleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen().catch((err) => {
//         console.log(`Error attempting to enable fullscreen: ${err.message}`);
//       });
//     } else if (document.exitFullscreen) {
//       document.exitFullscreen();
//     }
//   };

//   return (
//     <div>
      
//       <div ref={mountRef} className="webgl"></div>
      
//     </div>
//   );
// };

// class Effect {
//   constructor() {
//     this.nucleusPosition = null;
//     this.originalY = null;
//     this.time = null;
//     this.positionsStar = null;
//     this.velocitiesStar = null;
//     this.startPositions = null;
//     this.delta = 0;
//     this.textures = {};
//     this.hasInteracted = false;
//   }

//   async init(container) {
//     this.threeInit(container);
//     this.texturePromise = this.textureLoader();
//     this.createElements();
//     this.createMovingStars();
//     this.createPointElement();
//     this.bannerInit();

//     await this.texturePromise;
//     this.pointStars.material.map = this.textures.flare1;
//     this.pointStars2.material.map = this.textures.flare2;
//     this.pointComet1.material.map = this.textures.flare3;
//     this.planet1.material.map = this.textures.planet1;
//     this.planet2.material.map = this.textures.planet2;
//     this.planet3.material.map = this.textures.planet3;
//     this.nucleus.material.map = this.textures.star;
//     this.sphereBg.material.map = this.textures.sky;
//     this.stars.material.map = this.textures.flare2;

//     this.resizeObserver = new ResizeObserver(() => this.onResize());
//     this.resizeObserver.observe(container);

//     this.limitFPS(1 / 60);
//   }

//   threeInit(container) {
//     this.renderer = new THREE.WebGLRenderer({
//       powerPreference: "high-performance",
//       alpha: true,
//       antialias: true,
//       stencil: false,
//     });
//     this.renderer.setSize(container.clientWidth, container.clientHeight);
//     this.renderer.setPixelRatio(window.devicePixelRatio);
//     container.appendChild(this.renderer.domElement);

//     this.scene = new THREE.Scene();
//     this.camera = new THREE.PerspectiveCamera(
//       55,
//       window.innerWidth / window.innerHeight,
//       0.01,
//       1000
//     );
//     this.camera.position.set(0, 0, 150);

//     this.clock = new THREE.Clock();

//     const directionalLight = new THREE.DirectionalLight("#fff", 3);
//     directionalLight.position.set(0, 50, -20);
//     this.scene.add(directionalLight);

//     const ambientLight = new THREE.AmbientLight("#ffffff", 1);
//     ambientLight.position.set(0, -20, -40);
//     this.scene.add(ambientLight);

//     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
//     this.controls.autoRotate = true;
//     this.controls.autoRotateSpeed = 5;
//     this.controls.maxDistance = 350;
//     this.controls.minDistance = 150;
//     this.controls.enablePan = false;
//   }

//   textureLoader() {
//     const textureLoader = new THREE.TextureLoader();
//     textureLoader.crossOrigin = "anonymous";
//     const textureMap = {
//       sky: "https://i.ibb.co/HC0vxMw/sky2.jpg",
//       star: "https://i.ibb.co/NpJzwns/star.jpg",
//       flare1: "https://i.ibb.co/TRsJ1tm/p1.png",
//       flare2: "https://i.ibb.co/YQcTCRG/p2.png",
//       flare3: "https://i.ibb.co/v1S8YW7/p7.png",
//       planet1: "https://i.ibb.co/s1cZDnM/planet1.webp",
//       planet2: "https://i.ibb.co/Lt5Kn7y/planet2.webp",
//       planet3: "https://i.ibb.co/T8V57p4/planet3.webp",
//     };

//     return Promise.all(
//       Object.entries(textureMap).map(([key, path]) =>
//         textureLoader.loadAsync(path).then((texture) => {
//           texture.colorSpace = THREE.SRGBColorSpace;
//           texture.anisotropy = 16;
//           this.textures[key] = texture;
//         })
//       )
//     );
//   }

//   createElements() {
//     let icosahedronGeometry = new THREE.IcosahedronGeometry(20, 28);
//     this.originalPositions = new Float32Array(
//       icosahedronGeometry.attributes.position.array
//     );
//     let lambertMaterial = new THREE.MeshPhongMaterial({});
//     this.nucleus = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
//     this.nucleus.position.set(0, 0, 0);
//     this.scene.add(this.nucleus);

//     this.noise = createNoise2D();
//     this.blobScale = 2;

//     let geometrySphereBg = new THREE.SphereGeometry(90, 50, 50);
//     let materialSphereBg = new THREE.MeshBasicMaterial({ side: THREE.BackSide });
//     this.sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
//     this.sphereBg.position.set(0, 0, 0);
//     this.scene.add(this.sphereBg);
//   }

//   createPointElement() {
//     const self = this;

//     this.pointStars = createPointParticles({
//       size: 0.5,
//       total: 200,
//       transparent: true,
//       max: 130,
//       min: 130,
//     });
//     this.scene.add(this.pointStars);

//     this.pointStars2 = createPointParticles({
//       size: 3,
//       total: 600,
//       transparent: true,
//       max: 33,
//       min: 25,
//       pointY: 0,
//     });
//     this.scene.add(this.pointStars2);

//     this.pointComet1 = createPointParticles({
//       size: 12,
//       total: 1,
//       transparent: true,
//       max: 25,
//       min: 25,
//     });
//     this.scene.add(this.pointComet1);

//     this.planet1 = createPointParticles({
//       size: 9,
//       total: 1,
//       transparent: false,
//       max: 60,
//       min: 40,
//     });
//     this.planet2 = createPointParticles({
//       size: 12,
//       total: 1,
//       transparent: false,
//       max: 60,
//       min: 40,
//     });
//     this.planet3 = createPointParticles({
//       size: 12,
//       total: 1,
//       transparent: false,
//       max: 60,
//       min: 40,
//     });
//     this.scene.add(this.planet1, this.planet2, this.planet3);

//     function createPointParticles({
//       size,
//       total,
//       transparent = true,
//       max = 150,
//       min = 70,
//       pointY,
//     }) {
//       const positions = new Float32Array(total * 3);
//       const originalY = new Float32Array(total);
//       let point, idx;

//       for (let i = 0; i < total; i++) {
//         point = self.randomPointSphere(THREE.MathUtils.randInt(max, min));
//         idx = i * 3;
//         positions[idx] = point.x;
//         positions[idx + 2] = point.z;
//         if (pointY !== undefined) {
//           positions[idx + 1] = pointY;
//           originalY[i] = point.y;
//         } else positions[idx + 1] = point.y;
//       }

//       const pointGeometry = new THREE.BufferGeometry();
//       pointGeometry.setAttribute(
//         "position",
//         new THREE.BufferAttribute(positions, 3)
//       );
//       pointGeometry.setAttribute(
//         "originalY",
//         new THREE.BufferAttribute(originalY, 1)
//       );

//       const blending = transparent
//         ? THREE.AdditiveBlending
//         : THREE.NormalBlending;
//       const pointMaterial = new THREE.PointsMaterial({
//         size,
//         blending,
//         dealing: true,
//         depthWrite: false,
//       });

//       return new THREE.Points(pointGeometry, pointMaterial);
//     }
//   }

//   createMovingStars() {
//     const totalStars = 5;
//     const positions = new Float32Array(totalStars * 3);
//     const velocities = new Float32Array(totalStars);
//     const startPositions = new Float32Array(totalStars * 3);
//     let point, radius, idx;

//     for (let i = 0; i < totalStars; i++) {
//       radius = THREE.MathUtils.randFloat(200, 300);
//       point = this.randomPointSphere(radius);
//       idx = i * 3;

//       positions[idx] = point.x;
//       positions[idx + 1] = point.y;
//       positions[idx + 2] = point.z;

//       startPositions[idx] = point.x;
//       startPositions[idx + 1] = point.y;
//       startPositions[idx + 2] = point.z;

//       velocities[i] = THREE.MathUtils.randInt(50, 400);
//     }

//     const starsGeometry = new THREE.BufferGeometry();
//     starsGeometry.setAttribute(
//       "position",
//       new THREE.BufferAttribute(positions, 3)
//     );
//     starsGeometry.setAttribute(
//       "velocity",
//       new THREE.BufferAttribute(velocities, 1)
//     );
//     starsGeometry.setAttribute(
//       "startPosition",
//       new THREE.BufferAttribute(startPositions, 3)
//     );

//     const starsMaterial = new THREE.PointsMaterial({
//       size: 14,
//       transparent: true,
//       opacity: 0.8,
//       blending: THREE.AdditiveBlending,
//       depthWrite: false,
//     });
//     this.stars = new THREE.Points(starsGeometry, starsMaterial);
//     this.stars.name = "moving_stars";
//     this.stars.visible = false;
//     this.scene.add(this.stars);
//   }

//   randomPointSphere(radius) {
//     const theta = 2 * Math.PI * Math.random();
//     const phi = Math.acos(2 * Math.random() - 1);
//     const dx = radius * Math.sin(phi) * Math.cos(theta);
//     const dy = radius * Math.sin(phi) * Math.sin(theta);
//     const dz = radius * Math.cos(phi);

//     return new THREE.Vector3(dx, dy, dz);
//   }

//   onResize() {
//     this.camera.aspect = window.innerWidth / window.innerHeight;
//     this.camera.updateProjectionMatrix();
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//   }

//   limitFPS(interval) {
//     this.rafAnimate = requestAnimationFrame(this.limitFPS.bind(this, interval));
//     this.delta += this.clock.getDelta();

//     if (this.delta > interval) {
//       this.loop();
//       this.delta %= interval;
//     }
//   }

//   updateNucleus() {
//     if (Date.now() < animationStartTime3) return;

//     const animationEasing1 = Math.min(
//       1,
//       (Date.now() - animationStartTime3) / 2000
//     );

//     for (let i = 0; i < this.nucleusPosition.count; i++) {
//       const xNucleus = this.originalPositions[i * 3];
//       const yNucleus = this.originalPositions[i * 3 + 1];
//       const zNucleus = this.originalPositions[i * 3 + 2];

//       const lengthNucleus = Math.sqrt(
//         xNucleus * xNucleus + yNucleus * yNucleus + zNucleus * zNucleus
//       );
//       const nxNucleus = xNucleus / lengthNucleus;
//       const nyNucleus = yNucleus / lengthNucleus;
//       const nzNucleus = zNucleus / lengthNucleus;

//       const distanceNucleus =
//         20 +
//         this.noise(
//           nxNucleus + this.time * 0.0004,
//           nyNucleus + this.time * 0.0004
//         ) *
//           this.blobScale *
//           animationEasing1;

//       this.nucleusPosition.array[i * 3] = nxNucleus * distanceNucleus;
//       this.nucleusPosition.array[i * 3 + 1] = nyNucleus * distanceNucleus;
//       this.nucleusPosition.array[i * 3 + 2] = nzNucleus * distanceNucleus;
//     }
//     this.nucleusPosition.needsUpdate = true;
//     this.nucleus.geometry.computeVertexNormals();
//   }

//   updateNucleusScale(scale) {
//     if (this.nucleus) {
//       this.nucleus.scale.set(scale, scale, scale);
//     }
//   }

//   updateMovingStars() {
//     if (Date.now() < animationStartTime6) return;

//     const movingStarsEasing = Math.min(
//       1,
//       (Date.now() - animationStartTime6) / 2000
//     );

//     for (let i = 0; i < this.positionsStar.count; i++) {
//       const idx = i * 3;
//       const moveAmount =
//         movingStarsEasing *
//         ((0 - this.positionsStar.array[idx]) / this.velocitiesStar.array[i]);

//       this.positionsStar.array[idx] += moveAmount;
//       this.positionsStar.array[idx + 1] +=
//         movingStarsEasing *
//         ((0 - this.positionsStar.array[idx + 1]) / this.velocitiesStar.array[i]);
//       this.positionsStar.array[idx + 2] +=
//         movingStarsEasing *
//         ((0 - this.positionsStar.array[idx + 2]) / this.velocitiesStar.array[i]);

//       this.velocitiesStar.array[i] -= 0.1 * movingStarsEasing;

//       if (
//         this.positionsStar.array[idx] <= 2 &&
//         this.positionsStar.array[idx] >= -2 &&
//         this.positionsStar.array[idx + 2] <= 2 &&
//         this.positionsStar.array[idx + 2] >= -2
//       ) {
//         this.positionsStar.array[idx] = this.startPositions.array[idx];
//         this.positionsStar.array[idx + 1] = this.startPositions.array[idx + 1];
//         this.positionsStar.array[idx + 2] = this.startPositions.array[idx + 2];
//         this.velocitiesStar.array[i] = 120;
//       }
//     }

//     this.positionsStar.needsUpdate = true;
//     this.velocitiesStar.needsUpdate = true;
//   }

//   updatePointStars2() {
//     for (let i = 0; i < this.originalY.count; i++) {
//       const positions = this.pointStars2.geometry.attributes.position;
//       const currentY = positions.array[i * 3 + 1];
//       const targetY = this.originalY.array[i];

//       if (Date.now() >= animationStartTime3) {
//         const newYInitial = currentY + (targetY - currentY) * 0.02;
//         positions.array[i * 3 + 1] = newYInitial;
//       }

//       if (
//         Date.now() >= expansionStartTime &&
//         Date.now() < contractionStartTime
//       ) {
//         const xExpansion = positions.array[i * 3];
//         const yExpansion = positions.array[i * 3 + 1];
//         const zExpansion = positions.array[i * 3 + 2];

//         const currentDistanceExpansion = Math.sqrt(
//           xExpansion * xExpansion +
//             yExpansion * yExpansion +
//             zExpansion * zExpansion
//         );

//         if (currentDistanceExpansion < MAX_EXPANSION_DISTANCE) {
//           const distanceRatioExpansion =
//             currentDistanceExpansion / MAX_EXPANSION_DISTANCE;
//           const expansionFactor = 1 + 0.008 * (1 - distanceRatioExpansion);

//           positions.array[i * 3] = xExpansion * expansionFactor;
//           positions.array[i * 3 + 1] = yExpansion * expansionFactor;
//           positions.array[i * 3 + 2] = zExpansion * expansionFactor;
//         }
//       }

//       if (Date.now() >= contractionStartTime) {
//         const timeSinceStartContr = Date.now() - contractionStartTime;
//         const easingContr = Math.min(
//           1,
//           timeSinceStartContr / contractionDuration
//         );
//         const xContr = positions.array[i * 3];
//         const yContr = positions.array[i * 3 + 1];
//         const zContr = positions.array[i * 3 + 2];

//         const currentDistanceContr = Math.sqrt(
//           xContr * xContr + yContr * yContr + zContr * zContr
//         );
//         const originalRadiusContr = THREE.MathUtils.randFloat(25, 33);

//         const normalizedXContr =
//           (xContr / currentDistanceContr) * originalRadiusContr;
//         const normalizedYContr =
//           (yContr / currentDistanceContr) * originalRadiusContr;
//         const normalizedZContr =
//           (zContr / currentDistanceContr) * originalRadiusContr;

//         const contractionSpeedContr = 0.02 * easingContr;
//         positions.array[i * 3] =
//           xContr + (normalizedXContr - xContr) * contractionSpeedContr;
//         positions.array[i * 3 + 1] =
//           yContr + (normalizedYContr - yContr) * contractionSpeedContr;
//         positions.array[i * 3 + 2] =
//           zContr + (normalizedZContr - zContr) * contractionSpeedContr;
//       }

//       if (Date.now() >= centeringStartTime) {
//         const timeSinceStartCenter = Date.now() - centeringStartTime;
//         const easingCenter = Math.min(
//           1,
//           timeSinceStartCenter / centeringDuration
//         );
//         const xCenter = positions.array[i * 3];
//         const yCenter = positions.array[i * 3 + 1];
//         const zCenter = positions.array[i * 3 + 2];

//         const centeringSpeed = 0.02 * easingCenter;
//         positions.array[i * 3] = xCenter + (0 - xCenter) * centeringSpeed;
//         positions.array[i * 3 + 1] = yCenter + (0 - yCenter) * centeringSpeed;
//         positions.array[i * 3 + 2] = zCenter + (0 - zCenter) * centeringSpeed;

//         this.pointStars2.material.opacity = 1 - easingCenter;

//         if (easingCenter >= 1) {
//           this.pointStars2.visible = false;
//           this.stars.visible = true;
//         }
//       }
//     }
//     this.pointStars2.geometry.attributes.position.needsUpdate = true;
//   }

//   updateRotations() {
//     this.pointStars.rotation.y -= 0.0007;
//     this.pointComet1.rotation.z -= 0.01;
//     this.pointComet1.rotation.y += 0.001;
//     this.pointStars2.rotation.x -= 0.001;
//     this.planet1.rotation.y += 0.001;
//     this.planet2.rotation.z += 0.003;
//     this.planet3.rotation.x += 0.0005;
//   }

//   updatePointStarsContraction() {
//     const timeSinceStartContraction =
//       Date.now() - pointStarsContractStartTime;
//     const easingContraction = Math.min(
//       1,
//       timeSinceStartContraction / pointStarsContractDuration
//     );
//     const positionsContraction = this.pointStars.geometry.attributes.position;

//     this.pointStars.material.size = 0.4 + 0.7 * easingContraction;

//     for (let i = 0; i < positionsContraction.count; i++) {
//       const xPointContr = positionsContraction.array[i * 3];
//       const yPointContr = positionsContraction.array[i * 3 + 1];
//       const zPointContr = positionsContraction.array[i * 3 + 2];

//       const currentDistancePointContr = Math.sqrt(
//         xPointContr * xPointContr +
//           yPointContr * yPointContr +
//           zPointContr * zPointContr
//       );

//       const nxPointContr = xPointContr / currentDistancePointContr;
//       const nyPointContr = yPointContr / currentDistancePointContr;
//       const nzPointContr = zPointContr / currentDistancePointContr;

//       const targetXPointContr = nxPointContr * TARGET_RADIUS;
//       const targetYPointContr = nyPointContr * TARGET_RADIUS;
//       const targetZPointContr = nzPointContr * TARGET_RADIUS;

//       const contractionSpeedPointContr = 0.02 * easingContraction;
//       positionsContraction.array[i * 3] =
//         xPointContr +
//         (targetXPointContr - xPointContr) * contractionSpeedPointContr;
//       positionsContraction.array[i * 3 + 1] =
//         yPointContr +
//         (targetYPointContr - yPointContr) * contractionSpeedPointContr;
//       positionsContraction.array[i * 3 + 2] =
//         zPointContr +
//         (targetZPointContr - zPointContr) * contractionSpeedPointContr;
//     }

//     positionsContraction.needsUpdate = true;
//   }

//   loop() {
//     this.nucleusPosition = this.nucleus.geometry.attributes.position;
//     this.originalY = this.pointStars2.geometry.attributes.originalY;
//     this.time = Date.now();

//     this.updateNucleus();

//     this.positionsStar = this.stars.geometry.attributes.position;
//     this.velocitiesStar = this.stars.geometry.attributes.velocity;
//     this.startPositions = this.stars.geometry.attributes.startPosition;

//     this.updateMovingStars();
//     this.updatePointStars2();
//     this.updateRotations();

//     if (Date.now() >= pointStarsContractStartTime) {
//       this.updatePointStarsContraction();
//     }

//     this.controls.update();
//     this.renderer.render(this.scene, this.camera);
//   }

//   bannerInit() {
//     const banner = document.querySelector(".banner");
//     if (!banner) return;

//     const hideBanner = () => {
//       if (!this.hasInteracted) {
//         banner.style.opacity = "0";
//         banner.style.transition = "opacity 0.5s ease";
//         setTimeout(() => banner.remove(), 500);
//         this.hasInteracted = true;
//       }
//     };

//     window.addEventListener("wheel", hideBanner, { once: true });
//     this.renderer.domElement.addEventListener("pointerdown", hideBanner, {
//       once: true,
//     });
//   }

//   cleanup() {
//     if (this.resizeObserver) this.resizeObserver.disconnect();
//     cancelAnimationFrame(this.rafAnimate);
//     this.scene = null;
//     this.renderer.dispose();
//   }
// }

// const animationStartTime3 = Date.now() + 6000;
// const animationStartTime6 = Date.now() + 15000;
// const expansionStartTime = Date.now() + 9000;
// const MAX_EXPANSION_DISTANCE = 95;
// const contractionStartTime = Date.now() + 20000;
// const contractionDuration = 8000;
// const centeringStartTime = Date.now() + 25000;
// const centeringDuration = 8000;
// const pointStarsContractStartTime = Date.now() + 25000;
// const pointStarsContractDuration = 6000;
// const TARGET_RADIUS = 95;

// export default SpaceScene;