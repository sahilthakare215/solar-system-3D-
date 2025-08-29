import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

// initialize pane
const pane = new Pane();

// Comet controls
const cometFolder = pane.addFolder({ title: 'Comets' });
const cometControls = {
  showComets: true,
  showCometOrbits: false,
  showCometTrails: true,
  cometSpeed: 1.0,
  trailLength: 50
};

cometFolder.addBinding(cometControls, 'showComets').on('change', (ev) => {
  cometOrbitGroups.forEach((cometObj) => {
    cometObj.cometMesh.visible = ev.value;
  });
});

cometFolder.addBinding(cometControls, 'showCometOrbits').on('change', (ev) => {
  cometOrbitLines.forEach((orbitLine) => {
    orbitLine.visible = ev.value;
  });
});

cometFolder.addBinding(cometControls, 'showCometTrails').on('change', (ev) => {
  cometOrbitGroups.forEach((cometObj) => {
    cometObj.trail.visible = ev.value;
  });
});

cometFolder.addBinding(cometControls, 'cometSpeed', {
  min: 0.1,
  max: 3.0,
  step: 0.1
});

cometFolder.addBinding(cometControls, 'trailLength', {
  min: 10,
  max: 100,
  step: 5
}).on('change', (ev) => {
  comets.forEach((comet, index) => {
    comet.trailLength = ev.value;
    // Update the trail geometry for existing comets
    if (cometOrbitGroups[index]) {
      const trailGeometry = cometOrbitGroups[index].trail.geometry;
      const newPositions = new Float32Array(ev.value * 3);
      const newColors = new Float32Array(ev.value * 4);

      // Initialize with current positions if available
      const currentPositions = cometOrbitGroups[index].trailPositions;
      for (let i = 0; i < Math.min(ev.value, currentPositions.length); i++) {
        const pos = currentPositions[i];
        newPositions[i * 3] = pos.x;
        newPositions[i * 3 + 1] = pos.y;
        newPositions[i * 3 + 2] = pos.z;
      }

      // Fill remaining positions with zeros
      for (let i = currentPositions.length; i < ev.value; i++) {
        newPositions[i * 3] = 0;
        newPositions[i * 3 + 1] = 0;
        newPositions[i * 3 + 2] = 0;
      }

      // Update colors
      for (let i = 0; i < ev.value; i++) {
        const t = i / ev.value;
        const alpha = 1 - t;
        newColors[i * 4] = ((comet.trailColor >> 16) & 0xff) / 255;
        newColors[i * 4 + 1] = ((comet.trailColor >> 8) & 0xff) / 255;
        newColors[i * 4 + 2] = (comet.trailColor & 0xff) / 255;
        newColors[i * 4 + 3] = alpha;
      }

      trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
      trailGeometry.setAttribute('color', new THREE.Float32BufferAttribute(newColors, 4));
    }
  });
});

// initialize the scene
const scene = new THREE.Scene();

// add textureLoader
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath('/texture/')


// adding textures
const sunTexture = textureLoader.load("/texture/2k_sun.jpg");
sunTexture.colorSpace = THREE.SRGBColorSpace  
const mercuryTexture = textureLoader.load("/texture/2k_mercury.jpg");
mercuryTexture.colorSpace = THREE.SRGBColorSpace
const venusTexture = textureLoader.load("/texture/2k_venus_surface.jpg");
venusTexture.colorSpace = THREE.SRGBColorSpace
const earthTexture = textureLoader.load("/texture/2k_earth_daymap.jpg");
earthTexture.colorSpace = THREE.SRGBColorSpace
const marsTexture = textureLoader.load("/texture/2k_mars.jpg");
marsTexture.colorSpace = THREE.SRGBColorSpace
const moonTexture = textureLoader.load("/texture/2k_moon.jpg");
moonTexture.colorSpace = THREE.SRGBColorSpace
const jupiterTexture = textureLoader.load("/texture/2k_earth_daymap.jpg"); // Replace with Jupiter texture
jupiterTexture.colorSpace = THREE.SRGBColorSpace
const saturnTexture = textureLoader.load("/texture/2k_venus_surface.jpg"); // Replace with Saturn texture
saturnTexture.colorSpace = THREE.SRGBColorSpace
const uranusTexture = textureLoader.load("/texture/2k_mars.jpg"); // Replace with Uranus texture
uranusTexture.colorSpace = THREE.SRGBColorSpace
const neptuneTexture = textureLoader.load("/texture/2k_mercury.jpg"); // Replace with Neptune texture
neptuneTexture.colorSpace = THREE.SRGBColorSpace

const backgroundCubemap = cubeTextureLoader
.load( [
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png'
] );

scene.background = backgroundCubemap


// Add procedural star field (sharper stars)
const starGeometry = new THREE.BufferGeometry();
const starCount = 3000;
const positions = [];

for (let i = 0; i < starCount; i++) {
  const r = 400 + Math.random() * 400; // farther distance
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * Math.random() - 1);
  positions.push(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));


// Create a sharp white dot texture for stars
const starCanvas = document.createElement('canvas');
starCanvas.width = 16;
starCanvas.height = 16;
const ctx = starCanvas.getContext('2d');
ctx.beginPath();
ctx.arc(8, 8, 7, 0, 2 * Math.PI);
ctx.fillStyle = 'white';
ctx.fill();
const starTexture = new THREE.CanvasTexture(starCanvas);

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.2,
  map: starTexture,
  sizeAttenuation: false,
  transparent: true,
  alphaTest: 0.8
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);


// add materials
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const jupiterMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 }); // Orange for Jupiter
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });

// add stuff here
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});


const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);


const planets = [
  {
    name: "Mercury",
    radius: 0.4,
    distance: 10,
  speed: 0.12, // 0.24 years (halved)
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.7,
    distance: 14,
  speed: 0.08, // 0.62 years (halved)
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 0.8,
    distance: 18,
  speed: 0.05, // 1.00 year (halved)
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.2,
        distance: 2,
        speed: 0.08, // 27 days
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.6,
    distance: 22,
  speed: 0.04, // 1.88 years (halved)
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 1,
        speed: 0.12,
      },
      {
        name: "Deimos",
        radius: 0.1,
        distance: 2,
        speed: 0.09,
        color: 0xffffff,
      },
    ],
  },
  {
    name: "Jupiter",
    radius: 1.5,
    distance: 28,
  speed: 0.02, // 11.86 years (halved)
    material: jupiterMaterial,
    moons: [],
  },
  {
    name: "Saturn",
    radius: 1.2,
    distance: 34,
  speed: 0.015, // 29.46 years (halved)
    material: saturnMaterial,
    moons: [],
  },
  {
    name: "Uranus",
    radius: 0.9,
    distance: 40,
  speed: 0.01, // 84.01 years (halved)
    material: uranusMaterial,
    moons: [],
  },
  {
    name: "Neptune",
    radius: 0.8,
    distance: 46,
  speed: 0.005, // 164.8 years (halved)
    material: neptuneMaterial,
    moons: [],
  },
];

// Comet data structure
const comets = [
  {
    name: "Halley's Comet",
    radius: 0.3,
    semiMajorAxis: 35, // Much larger than planets
    eccentricity: 0.967, // Highly elliptical
    inclination: 0.2, // Slight inclination
    speed: 0.008,
    material: new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 0.8,
      metalness: 0.1
    }),
    trailLength: 50,
    trailColor: 0x87CEEB
  },
  {
    name: "Comet Hale-Bopp",
    radius: 0.4,
    semiMajorAxis: 45,
    eccentricity: 0.995,
    inclination: 0.15,
    speed: 0.006,
    material: new THREE.MeshStandardMaterial({
      color: 0x654321,
      roughness: 0.9,
      metalness: 0.05
    }),
    trailLength: 60,
    trailColor: 0xFFFFFF
  },
  {
    name: "Comet Encke",
    radius: 0.2,
    semiMajorAxis: 25,
    eccentricity: 0.848,
    inclination: 0.1,
    speed: 0.012,
    material: new THREE.MeshStandardMaterial({
      color: 0x2F4F4F,
      roughness: 0.7,
      metalness: 0.2
    }),
    trailLength: 30,
    trailColor: 0xFFD700
  },
  {
    name: "Comet Tempel-Tuttle",
    radius: 0.25,
    semiMajorAxis: 40,
    eccentricity: 0.906,
    inclination: 0.3,
    speed: 0.009,
    material: new THREE.MeshStandardMaterial({
      color: 0x4B0082,
      roughness: 0.85,
      metalness: 0.15
    }),
    trailLength: 45,
    trailColor: 0xFF69B4
  },
  {
    name: "Comet Swift-Tuttle",
    radius: 0.35,
    semiMajorAxis: 50,
    eccentricity: 0.963,
    inclination: 0.25,
    speed: 0.007,
    material: new THREE.MeshStandardMaterial({
      color: 0x228B22,
      roughness: 0.75,
      metalness: 0.2
    }),
    trailLength: 70,
    trailColor: 0x32CD32
  },
  {
    name: "Comet Borrelly",
    radius: 0.28,
    semiMajorAxis: 30,
    eccentricity: 0.623,
    inclination: 0.18,
    speed: 0.011,
    material: new THREE.MeshStandardMaterial({
      color: 0x8B0000,
      roughness: 0.9,
      metalness: 0.1
    }),
    trailLength: 40,
    trailColor: 0xFF4500
  },
  {
    name: "Comet Wild 2",
    radius: 0.22,
    semiMajorAxis: 38,
    eccentricity: 0.540,
    inclination: 0.12,
    speed: 0.010,
    material: new THREE.MeshStandardMaterial({
      color: 0x4169E1,
      roughness: 0.8,
      metalness: 0.25
    }),
    trailLength: 35,
    trailColor: 0x1E90FF
  },
  {
    name: "Comet Hartley 2",
    radius: 0.26,
    semiMajorAxis: 42,
    eccentricity: 0.694,
    inclination: 0.22,
    speed: 0.0085,
    material: new THREE.MeshStandardMaterial({
      color: 0xFF6347,
      roughness: 0.7,
      metalness: 0.3
    }),
    trailLength: 55,
    trailColor: 0xFFA07A
  }
];

const createPlanet = (planet) =>{
  const planetMesh = new THREE.Mesh(
    sphereGeometry,
    planet.material
  )
  planetMesh.scale.setScalar(planet.radius)
  planetMesh.position.x = planet.distance
  return planetMesh
}

const createMoon = (moon) =>{
  const moonMesh = new THREE.Mesh(
    sphereGeometry,
    moonMaterial
  )
  moonMesh.scale.setScalar(moon.radius)
  moonMesh.position.x = moon.distance
  return moonMesh
}

const createComet = (comet) => {
  // Create comet nucleus (irregular shape)
  const cometGeometry = new THREE.SphereGeometry(1, 16, 16);
  const cometMesh = new THREE.Mesh(cometGeometry, comet.material);
  cometMesh.scale.setScalar(comet.radius);

  // Create comet trail
  const trailGeometry = new THREE.BufferGeometry();
  const trailPositions = [];
  const trailColors = [];

  for (let i = 0; i < comet.trailLength; i++) {
    const t = i / comet.trailLength;
    const alpha = 1 - t; // Fade out along trail

    trailPositions.push(0, 0, 0); // Will be updated in render loop
    trailColors.push(
      ((comet.trailColor >> 16) & 0xff) / 255,
      ((comet.trailColor >> 8) & 0xff) / 255,
      (comet.trailColor & 0xff) / 255,
      alpha
    );
  }

  trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
  trailGeometry.setAttribute('color', new THREE.Float32BufferAttribute(trailColors, 4));

  const trailMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending
  });

  const trail = new THREE.Points(trailGeometry, trailMaterial);

  return { cometMesh, trail, trailPositions: [] };
}


// Add orbits
const orbitLines = [];
// Elliptical orbit parameters for each planet
const ellipseParams = [
  { a: 10, b: 8 },    // Mercury
  { a: 14, b: 12 },   // Venus
  { a: 18, b: 16 },   // Earth
  { a: 22, b: 19 },   // Mars
  { a: 28, b: 25 },   // Jupiter
  { a: 34, b: 30 },   // Saturn
  { a: 40, b: 36 },   // Uranus
  { a: 46, b: 41 }    // Neptune
];

planets.forEach((planet, i) => {
  const a = ellipseParams[i].a;
  const b = ellipseParams[i].b;
  const orbitSegments = 128;
  const orbitGeometry = new THREE.BufferGeometry();
  const orbitVertices = [];
  for (let j = 0; j <= orbitSegments; j++) {
    const theta = (j / orbitSegments) * 2 * Math.PI;
    orbitVertices.push(
      Math.cos(theta) * a,
      0,
      Math.sin(theta) * b
    );
  }
  orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitVertices, 3));
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
  scene.add(orbitLine);
  orbitLines.push(orbitLine);
});

// Add comet orbits
const cometOrbitLines = [];
comets.forEach((comet) => {
  const a = comet.semiMajorAxis;
  const b = a * Math.sqrt(1 - comet.eccentricity * comet.eccentricity);
  const orbitSegments = 128;
  const orbitGeometry = new THREE.BufferGeometry();
  const orbitVertices = [];
  for (let j = 0; j <= orbitSegments; j++) {
    const theta = (j / orbitSegments) * 2 * Math.PI;
    orbitVertices.push(
      Math.cos(theta) * a,
      Math.sin(theta) * b * Math.sin(comet.inclination),
      Math.sin(theta) * b * Math.cos(comet.inclination)
    );
  }
  orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitVertices, 3));
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x444444, opacity: 0.5, transparent: true });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
  orbitLine.visible = false; // Hide by default
  scene.add(orbitLine);
  cometOrbitLines.push(orbitLine);
});

// Create planet and moon systems with revolution and self-rotation
// Store planet meshes and revolution angles
const planetOrbitGroups = planets.map((planet) => {
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);
  planet.moons.forEach((moon) => {
    const moonOrbitGroup = new THREE.Object3D();
    const moonMesh = createMoon(moon);
    moonOrbitGroup.add(moonMesh);
    planetMesh.add(moonOrbitGroup);
  });
  return { planetMesh, angle: Math.random() * Math.PI * 2, moons: planet.moons };
});

// Create comet systems with elliptical orbits
const cometOrbitGroups = comets.map((comet) => {
  const { cometMesh, trail } = createComet(comet);
  scene.add(cometMesh);
  scene.add(trail);
  return {
    cometMesh,
    trail,
    angle: Math.random() * Math.PI * 2,
    trailPositions: []
  };
});

console.log(planetOrbitGroups)


// add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 5000, 1000);
pointLight.position.set(0, 0, 0); // At sun
scene.add(pointLight);
sun.add(pointLight); // Attach to sun
 
// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20;

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// render loop
const renderloop = () => {
  planetOrbitGroups.forEach((planetObj, planetIndex) => {
    // Elliptical revolution (orbit around sun)
    planetObj.angle += planets[planetIndex].speed;
    const a = ellipseParams[planetIndex].a;
    const b = ellipseParams[planetIndex].b;
    planetObj.planetMesh.position.x = Math.cos(planetObj.angle) * a;
    planetObj.planetMesh.position.z = Math.sin(planetObj.angle) * b;
    // Self-rotation (spin)
    planetObj.planetMesh.rotation.y += 0.03;
    // Moons
    planetObj.planetMesh.children.forEach((moonOrbitGroup, moonIndex) => {
      moonOrbitGroup.rotation.y += planets[planetIndex].moons[moonIndex].speed;
      moonOrbitGroup.children[0].rotation.y += 0.05;
    });
  });

  // Update comets
  cometOrbitGroups.forEach((cometObj, cometIndex) => {
    const comet = comets[cometIndex];
    const a = comet.semiMajorAxis;
    const b = a * Math.sqrt(1 - comet.eccentricity * comet.eccentricity);

    // Update comet position
    cometObj.angle += comet.speed * cometControls.cometSpeed;
    cometObj.cometMesh.position.x = Math.cos(cometObj.angle) * a;
    cometObj.cometMesh.position.y = Math.sin(cometObj.angle) * b * Math.sin(comet.inclination);
    cometObj.cometMesh.position.z = Math.sin(cometObj.angle) * b * Math.cos(comet.inclination);

    // Self-rotation
    cometObj.cometMesh.rotation.y += 0.05;

    // Update comet trail
    cometObj.trailPositions.unshift({
      x: cometObj.cometMesh.position.x,
      y: cometObj.cometMesh.position.y,
      z: cometObj.cometMesh.position.z
    });

    // Keep trail at specified length
    if (cometObj.trailPositions.length > comet.trailLength) {
      cometObj.trailPositions = cometObj.trailPositions.slice(0, comet.trailLength);
    }

    // Update trail geometry
    const trailGeometry = cometObj.trail.geometry;
    const positionAttribute = trailGeometry.attributes.position;
    const colorAttribute = trailGeometry.attributes.color;

    // Update positions
    for (let i = 0; i < comet.trailLength; i++) {
      if (i < cometObj.trailPositions.length) {
        const pos = cometObj.trailPositions[i];
        positionAttribute.array[i * 3] = pos.x;
        positionAttribute.array[i * 3 + 1] = pos.y;
        positionAttribute.array[i * 3 + 2] = pos.z;
      } else {
        // Fill remaining positions with zeros
        positionAttribute.array[i * 3] = 0;
        positionAttribute.array[i * 3 + 1] = 0;
        positionAttribute.array[i * 3 + 2] = 0;
      }
    }

    // Update colors
    for (let i = 0; i < comet.trailLength; i++) {
      const t = i / comet.trailLength;
      const alpha = 1 - t;
      colorAttribute.array[i * 4] = ((comet.trailColor >> 16) & 0xff) / 255;
      colorAttribute.array[i * 4 + 1] = ((comet.trailColor >> 8) & 0xff) / 255;
      colorAttribute.array[i * 4 + 2] = (comet.trailColor & 0xff) / 255;
      colorAttribute.array[i * 4 + 3] = alpha;
    }

    positionAttribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;
  });

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();




