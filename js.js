/* burger menu */ const header = document.querySelector(".site-header");
const burger = document.querySelector(".burger");

burger?.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

/*slider */
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const nextBtn = document.querySelector(".slider__arrow--next");
    const prevBtn = document.querySelector(".slider__arrow--prev");

    let activeIndex = 0;

    function updateSlider() {
        slides.forEach((slide, index) =>
            slide.classList.toggle("is-active", index === activeIndex),
        );
        dots.forEach((dot, index) =>
            dot.classList.toggle("is-active", index === activeIndex),
        );
    }

    nextBtn?.addEventListener("click", () => {
        activeIndex = (activeIndex + 1) % slides.length;
        updateSlider();
    });

    prevBtn?.addEventListener("click", () => {
        activeIndex = (activeIndex - 1 + slides.length) % slides.length;
        updateSlider();
    });

    dots.forEach((dot, index) =>
        dot.addEventListener("click", () => {
            activeIndex = index;
            updateSlider();
        }),
    );
});

// =============================
// TOP Categories Carousel (Prev/Next)
// =============================
(() => {
    const track = document.querySelector(".categories-row");
    const viewport = document.querySelector(".categories-carousel");
    const prevBtn = document.querySelector(".cat-arrow.prev");
    const nextBtn = document.querySelector(".cat-arrow.next");

    if (!track || !viewport || !prevBtn || !nextBtn) return;

    let index = 0;
    let step = 0;
    let maxIndex = 0;

    function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }

    function recalc() {
        const first = track.querySelector(".category-card");
        if (!first) return;

        // 1 card width (including borders/padding)
        const cardRect = first.getBoundingClientRect();
        step = cardRect.width;

        // how many cards can fit in viewport
        const visible = Math.max(1, Math.round(viewport.clientWidth / step));

        const total = track.children.length;
        maxIndex = Math.max(0, total - visible);

        index = clamp(index, 0, maxIndex);
        apply();
    }

    function apply() {
        track.style.transform = `translateX(${-index * step}px)`;

        // optional: disable buttons on ends
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === maxIndex;
        prevBtn.style.opacity = prevBtn.disabled ? "0.4" : "1";
        nextBtn.style.opacity = nextBtn.disabled ? "0.4" : "1";
    }

    prevBtn.addEventListener("click", () => {
        index = clamp(index - 1, 0, maxIndex);
        apply();
    });

    nextBtn.addEventListener("click", () => {
        index = clamp(index + 1, 0, maxIndex);
        apply();
    });

    // drag/swipe (optional but nice)
    let isDown = false;
    let startX = 0;
    let startIndex = 0;

    viewport.addEventListener("pointerdown", (e) => {
        isDown = true;
        viewport.setPointerCapture(e.pointerId);
        startX = e.clientX;
        startIndex = index;
    });

    viewport.addEventListener("pointermove", (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        const moved = Math.round(-dx / step);
        index = clamp(startIndex + moved, 0, maxIndex);
        apply();
    });

    viewport.addEventListener("pointerup", () => (isDown = false));
    viewport.addEventListener("pointercancel", () => (isDown = false));

    // recalculation on resize + after images load
    window.addEventListener("resize", recalc);
    window.addEventListener("load", recalc);
    recalc();
})();
