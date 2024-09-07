document.addEventListener("DOMContentLoaded", function() {
    const lazyImages = document.querySelectorAll("img.lazy");
  
    const lazyLoad = (image) => {
      image.src = image.dataset.src;
      image.classList.remove('lazy');
    };
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          lazyLoad(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
  
    lazyImages.forEach(image => observer.observe(image));
  });
  