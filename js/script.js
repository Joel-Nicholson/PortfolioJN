const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');

// open an image
document.querySelectorAll('.view-img').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        lightboxImg.src = this.dataset.img;
        lightboxImg.classList.add('show');
        lightbox.classList.add('open', 'img-mode');
        resetZoom();
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
    lightbox.classList.remove('open', 'img-mode');
    lightboxImg.classList.remove('show');
    resetZoom();
    lightboxVideo.classList.remove('show');

    lightboxVideo.pause();               // stop sound
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();                // fully resets the player
}

// close when clicking the X or dark background (not the image/video)
lightbox.addEventListener('click', function (e) {
    if (e.target.closest('.zoom-controls')) return;      // zoom buttons shouldn't close it
    if (e.target !== lightboxImg && e.target !== lightboxVideo) closeLightbox();
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
});


/* ===== IMAGE ZOOM (lightbox) ===== */
let zoom = 1, panX = 0, panY = 0;
let dragging = false, moved = false, startX = 0, startY = 0;
const MIN_ZOOM = 1, MAX_ZOOM = 4;

function applyZoom() {
    lightboxImg.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + zoom + ')';
    lightboxImg.classList.toggle('zoomed', zoom > 1);
}

function setZoom(z) {
    zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
    if (zoom === 1) { panX = 0; panY = 0; }   // back to centered
    applyZoom();
}

function resetZoom() {
    zoom = 1; panX = 0; panY = 0;
    lightboxImg.style.transform = '';
    lightboxImg.classList.remove('zoomed', 'dragging');
}

// + / - buttons
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
if (zoomInBtn) zoomInBtn.addEventListener('click', () => setZoom(zoom + 0.5));
if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setZoom(zoom - 0.5));

// click image to toggle zoom in / out
lightboxImg.addEventListener('click', function () {
    if (moved) { moved = false; return; }   // it was a drag, not a click
    setZoom(zoom > 1 ? 1 : 2);
});

// mouse wheel / trackpad zoom
lightbox.addEventListener('wheel', function (e) {
    if (!lightbox.classList.contains('img-mode')) return;
    e.preventDefault();
    setZoom(zoom - e.deltaY * 0.002);
}, { passive: false });

// drag to move around when zoomed in
lightboxImg.addEventListener('pointerdown', function (e) {
    if (zoom <= 1) return;
    dragging = true; moved = false;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    lightboxImg.setPointerCapture(e.pointerId);
    lightboxImg.classList.add('dragging');
});
lightboxImg.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    const nx = e.clientX - startX, ny = e.clientY - startY;
    if (Math.abs(nx - panX) + Math.abs(ny - panY) > 2) moved = true;
    panX = nx; panY = ny;
    applyZoom();
});
function stopDrag() { dragging = false; lightboxImg.classList.remove('dragging'); }
lightboxImg.addEventListener('pointerup', stopDrag);
lightboxImg.addEventListener('pointercancel', stopDrag);

// keyboard: + and - also zoom
document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('img-mode')) return;
    if (e.key === '+' || e.key === '=') setZoom(zoom + 0.5);
    if (e.key === '-') setZoom(zoom - 0.5);
});