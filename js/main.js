/* ============================================================
   Yolotech88 — Interactions
   - Sticky header state on scroll
   - Mobile menu toggle
   - Scroll-spy active nav link
   - Reveal-on-scroll animations
   - Animated stat counters
   - Contact form validation (client-side)
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Current year in footer ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header ---------- */
  const header = $("#site-header");
  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = $("#menu-toggle");
  const menu = $("#mobile-menu");
  const iconOpen = $("#icon-open");
  const iconClose = $("#icon-close");

  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle("hidden", !open);
    iconOpen?.classList.toggle("hidden", open);
    iconClose?.classList.toggle("hidden", !open);
    toggle?.setAttribute("aria-expanded", String(open));
  };

  toggle?.addEventListener("click", () => {
    const open = menu?.classList.contains("hidden");
    setMenu(open);
  });

  // Close mobile menu when a link is tapped
  $$("#mobile-menu a").forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );

  // Close on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) setMenu(false);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("revealed"));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-counter]");
  const runCounter = (el) => {
    const target = parseInt(el.getAttribute("data-counter"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const out = $(".counter", el);
    if (!out) return;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      out.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && counters.length) {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => countObs.observe(el));
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Scroll-spy nav highlighting ---------- */
  const sections = $$("main section[id]");
  const navLinks = $$(".nav-link");
  if ("IntersectionObserver" in window && sections.length) {
    const spyObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) =>
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === `#${id}`
              )
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spyObs.observe(s));
  }

  /* ---------- Contact form validation ---------- */
  const form = $("#contact-form");
  const status = $("#form-status");

  const setError = (field, msg) => {
    const input = $(`#${field}`);
    const errEl = $(`[data-error-for="${field}"]`);
    if (input) input.classList.toggle("invalid", Boolean(msg));
    if (errEl) errEl.textContent = msg || "";
  };

  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? ""
        : "Please enter a valid email address.",
    message: (v) =>
      v.trim().length >= 10 ? "" : "Please add a few more details (10+ chars).",
  };

  if (form) {
    // live-clear errors as the user types
    Object.keys(validators).forEach((field) => {
      const input = $(`#${field}`);
      input?.addEventListener("input", () => {
        if (input.classList.contains("invalid")) {
          setError(field, validators[field](input.value));
        }
      });
    });

    // Show a status message in success (green) or error (red) styling.
    const SUCCESS_CLS =
      "mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700";
    const ERROR_CLS =
      "mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700";
    const showStatus = (msg, ok) => {
      if (!status) return;
      status.textContent = msg;
      status.className = ok ? SUCCESS_CLS : ERROR_CLS;
    };

    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valid = true;

      Object.keys(validators).forEach((field) => {
        const input = $(`#${field}`);
        const msg = input ? validators[field](input.value) : "";
        setError(field, msg);
        if (msg) valid = false;
      });

      if (!valid) {
        status?.classList.add("hidden");
        const firstInvalid = $(".form-input.invalid");
        firstInvalid?.focus();
        return;
      }

      const firstName = $("#name")?.value.trim().split(" ")[0] || "there";
      const originalLabel = submitBtn?.textContent;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          showStatus(
            `Thanks, ${firstName}! Your message has been sent — we'll reply within one business day.`,
            true
          );
          form.reset();
        } else {
          // Formspree returns { errors: [{ message }] } on validation/config issues
          const data = await res.json().catch(() => ({}));
          const detail =
            data && Array.isArray(data.errors)
              ? data.errors.map((x) => x.message).join(", ")
              : "";
          showStatus(
            `Sorry, something went wrong${detail ? ` (${detail})` : ""}. Please email us directly at raj@yolotech88.com.`,
            false
          );
        }
      } catch (err) {
        // Network failure / offline
        showStatus(
          "Network error — please check your connection or email us directly at raj@yolotech88.com.",
          false
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }
    });
  }
})();
