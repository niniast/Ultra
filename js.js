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
