(function () {
  const config = window.SiteConfig || {};

  function applyConfig() {
    if (config.browserTitle) document.title = config.browserTitle;
    document.querySelectorAll("[data-company]").forEach((node) => {
      node.textContent = config.companyName || "Flowline Gutters";
    });
    document.querySelectorAll("[data-email]").forEach((node) => {
      node.textContent = config.email || "";
      if (node.tagName === "A") node.href = "mailto:" + (config.email || "");
    });
    document.querySelectorAll("[data-disclaimer]").forEach((node) => {
      node.textContent = config.disclaimer || "";
    });
    document.querySelectorAll("[data-logo]").forEach((img) => {
      img.src = config.logo || "assets/icons/logo.svg";
    });
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon && config.favicon) favicon.href = config.favicon;
  }

  function initMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const close = document.querySelector("[data-menu-close]");
    const menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    };

    toggle.addEventListener("click", () => setOpen(true));
    if (close) close.addEventListener("click", () => setOpen(false));
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach((group) => {
      const items = Array.from(group.querySelectorAll(".faq-item"));
      items.forEach((item, index) => {
        const button = item.querySelector("button");
        const panel = item.querySelector(".faq-panel");
        if (!button || !panel) return;
        const open = index === 0;
        item.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
        panel.hidden = !open;
        button.addEventListener("click", () => {
          const willOpen = !item.classList.contains("is-open");
          items.forEach((other) => {
            const otherButton = other.querySelector("button");
            const otherPanel = other.querySelector(".faq-panel");
            other.classList.remove("is-open");
            if (otherButton) otherButton.setAttribute("aria-expanded", "false");
            if (otherPanel) otherPanel.hidden = true;
          });
          item.classList.toggle("is-open", willOpen);
          button.setAttribute("aria-expanded", String(willOpen));
          panel.hidden = !willOpen;
        });
      });
    });
  }

  function initCookieCard() {
    const card = document.querySelector("[data-cookie]");
    const accept = document.querySelector("[data-cookie-accept]");
    if (!card || !accept) return;
    if (localStorage.getItem("flowlineCookieAccepted") === "yes") {
      card.remove();
      return;
    }
    card.classList.add("is-visible");
    accept.addEventListener("click", () => {
      localStorage.setItem("flowlineCookieAccepted", "yes");
      card.remove();
    });
  }

  function initForm() {
    document.querySelectorAll("form[data-contact-form]").forEach((form) => {
      const status = form.querySelector("[data-form-status]");
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (status) status.textContent = "Sending...";
        try {
          const response = await fetch(form.action || "contact.php", {
            method: "POST",
            body: new FormData(form),
            headers: { "Accept": "application/json" }
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok || data.success !== true) throw new Error("Send failed");
          form.reset();
          if (status) status.textContent = "Successfully sent";
        } catch (error) {
          if (status) status.textContent = "Please try again later";
        }
      });
    });
  }

  function initParallax() {
    const items = document.querySelectorAll("[data-parallax]");
    if (!items.length) return;
    const update = () => {
      const viewport = window.innerHeight || 1;
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const progress = (rect.top - viewport) / (viewport + rect.height);
        item.style.transform = `translate3d(0, ${Math.max(-18, Math.min(18, progress * -28))}px, 0)`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function initSwipers() {
    if (typeof Swiper === "undefined") return;
    document.querySelectorAll(".service-swiper").forEach((node) => {
      new Swiper(node, {
        loop: true,
        speed: 650,
        spaceBetween: 24,
        autoplay: { delay: 3500, disableOnInteraction: false },
        navigation: {
          nextEl: node.parentElement.querySelector(".swiper-next"),
          prevEl: node.parentElement.querySelector(".swiper-prev")
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          680: { slidesPerView: 2 },
          1100: { slidesPerView: 3 }
        }
      });
    });
    document.querySelectorAll(".wcu-swiper").forEach((node) => {
      new Swiper(node, {
        loop: true,
        speed: 650,
        spaceBetween: 24,
        autoplay: { delay: 3800, disableOnInteraction: false },
        navigation: {
          nextEl: node.parentElement.querySelector(".swiper-next"),
          prevEl: node.parentElement.querySelector(".swiper-prev")
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          680: { slidesPerView: 2 },
          1100: { slidesPerView: 3 }
        }
      });
    });
    document.querySelectorAll(".testimonial-banner-swiper").forEach((node) => {
      new Swiper(node, {
        loop: true,
        speed: 650,
        slidesPerView: 1,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: {
          el: node.querySelector(".swiper-pagination"),
          clickable: true
        }
      });
    });
    document.querySelectorAll(".testimonial-swiper").forEach((node) => {
      new Swiper(node, {
        loop: true,
        speed: 650,
        spaceBetween: 24,
        autoplay: { delay: 4200, disableOnInteraction: false },
        pagination: {
          el: node.querySelector(".swiper-pagination"),
          clickable: true
        },
        navigation: {
          nextEl: node.parentElement.querySelector(".swiper-next"),
          prevEl: node.parentElement.querySelector(".swiper-prev")
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          860: { slidesPerView: 2 },
          1240: { slidesPerView: 3 }
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    initMenu();
    initAccordions();
    initCookieCard();
    initForm();
    initParallax();
    initSwipers();
    if (window.AOS) AOS.init({ duration: 650, once: true, offset: 70, easing: "ease-out-cubic" });
  });
})();
