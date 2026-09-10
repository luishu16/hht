import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const canvas = document.getElementById("scene");
const loading = document.getElementById("loading");


// =====================================
// ESCENA
// =====================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050505);

scene.fog = new THREE.FogExp2(
  0x050505,
  0.035
);


// =====================================
// CÁMARA
// =====================================

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

camera.position.set(
  0,
  3,
  15
);


// =====================================
// RENDER 3D
// =====================================

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


// =====================================
// TEXTO 3D
// =====================================

const labelRenderer = new CSS2DRenderer();

labelRenderer.setSize(
  window.innerWidth,
  window.innerHeight
);

labelRenderer.domElement.style.position = "fixed";
labelRenderer.domElement.style.top = "0";
labelRenderer.domElement.style.left = "0";
labelRenderer.domElement.style.pointerEvents = "none";

document.body.appendChild(
  labelRenderer.domElement
);


// =====================================
// CONTROLES DE CÁMARA
// =====================================

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;

controls.dampingFactor = 0.05;

controls.enablePan = true;

controls.enableZoom = true;

controls.minDistance = 3;

controls.maxDistance = 40;

controls.rotateSpeed = 0.5;

controls.zoomSpeed = 0.8;


// =====================================
// LUCES
// =====================================

const ambient = new THREE.AmbientLight(
  0xffffff,
  0.4
);

scene.add(ambient);


const light = new THREE.PointLight(
  0xffd84d,
  12,
  35
);

light.position.set(
  0,
  2,
  0
);

scene.add(light);


// =====================================
// ESFERA CENTRAL
// =====================================

const core = new THREE.Mesh(

  new THREE.SphereGeometry(
    1.15,
    32,
    32
  ),

  new THREE.MeshStandardMaterial({

    color: 0xffd84d,

    emissive: 0xffa800,

    emissiveIntensity: 2.5

  })

);

core.position.y = 1;

scene.add(core);


// =====================================
// ANILLO
// =====================================

const ring = new THREE.Mesh(

  new THREE.TorusGeometry(
    1.8,
    0.025,
    12,
    80
  ),

  new THREE.MeshBasicMaterial({

    color: 0xffd84d,

    transparent: true,

    opacity: 0.7

  })

);

ring.rotation.x =
  Math.PI / 2;

scene.add(ring);


// =====================================
// PARTÍCULAS
// =====================================

const particleCount = 7000;

const positions =
  new Float32Array(
    particleCount * 3
  );


for (
  let i = 0;
  i < particleCount;
  i++
) {

  const radius =
    5 + Math.random() * 35;

  const angle =
    Math.random() * Math.PI * 2;

  positions[i * 3] =
    Math.cos(angle) * radius;

  positions[i * 3 + 1] =
    (Math.random() - 0.5) * 22;

  positions[i * 3 + 2] =
    Math.sin(angle) * radius;
}


const particleGeometry =
  new THREE.BufferGeometry();

particleGeometry.setAttribute(

  "position",

  new THREE.BufferAttribute(
    positions,
    3
  )

);


const particleMaterial =
  new THREE.PointsMaterial({

    color: 0xffdf70,

    size: 0.035,

    transparent: true,

    opacity: 0.75

  });


const particles =
  new THREE.Points(
    particleGeometry,
    particleMaterial
  );

scene.add(particles);


// =====================================
// FLORES
// =====================================

const flowers = [];


function createFlower() {

  const flower =
    new THREE.Group();


  const petalMaterial =
    new THREE.MeshStandardMaterial({

      color: 0xffd21f,

      emissive: 0x4a3200,

      emissiveIntensity: 0.35

    });


  for (
    let i = 0;
    i < 8;
    i++
  ) {

    const petal =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.22,
          12,
          8
        ),

        petalMaterial

      );


    const angle =
      (i / 8) *
      Math.PI *
      2;


    petal.position.set(

      Math.cos(angle) * 0.3,

      0,

      Math.sin(angle) * 0.3

    );


    petal.scale.set(
      1.5,
      0.25,
      0.65
    );


    petal.rotation.y =
      -angle;


    flower.add(petal);

  }


  const center =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.18,
        12,
        12
      ),

      new THREE.MeshStandardMaterial({
        color: 0x5a3000
      })

    );


  flower.add(center);


  return flower;

}


// Crear flores

for (
  let i = 0;
  i < 750;
  i++
) {

  const flower =
    createFlower();


  const angle =
    Math.random() *
    Math.PI *
    2;


  const radius =
    4 + Math.random() * 30;


  flower.position.set(

    Math.cos(angle) * radius,

    -10 +
      Math.random() * 25,

    Math.sin(angle) * radius

  );


  flower.scale.setScalar(

    0.1 +
    Math.random() * 1.2

  );


  scene.add(flower);

  flowers.push(flower);


  // Animación de flores

  gsap.to(
    flower.rotation,
    {

      y: Math.PI * 2,

      duration:
        8 + Math.random() * 8,

      repeat: -1,

      ease: "none"

    }
  );

}


// =====================================
// CREAR TEXTO 3D
// =====================================

function createText(
  text,
  x,
  y,
  z
) {

  const div =
    document.createElement("div");


  div.className =
    "texto3d";


  div.textContent =
    text;


  const label =
    new CSS2DObject(div);


  label.position.set(
    x,
    y,
    z
  );


  scene.add(label);


  // Animación de aparición

  gsap.from(div, {

    opacity: 0,

    scale: 0.5,

    duration: 1.5,

    ease: "power3.out"

  });


  return label;

}


// =====================================
// TEXTOS ENTRE LAS FLORES
// =====================================

createText(
  "Je t’aime",
  5,
  2,
  3
);


createText(
  "Ti amo",
  1,
  3,
  9,
);


createText(
  " Eu te amo",
  -8,
  -1,
  -7
);


createText(
  "Ich liebe dich",
  9,
  2,
  10
);


createText(
  " I love you",
  0,
  5,
  -8
);

createText(
   "愛してる" ,
   5,
   2,
   -9,
)
createText(
    "사랑해",
    5,
    2,
    8,
)

createText(
    " 我爱你" ,
    -5,
    -2,
    3,
)

createText(
    " أحبك" ,
    -10,
    4,
    3,
)

createText(
    " Я тебя люблю" ,
    -14,
    -4,
    0,
)

createText(
    " Σ’ αγαπώ" ,
    8,
    3,
    -1,
)

createText(
    "Seni seviyorum" ,
    -5,
    0                                          ,
    6,
)

createText(
    "Ik hou van jou" ,
    8,
    7,
    5,
)

createText(
    "TE AMO" ,
    -7,
    7,
    -5,
)

// =====================================
// ANIMACIONES
// =====================================

gsap.from(
  core.scale,
  {

    x: 0,
    y: 0,
    z: 0,

    duration: 1.5,

    ease: "back.out(2)"

  }
);


// =====================================
// ANIMACIÓN
// =====================================

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );


  const time =
    clock.getElapsedTime();


  // Partículas

  particles.rotation.y =
    time * 0.008;


  // Anillo

  ring.rotation.z =
    time * 0.3;


  // Esfera

  core.position.y =
    1 +
    Math.sin(time * 1.5) *
    0.12;


  core.scale.setScalar(

    1 +
    Math.sin(time * 2) *
    0.04

  );


  // Luz

  light.intensity =
    10 +
    Math.sin(time * 2) *
    2;


  // Controles

  controls.update();


  renderer.render(
    scene,
    camera
  );


  labelRenderer.render(
    scene,
    camera
  );

}


animate();


// =====================================
// RESIZE
// =====================================

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    labelRenderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


// =====================================
// QUITAR CARGANDO
// =====================================

loading.classList.add(
  "hidden"
);

setTimeout(() => {

  loading.remove();

}, 700);