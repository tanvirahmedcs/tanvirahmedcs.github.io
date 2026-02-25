// ========================================
// PROFESSIONAL PORTFOLIO ANIMATIONS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  
  // Set current year
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Initialize all animations
  initScrollAnimations();
  initCounterAnimation();
  initNavigation();
  initMobileMenu();
  initFormValidation();
  initBannerSlider();
  initReviewSlider();
  
});

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Add stagger effect to child elements
        const children = entry.target.querySelectorAll('.scroll-animate');
        children.forEach((child, index) => {
          child.style.transitionDelay = `${index * 0.1}s`;
        });
      }
    });
  }, observerOptions);

  // Observe all panels and cards
  document.querySelectorAll('.panel, .card, .about-card, .testimonial-card, .info-card').forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
}

// ========================================
// COUNTER ANIMATION
// ========================================

function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + '+';
        }
      };

      updateCounter();
    });
  };

  // Trigger counter animation when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroObserver.observe(heroSection);
  }
}

// ========================================
// NAVIGATION
// ========================================

function initNavigation() {
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add background on scroll
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// ========================================
// MOBILE MENU
// ========================================

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
      });
    });
  }
}

// ========================================
// FORM VALIDATION
// ========================================

function initFormValidation() {
  const form = document.getElementById('contactForm');
  
  if (form) {
    form.addEventListener('submit', submitForm);
    
    // Real-time validation feedback
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          validateField(this);
        }
      });
    });
  }
}

function validateField(field) {
  const value = field.value.trim();
  
  if (field.hasAttribute('required') && !value) {
    field.classList.add('error');
    field.classList.remove('valid');
    return false;
  }
  
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      field.classList.add('error');
      field.classList.remove('valid');
      return false;
    }
  }
  
  if (field.type === 'url' && value) {
    try {
      new URL(value);
      field.classList.remove('error');
      field.classList.add('valid');
      return true;
    } catch {
      field.classList.add('error');
      field.classList.remove('valid');
      return false;
    }
  }
  
  field.classList.remove('error');
  field.classList.add('valid');
  return true;
}

function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const website = form.website.value.trim();
  const issue = form.issue.value;
  const message = form.message.value.trim();

  // Validate required fields
  if (!name || !email) {
    showNotification('Please provide your name and email.', 'error');
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Please enter a valid email address.', 'error');
    return false;
  }

  // Website validation (if provided)
  if (website) {
    try {
      new URL(website);
    } catch {
      showNotification('Please enter a valid website URL.', 'error');
      return false;
    }
  }

  // Show success message
  const successMessage = `
    Thank you, ${name}!
    
    I've received your request for ${issue}.
    ${website ? `Website: ${website}` : ''}
    ${message ? `Message: ${message}` : ''}
    
    I'll respond to ${email} within 24 hours.
  `;

  alert(successMessage);
  form.reset();
  
  // Remove validation classes
  form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
  
  return false;
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'error' ? '#ef4444' : '#00d4ff'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// ========================================
// BANNER SLIDER
// ========================================

function initBannerSlider() {
  const slides = document.querySelectorAll('.banner-slide');
  
  if (slides.length <= 1) return; // No need for slider with 1 slide
  
  let currentSlide = 0;
  
  const nextSlide = () => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  };
  
  // Auto-advance every 5 seconds
  setInterval(nextSlide, 5000);
}

// ========================================
// REVIEW SLIDER (Auto-changing)
// ========================================

function initReviewSlider() {
  const slides = document.querySelectorAll('.review-slide');
  const dots = document.querySelectorAll('.review-dot');
  
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  
  const goToSlide = (index) => {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  };
  
  // Add click handlers to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });
  
  // Auto-advance every 4 seconds
  const autoSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  };
  
  setInterval(autoSlide, 4000);
}

// ========================================
// PARALLAX EFFECT
// ========================================

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const orbs = document.querySelectorAll('.gradient-orb');
  
  orbs.forEach((orb, index) => {
    const speed = 0.05 * (index + 1);
    orb.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ========================================
// CURSOR FOLLOWER
// ========================================

document.addEventListener('mousemove', (e) => {
  const cursor = document.querySelector('.custom-cursor');
  
  if (!cursor) {
    const newCursor = document.createElement('div');
    newCursor.className = 'custom-cursor';
    newCursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border: 2px solid #00d4ff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(newCursor);
  }
  
  const newCursor = document.querySelector('.custom-cursor');
  newCursor.style.left = `${e.clientX - 10}px`;
  newCursor.style.top = `${e.clientY - 10}px`;
});

// ========================================
// ADD KEYFRAME ANIMATIONS VIA JS
// ========================================

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(0, 212, 255, 0.6);
    }
  }
  
  .site-header.scrolled {
    background: rgba(3, 7, 18, 0.95);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    .nav-links.mobile-open {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(3, 7, 18, 0.98);
      padding: 20px;
      border-bottom: 1px solid rgba(0, 212, 255, 0.1);
    }
    
    .mobile-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    
    .mobile-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  }
`;
document.head.appendChild(style);

