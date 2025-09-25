// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    document.body.classList.add('scrolled');
  } else {
    document.body.classList.remove('scrolled');
  }
});

// Three.js variables
let scene, camera, renderer, model, controls;

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          hamburger.classList.remove('active');
        }
      }
    });
  });

  // Image Modal
  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const imageCloseBtn = imageModal.querySelector('.close');

  document.querySelectorAll('.project-image-trigger, .cert-image img').forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      imageModal.style.display = 'block';
    });
  });

  if (imageCloseBtn) {
    imageCloseBtn.onclick = () => {
      imageModal.style.display = 'none';
    };
  }

  window.onclick = (event) => {
    if (event.target === imageModal) {
      imageModal.style.display = 'none';
    }
  });

  // 3D Viewer Modal
  const modal3d = document.getElementById('3dModal');
  const close3dBtn = modal3d.querySelector('.close');

  document.querySelectorAll('.view-3d-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modelPath = btn.getAttribute('data-model');
      init3DViewer(modelPath);
      modal3d.style.display = 'block';
    });
  });

  if (close3dBtn) {
    close3dBtn.onclick = () => {
      modal3d.style.display = 'none';
      dispose3DViewer();
    };
  }

  window.onclick = (event) => {
    if (event.target === modal3d) {
      modal3d.style.display = 'none';
      dispose3DViewer();
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      imageModal.style.display = 'none';
      modal3d.style.display = 'none';
      dispose3DViewer();
    }
  });
});

function init3DViewer(modelPath) {
  dispose3DViewer();

  const container = document.getElementById('3dViewer');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(5, 5, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js';
  script.onload = () => {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2;

    const loader = new THREE.GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        model = gltf.scene;
        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.5;
        camera.position.z = cameraZ;
        camera.position.x = cameraZ / 2;
        camera.position.y = cameraZ / 2;
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();
      },
      undefined,
      (error) => {
        console.error('Error loading 3D model:', error);
      }
    );
  };
  document.head.appendChild(script);

  window.addEventListener('resize', onWindowResize);
  animate();
}

function onWindowResize() {
  if (!camera || !renderer) return;
  const container = document.getElementById('3dViewer');
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  if (!renderer) return;
  requestAnimationFrame(animate);
  if (controls) controls.update();
  renderer.render(scene, camera);
}

function dispose3DViewer() {
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
  if (scene) {
    scene = null;
  }
  if (camera) {
    camera = null;
  }
  if (model) {
    model = null;
  }
  if (controls) {
    controls.dispose();
    controls = null;
  }
  const container = document.getElementById('3dViewer');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  window.removeEventListener('resize', onWindowResize);
}
