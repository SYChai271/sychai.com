(function () {
  "use strict";

  /**
   * Simple selector helper
   */
  const select = (el, all = false) => {
    el = el.trim();
    return all
      ? [...document.querySelectorAll(el)]
      : document.querySelector(el);
  };

  /**
   * Simple event‑binder helper
   */
  const on = (type, el, listener, all = false) => {
    let els = select(el, all);
    if (!els) return;
    if (all) els.forEach((e) => e.addEventListener(type, listener));
    else els.addEventListener(type, listener);
  };

  /**
   * Scroll helper
   */
  const onscroll = (el, listener) => el.addEventListener("scroll", listener);

  /**
   * Navbar link highlighting on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((link) => {
      if (!link.hash) return;
      let section = select(link.hash);
      if (!section) return;
      link.classList[
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
          ? "add"
          : "remove"
      ]("active");
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Smooth scroll to an element
   */
  const scrollto = (el) => {
    let offset = select(el).offsetTop - 36;
    window.scrollTo({ top: offset, behavior: "smooth" });
  };

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function () {
    document.body.classList.toggle("mobile-nav-active");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Smooth scroll on nav‑link clicks
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();
        if (document.body.classList.contains("mobile-nav-active")) {
          document.body.classList.remove("mobile-nav-active");
          let btn = select(".mobile-nav-toggle");
          btn.classList.toggle("bi-list");
          btn.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll on load if URL has hash
   */
  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  /**
   * Portfolio isotope & filters
   */
  window.addEventListener("load", () => {
    let container = select(".portfolio-container");
    if (container) {
      let iso = new Isotope(container, { itemSelector: ".portfolio-item" });
      let filters = select("#portfolio-filters li", true);
      on(
        "click",
        "#portfolio-filters li",
        function (e) {
          e.preventDefault();
          filters.forEach((el) => el.classList.remove("filter-active"));
          this.classList.add("filter-active");
          iso.arrange({ filter: this.getAttribute("data-filter") });
          iso.on("arrangeComplete", () => AOS.refresh());
        },
        true
      );
    }
  });

  /**
   * GLightbox
   */
  const portfolioLightbox = GLightbox({ selector: ".portfolio-lightbox" });

  /**
   * Swiper for details slider
   */
  new Swiper(".portfolio-details-slider", {
    speed: 400,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
  });

  /**
   * AOS init
   */
  window.addEventListener("load", () => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true, mirror: false });
  });

  function injectVideoSources() {
    if (!window.matchMedia("(min-width: 992px)").matches) return;
    document.querySelectorAll("video[data-src]").forEach((video) => {
      // skip if already injected
      if (video.querySelector("source")) return;

      const url = video.getAttribute("data-src");
      if (!url) return;

      // create and append <source>
      const src = document.createElement("source");
      src.src = url;
      src.type = "video/mp4";
      video.appendChild(src);

      // ensure autoplay, muted, loop
      video.autoplay = true;
      video.muted = true;
      video.loop = true;

      // load and play
      video.load();
      video.play().catch((err) => {
        console.warn("Video play was prevented:", err);
      });
    });
  }

  // run on initial load
  document.addEventListener("DOMContentLoaded", injectVideoSources);
  // re‑run on resize (desktop resize / rotate)
  window.addEventListener("resize", injectVideoSources);

  // also hook into GLightbox so lightbox videos autoplay too
  if (portfolioLightbox && typeof portfolioLightbox.on === "function") {
    portfolioLightbox.on("open", injectVideoSources);
    portfolioLightbox.on("slide_changed", injectVideoSources);
  }
})();
