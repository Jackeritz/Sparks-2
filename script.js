// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
          window.scrollTo({
              top: targetElement.offsetTop - 70, // Adjust 70 for navbar height
              behavior: 'smooth'
          });
      }
  });
});

// Fade-in Effect
const sections = document.querySelectorAll('section');

function checkVisibility() {
  sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const isVisible = (rect.top <= window.innerHeight) && (rect.bottom >= 0);

      if (isVisible) {
          section.classList.add('visible');
      } else {
          section.classList.remove('visible');
      }
  });
}

window.addEventListener('scroll', checkVisibility);
checkVisibility(); // Check on initial load
