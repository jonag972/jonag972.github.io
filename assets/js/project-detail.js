document.addEventListener('DOMContentLoaded', function () {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    let currentImageIndex;
    let images = [];

    // Collect all images from swiper slides
    const swiperSlides = document.querySelectorAll('.swiper-slide img');
    swiperSlides.forEach((img, index) => {
        images.push(img.src);
        img.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImage.src = images[currentImageIndex];
        lightbox.style.display = 'flex'; // Use flex for centering
        updateNavButtons();
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentImageIndex];
        updateNavButtons();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImage.src = images[currentImageIndex];
        updateNavButtons();
    }

    function updateNavButtons() {
        if (images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevImage);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', showNextImage);
    }

    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    // Initialize Swiper if it's used on the page
    if (typeof Swiper !== 'undefined') {
        new Swiper('.project-carousel', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination', // Make sure you have this element in your HTML or remove this line
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next', // Make sure you have these elements in your HTML or remove/comment out
                prevEl: '.swiper-button-prev', // Make sure you have these elements in your HTML or remove/comment out
            },
            breakpoints: {
                // when window width is >= 768px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                // when window width is >= 1024px
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 40
                }
            }
        });
    }
});