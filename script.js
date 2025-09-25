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
        
        // Close mobile menu
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          hamburger.classList.remove('active');
        }
      }
    });
  });

  // Certificate Modal
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.close');
  const certImages = document.querySelectorAll('.cert-image img');

  certImages.forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = 'block';
      modalImg.src = img.src;
      modalImg.alt = img.alt;
    });
  });

  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = 'none';
    };
  }

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
    }
  });
});
