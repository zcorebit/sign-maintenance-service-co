(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  var body = document.body;
  var backToTop = document.querySelector(".back-to-top");

  /* Mobile nav toggle */
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.classList.toggle("is-open", !isOpen);
      body.classList.toggle("nav-locked", !isOpen);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
        body.classList.remove("nav-locked");
      });
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
        body.classList.remove("nav-locked");
        navToggle.focus();
      }
    });
  }

  /* Header shadow + back-to-top on scroll */
  var onScroll = function () {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (backToTop) backToTop.classList.toggle("is-visible", y > 480);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Scroll reveal via IntersectionObserver, with a safety-net timeout so
     content already in the document is never left hidden for renderers
     that don't simulate scrolling (SEO crawlers, timing edge cases). */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
    window.setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }, 2500);
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* Contact form: client-side validation + success state (no backend wired up) */
  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var isEmpty = input.type === "checkbox" ? !input.checked : !input.value.trim();
        var isBadEmail = input.type === "email" && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        if (isEmpty || isBadEmail) {
          valid = false;
          if (field) field.classList.add("has-error");
        } else if (field) {
          field.classList.remove("has-error");
        }
      });

      if (!valid) {
        var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      form.classList.add("is-submitted");
      var success = document.querySelector(".form-success");
      if (success) {
        success.classList.add("is-visible");
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
    });

    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("has-error");
      });
    });
  }

  /* FAQ: close other panels when one opens (accordion behavior) */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();
