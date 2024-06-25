import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";
import doorColorImage from "./textures/door/color.jpg";
import doorAlphaImage from "./textures/door/alpha.jpg";
import doorHeightImage from "./textures/door/height.jpg";
import doorNormalImage from "./textures/door/normal.jpg";
import doorAmbientOcclusionImage from "./textures/door/ambientOcclusion.jpg";
import doorMetalnessImage from "./textures/door/metalness.jpg";
import doorRoughnessImage from "./textures/door/roughness.jpg";
import minecraftImage from "./textures/minecraft.png";
import matCapImage from "./textures/matcaps/5.png";
import gradientImage from "./textures/gradients/5.jpg";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// canvas
const canvas = document.querySelector("canvas.webgl");

// debug
const gui = new GUI();

// cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
  console.log(cursor.x, cursor.y);
});

// scene
const scene = new THREE.Scene();

// textures
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load(doorColorImage);
const alphaTexture = textureLoader.load(doorAlphaImage);
const heightTexture = textureLoader.load(doorHeightImage);
const normalTexture = textureLoader.load(doorNormalImage);
const ambientTexture = textureLoader.load(doorAmbientOcclusionImage);
const metalnessTexture = textureLoader.load(doorMetalnessImage);
const roughTexture = textureLoader.load(doorRoughnessImage);
const matcapTexture = textureLoader.load(matCapImage);
const gradientTexture = textureLoader.load(gradientImage);

colorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

// mesh basic material
// const material = new THREE.MeshBasicMaterial();
// material.map = colorTexture;
// material.color = new THREE.Color("#ff0000");
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = alphaTexture;
// material.side = THREE.DoubleSide;

// MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// meshmatcapmaterial
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// meshdepthmaterial
// const material = new THREE.MeshDepthMaterial();

// meshlambertmaterial
// const material = new THREE.MeshLambertMaterial();

// meshpongmaterial
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

// meshtoonmaterial
// const material = new THREE.MeshToonMaterial();
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

// mesh standart material
// const material = new THREE.MeshStandardMaterial();
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
// material.map = colorTexture;
// material.aoMap = ambientTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.1;
// material.roughnessMap = roughTexture;
// material.metalnessMap = metalnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = alphaTexture;

material.clearcoat = 1;
material.clearcoatRoughness = 0;
material.sheenColor.set(1, 1, 1);

material.sheen = 1;
material.sheenRoughness = 0.25;

material.iridescence = 1;
material.iridescenceIOR = 1;
material.iridescenceThicknessRange = [100, 800];

material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;

// debug
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.addColor(material, "sheenColor");
gui.add(material.iridescenceThicknessRange, "0").min(1).max(1000).step(1);
gui.add(material.iridescenceThicknessRange, "1").min(1).max(1000).step(1);
gui.add(material, "transmission").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(1).max(10).step(0.0001);
gui.add(material, "thickness").min(0).max(1).step(0.0001);
// environtment
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (enviMap) => {
  enviMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = enviMap;
  scene.environment = enviMap;
});

// object
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

// light
// const ambientLigth = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLigth);

// const pointlight = new THREE.PointLight(0xffffff, 30);
// pointlight.position.set(2, 3, 4);
// scene.add(pointlight);

window.addEventListener("keydown", (event) => {
  if (event.key == "h") gui.show(gui._hidden);
});

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// event listener resize
window.addEventListener("resize", () => {
  console.log("window has been resized");

  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
});

// event listener dblclick
window.addEventListener("dblclick", () => {
  console.log("double click");

  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.01,
  1000
);

camera.position.z = 3;
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
const clock = new THREE.Clock();

const tick = () => {
  // update controls
  controls.update();

  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // render per frame
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
