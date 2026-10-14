const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');

// open an image
document.querySelectorAll('.view-img').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        lightboxImg.src = this.dataset.img;
        lightboxImg.classList.add('show');
        lightbox.classList.add('open');
    });
});

// open a video
document.querySelectorAll('.view-video').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        lightboxVideo.src = this.dataset.video;
        lightboxVideo.classList.add('show');
        lightbox.classList.add('open');
        lightboxVideo.play();
    });
});

function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.classList.remove('show');
    lightboxVideo.classList.remove('show');

    lightboxVideo.pause();               // stop sound
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();                // fully resets the player
}

// close when clicking the X or dark background (not the image/video)
lightbox.addEventListener('click', function (e) {
    if (e.target !== lightboxImg && e.target !== lightboxVideo) closeLightbox();
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
});