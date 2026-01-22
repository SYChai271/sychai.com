(function () {
  "use strict";

  const select = (el, all = false) => {
    el = el.trim();
    return all
      ? [...document.querySelectorAll(el)]
      : document.querySelector(el);
  };

  const on = (type, el, listener, all = false) => {
    let els = select(el, all);
    if (!els) return;
    if (all) els.forEach((e) => e.addEventListener(type, listener));
    else els.addEventListener(type, listener);
  };

  const onscroll = (el, listener) => el.addEventListener("scroll", listener);

  let navbarlinks = select(".nav .nav__link, .nav--mobile .nav__link", true);
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

  const scrollto = (el) => {
    let offset = select(el).offsetTop - 36;
    window.scrollTo({ top: offset, behavior: "smooth" });
  };

  on("click", ".mobile-nav-toggle", function () {
    document.body.classList.toggle("mobile-nav-active");
    this.classList.toggle("bx-list");
    this.classList.toggle("bx-x");
  });


  const portfolioItems = select('.portfolio__card', true);
  if (portfolioItems) {
    portfolioItems.forEach(item => {
      item.addEventListener('click', function() {
        this.classList.toggle('mobile-active');
        
        portfolioItems.forEach(otherItem => {
          if (otherItem !== this) {
            otherItem.classList.remove('mobile-active');
          }
        });
      });
    });
  }

  on(
    "click",
    ".nav__link",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();
        if (document.body.classList.contains("mobile-nav-active")) {
          document.body.classList.remove("mobile-nav-active");
          let btn = select(".mobile-nav-toggle");
          btn.classList.toggle("bx-list");
          btn.classList.toggle("bx-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  window.addEventListener("load", () => {
    let container = select(".portfolio__grid");
    if (container) {
      let iso = new Isotope(container, { itemSelector: ".portfolio__item" });
      let filters = select(".portfolio__filters li", true);
      on(
        "click",
        ".portfolio__filters li",
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

  const portfolioLightbox = GLightbox({ selector: ".portfolio__lightbox" });

  new Swiper(".portfolio-details-slider", {
    speed: 400,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
  });

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

      video.autoplay = true;
      video.muted = true;
      video.loop = true;

      video.load();
      video.play().catch((err) => {
        console.warn("Video play was prevented:", err);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", injectVideoSources);
  window.addEventListener("resize", injectVideoSources);

  if (portfolioLightbox && typeof portfolioLightbox.on === "function") {
    portfolioLightbox.on("open", injectVideoSources);
    portfolioLightbox.on("slide_changed", injectVideoSources);
  }
})();
