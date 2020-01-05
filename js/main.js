let scene, camera, renderer, composer, controls;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020202);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    50000
  );
  camera.position.x = -350;
  camera.position.y = 250;
  camera.position.z = 800;

  let directionalLight = new THREE.DirectionalLight(0xffccaa, 3);
  directionalLight.position.set(0, 0, -1);
  scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", renderer.domElemen);
  controls.panSpeed = 0.1;
  controls.rotateSpeed = 0.2;
  controls.update();

  let circleGeo = new THREE.CircleGeometry(200, 100);
  let circleMat = new THREE.MeshBasicMaterial({ color: 0xffccaa });
  let circle = new THREE.Mesh(circleGeo, circleMat);
  circle.position.set(0, 100, -500);
  circle.scale.setX(1.2);
  scene.add(circle);

  let areaImage = new Image();
  areaImage.src = POSTPROCESSING.SMAAEffect.areaImageDataURL;
  let searchImage = new Image();
  searchImage.src = POSTPROCESSING.SMAAEffect.searchImageDataURL;
  let smaaEffect = new POSTPROCESSING.SMAAEffect(searchImage, areaImage, 1);

  let godraysEffect = new POSTPROCESSING.GodRaysEffect(camera, circle, {
    resolutionScale: 1,
    density: 0.8,
    decay: 0.95,
    weight: 0.9,
    samples: 100
  });

  let renderPass = new POSTPROCESSING.RenderPass(scene, camera);
  let effectPass = new POSTPROCESSING.EffectPass(camera, godraysEffect);
  effectPass.renderToScreen = true;

  composer = new POSTPROCESSING.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(effectPass);

  let loader = new THREE.GLTFLoader();
  loader.load("scene.gltf", function(gltf) {
    let bat = gltf.scene.children[0];
    bat.scale.set(85, 85, 85);
    scene.add(gltf.scene);
    animate();
  });
}

function animate() {
  composer.render(0.1);
  requestAnimationFrame(animate);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

init();
