// Project Detail Interactive Components
class ProjectDetailInteractive {
    constructor() {
        this.lightbox = null;
        this.lightboxImage = null;
        this.closeBtn = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.currentImageIndex = 0;
        this.images = [];
        this.swiper = null;
    }

    // Initialize all interactive components
    init() {
        this.initializeLightboxElements();
        this.initializeLightboxEvents();
        this.collectImages();
        this.initializeSwiper();
    }

    // Initialize lightbox DOM elements
    initializeLightboxElements() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.closeBtn = document.querySelector('.lightbox-close');
        this.prevBtn = document.querySelector('.lightbox-prev');
        this.nextBtn = document.querySelector('.lightbox-next');
    }

    // Initialize lightbox event listeners
    initializeLightboxEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeLightbox());
        }
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.showPrevImage());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.showNextImage());
        }

        if (this.lightbox) {
            this.lightbox.addEventListener('click', (event) => {
                if (event.target === this.lightbox) {
                    this.closeLightbox();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (this.lightbox && this.lightbox.style.display === 'flex') {
                if (e.key === 'Escape') {
                    this.closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    this.showPrevImage();
                } else if (e.key === 'ArrowRight') {
                    this.showNextImage();
                }
            }
        });
    }

    // Collect all images from swiper slides
    collectImages() {
        this.images = [];
        const swiperSlides = document.querySelectorAll('.swiper-slide img');
        swiperSlides.forEach((img, index) => {
            this.images.push(img.src);
            img.addEventListener('click', () => {
                this.openLightbox(index);
            });
        });
    }

    // Open lightbox with specific image
    openLightbox(index) {
        this.currentImageIndex = index;
        if (this.lightboxImage && this.images[this.currentImageIndex]) {
            this.lightboxImage.src = this.images[this.currentImageIndex];
            this.lightbox.style.display = 'flex';
            this.updateNavButtons();
        }
    }

    // Close lightbox
    closeLightbox() {
        if (this.lightbox) {
            this.lightbox.style.display = 'none';
        }
    }

    // Show previous image
    showPrevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        if (this.lightboxImage) {
            this.lightboxImage.src = this.images[this.currentImageIndex];
            this.updateNavButtons();
        }
    }

    // Show next image
    showNextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        if (this.lightboxImage) {
            this.lightboxImage.src = this.images[this.currentImageIndex];
            this.updateNavButtons();
        }
    }

    // Update navigation buttons visibility
    updateNavButtons() {
        if (this.images.length <= 1) {
            if (this.prevBtn) this.prevBtn.style.display = 'none';
            if (this.nextBtn) this.nextBtn.style.display = 'none';
        } else {
            if (this.prevBtn) this.prevBtn.style.display = 'block';
            if (this.nextBtn) this.nextBtn.style.display = 'block';
        }
    }

    // Initialize Swiper carousel
    initializeSwiper() {
        if (typeof Swiper !== 'undefined') {
            this.swiper = new Swiper('.project-carousel', {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 20,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 40
                    }
                }
            });
        }
    }

    // Reinitialize after dynamic content is loaded
    reinitialize() {
        this.collectImages();
        if (this.swiper) {
            this.swiper.update();
        }
    }
}

// Global instance for external access
let projectDetailInteractive;

// Initialize when DOM is loaded (for static project pages)
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're not on the dynamic project detail page
    if (!window.location.search.includes('project=')) {
        projectDetailInteractive = new ProjectDetailInteractive();
        projectDetailInteractive.init();
    }
});