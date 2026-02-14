/* slider */
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
// Generic Transform Carousel
// Works for categories + each products section
// =============================
function setupTransformCarousel({
    viewport,
    track,
    itemSelector,
    prevBtn,
    nextBtn,
}) {
    if (!viewport || !track || !prevBtn || !nextBtn) return;

    let index = 0;
    let step = 0;
    let maxIndex = 0;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    function recalc() {
        const first = track.querySelector(itemSelector);
        if (!first) return;

        const itemRect = first.getBoundingClientRect();
        const gap = parseFloat(getComputedStyle(track).gap) || 0;

        step = itemRect.width + gap;

        const visible = Math.max(1, Math.round(viewport.clientWidth / step));
        const total = track.children.length;

        maxIndex = Math.max(0, total - visible);
        index = clamp(index, 0, maxIndex);

        apply();
    }

    function apply() {
        track.style.transform = `translateX(${-index * step}px)`;

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

    window.addEventListener("resize", recalc);
    window.addEventListener("load", recalc);
    recalc();
}

/* Categories */
setupTransformCarousel({
    viewport: document.querySelector(".categories-carousel"),
    track: document.querySelector(".categories-row"),
    itemSelector: ".category-card",
    prevBtn: document.querySelector(".cat-arrow.prev"),
    nextBtn: document.querySelector(".cat-arrow.next"),
});

/* Products (multiple sections) */
document.querySelectorAll(".products").forEach((section) => {
    setupTransformCarousel({
        viewport: section.querySelector(".products-carousel"),
        track: section.querySelector(".products__grid"),
        itemSelector: ".p-card",
        prevBtn: section.querySelector(".p-arrow.prev"),
        nextBtn: section.querySelector(".p-arrow.next"),
    });
});

/* Accessibility: burger menu improvements */
const header = document.querySelector(".site-header");
const burger = document.querySelector(".burger");
const nav = document.querySelector("#mainNav");

function openMenu() {
    header.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
}

function closeMenu() {
    header.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
    header.classList.contains("is-open") ? closeMenu() : openMenu();
}

burger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
});

/* outside click (backdrop / გვერდით კლიკი) */
document.addEventListener("click", (e) => {
    if (!header.classList.contains("is-open")) return;
    const clickedInside = header.contains(e.target);
    if (!clickedInside) closeMenu();
});

/* თუ მენიუში ლინკზე დააკლიკე — დაიხუროს */
nav.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) closeMenu();
});

/* ESC დახურვა */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
});
