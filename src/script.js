import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import vShader from './shaders/water/vertex.glsl';
import fShader from './shaders/water/fragment.glsl';

/**
 * Open Graph
 */
const openGraphImage = document.querySelector("[data-og-images]");

const ogImage = new Image(1200, 630);
ogImage.src = './images/raging-sea.jpg';
openGraphImage.setAttribute('content', ogImage.src);

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 1);
scene.add(camera);

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(6, 6, 512, 512);

// Material
const debugObject = {
    depthColor: "#186691",
    surfaceColor: "#9BD8FF",
};

const waterMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    vertexShader: vShader,
    fragmentShader: fShader,
    uniforms: {
        uTime: { value: 0 },

        uAmplitude: { value: 0.2 },
        uFrequency: { value: new THREE.Vector2(4, 1.5) },
        uSpeed: { value: 0.75 },

        uSmallAmplitude: { value: 0.15 },
        uSmallFrequency: { value: 3 },
        uSmallSpeed: { value: 0.2 },
        uSmallIteration: { value: 2 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.2 },
        uColorMultiplier: { value: 7 },
    }
});

gui.add(waterMaterial.uniforms.uAmplitude, 'value').min(0).max(1).step(0.001).name("Amplitude Vagues");
gui.add(waterMaterial.uniforms.uFrequency.value, 'x').min(0).max(10).step(0.001).name("Fréquences Vagues X");
gui.add(waterMaterial.uniforms.uFrequency.value, 'y').min(0).max(10).step(0.001).name("Fréquences Vagues Y");
gui.add(waterMaterial.uniforms.uSpeed, 'value').min(0).max(5).step(0.001).name("Vitesse Vagues");
gui.addColor(debugObject, 'depthColor').name("Couleur Vagues Profondes")
    .onChange(() => {
        water.material.uniforms.uDepthColor.value.set(debugObject.depthColor);
    })
;
gui.addColor(debugObject, 'surfaceColor').name("Couleur Vagues Surface")
    .onChange(() => {
        water.material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
    })
;
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name("Décalage Couleur Vagues");
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name("Multiplication Couleur Vagues");

gui.add(waterMaterial.uniforms.uSmallAmplitude, 'value').min(0).max(1).step(0.001).name("Amplitude Petites Vagues");
gui.add(waterMaterial.uniforms.uSmallFrequency, 'value').min(0).max(30).step(0.001).name("Fréquence Petites Vagues");
gui.add(waterMaterial.uniforms.uSmallSpeed, 'value').min(0).max(1).step(0.001).name("Vitesse Petites Vagues");
gui.add(waterMaterial.uniforms.uSmallIteration, 'value').min(0).max(5).step(1).name("Itération Petites Vagues");

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = - Math.PI * 0.5;
scene.add(water);

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Waves Update
    waterMaterial.uniforms.uTime.value = elapsedTime;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();