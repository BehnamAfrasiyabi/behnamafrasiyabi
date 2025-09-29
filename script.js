// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    document.body.classList.add('scrolled');
  } else {
    document.body.classList.remove('scrolled');
  }
});

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    });
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

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
      document.body.style.overflow = 'hidden';
    });
  });

  if (imageCloseBtn) {
    imageCloseBtn.onclick = () => {
      imageModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    };
  }

  // 3D Viewer Modal
  const modal3d = document.getElementById('3dModal');
  const close3dBtn = modal3d.querySelector('.close');
  const modelContainer = document.getElementById('modelContainer');

  document.querySelectorAll('.view-3d-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modelPath = btn.getAttribute('data-model');
      open3DViewer(modelPath);
    });
  });

  if (close3dBtn) {
    close3dBtn.onclick = () => {
      modal3d.style.display = 'none';
      document.body.style.overflow = 'auto';
      clearModelViewer();
    };
  }

  // Modal close events
  setupModalEvents();
});

// Setup modal close events
function setupModalEvents() {
  const imageModal = document.getElementById('imageModal');
  const modal3d = document.getElementById('3dModal');

  window.addEventListener('click', (event) => {
    if (event.target === imageModal) {
      imageModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
    if (event.target === modal3d) {
      modal3d.style.display = 'none';
      document.body.style.overflow = 'auto';
      clearModelViewer();
    }
  });

  // Close modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      imageModal.style.display = 'none';
      modal3d.style.display = 'none';
      document.body.style.overflow = 'auto';
      clearModelViewer();
    }
  });
}

// Open 3D Viewer with model-viewer component
function open3DViewer(modelPath) {
  const modal3d = document.getElementById('3dModal');
  const modelContainer = document.getElementById('modelContainer');
  
  // Show loading state
  modelContainer.innerHTML = '<div class="loading">Loading 3D Model...</div>';
  
  // Show modal
  modal3d.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Create model-viewer element after a short delay to ensure DOM is ready
  setTimeout(() => {
    modelContainer.innerHTML = `
      <model-viewer 
        src="${modelPath}"
        alt="3D Model"
        ar
        environment-image="neutral"
        poster=""
        shadow-intensity="1"
        camera-controls
        touch-action="pan-y"
        auto-rotate
        camera-orbit="45deg 55deg 2.5m"
      >
        <div class="progress-bar hide" slot="progress-bar">
          <div class="update-bar"></div>
        </div>
      </model-viewer>
    `;
  }, 100);
}

// Clear model viewer
function clearModelViewer() {
  const modelContainer = document.getElementById('modelContainer');
  modelContainer.innerHTML = '<div class="loading">Loading 3D Model...</div>';
}

// Lazy loading for models
const modelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Preload models when projects section is in view
      preloadModels();
      modelObserver.disconnect();
    }
  });
});

// Start observing when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const projectsSection = document.querySelector('.projects');
  if (projectsSection) {
    modelObserver.observe(projectsSection);
  }
});

// Preload models for better performance
function preloadModels() {
  const models = [
    'models/T-Sim200V3.glb',
    'models/iot-modules.glb',
    'models/sensor-tester.glb',
    'models/smart-home.glb'
  ];
  
  models.forEach(modelPath => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.href = modelPath;
    document.head.appendChild(link);
  });
}
