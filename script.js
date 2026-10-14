(() => {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // DARK / LIGHT THEME
  const themeButton = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeButton.textContent = theme === "dark" ? "☼" : "☾";
    themeButton.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );

    document.querySelector('meta[name="theme-color"]')
      .setAttribute("content", theme === "dark" ? "#0a0e1a" : "#f5f7ff");
  }

  try {
    applyTheme(localStorage.getItem("jayyy-theme") || "dark");
  } catch {
    applyTheme("dark");
  }

  themeButton.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("jayyy-theme", next);
    } catch {}
  });

  // MOBILE MENU
  const menuButton = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  menuButton.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuButton.textContent = open ? "✕" : "☰";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.textContent = "☰";
      menuButton.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      navLinks.classList.remove("open");
      menuButton.textContent = "☰";
      menuButton.setAttribute("aria-expanded", "false");
    }
  });

  // TYPING ANIMATION
  const typingElement = document.getElementById("typing-text");
  const phrases = [
    "Aspiring Software Developer",
    "Python Learner",
    "Tech Enthusiast",
    "Electronics Engineering Student",
    "Future Software Developer"
  ];

  let phraseIndex = 0;
  let characterIndex = phrases[0].length;
  let deleting = true;

  function typeText() {
    const phrase = phrases[phraseIndex];

    characterIndex += deleting ? -1 : 1;
    typingElement.textContent = phrase.slice(0, characterIndex);

    let delay = deleting ? 38 : 70;

    if (characterIndex === 0 && deleting) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    } else if (characterIndex === phrases[phraseIndex].length && !deleting) {
      deleting = true;
      delay = 1400;
    }

    setTimeout(typeText, delay);
  }

  if (reducedMotion) {
    typingElement.textContent = phrases[0];
  } else {
    setTimeout(typeText, 1400);
  }

  // SCROLL REVEAL AND SKILL BARS
  const revealItems = document.querySelectorAll(".reveal, .skill-card");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("in-view"));
  }

  // ACTIVE NAVIGATION
  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...document.querySelectorAll(".nav-link")];

  function updateNavigation() {
    let current = "home";

    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) {
        current = section.id;
      }
    });

    links.forEach(link => {
      const active = link.getAttribute("href") === "#" + current;
      link.classList.toggle("active", active);

      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });

    document.getElementById("to-top")
      .classList.toggle("show", window.scrollY > 450);
  }

  window.addEventListener("scroll", updateNavigation, { passive: true });
  updateNavigation();

  // BACK TO TOP
  document.getElementById("to-top").addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  });

  // 3D TILT CARDS
  if (!reducedMotion && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.transform =
          `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-3px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // CURSOR GLOW
  const glow = document.querySelector(".cursor-glow");

  if (glow && !reducedMotion && matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", event => {
      glow.style.left = event.clientX + "px";
      glow.style.top = event.clientY + "px";
    }, { passive: true });
  }

  // ANIMATED PARTICLES
  const canvas = document.getElementById("particles");
  const context = canvas.getContext("2d");

  if (context && !reducedMotion) {
    let particles = [];
    let width = 0;
    let height = 0;
    let animationFrame = null;

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(60, Math.floor(width * height / 18000));

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      }));
    }

    function animateParticles() {
      context.clearRect(0, 0, width, height);

      context.fillStyle =
        root.getAttribute("data-theme") === "light"
          ? "rgba(109,61,240,.4)"
          : "rgba(34,211,238,.6)";

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        context.beginPath();
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = requestAnimationFrame(animateParticles);
    }

    function startParticles() {
      if (!document.hidden && animationFrame === null) {
        animationFrame = requestAnimationFrame(animateParticles);
      }
    }

    function stopParticles() {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    resizeCanvas();
    startParticles();

    window.addEventListener("resize", resizeCanvas, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopParticles();
      else startParticles();
    });
  }

  // COPY EMAIL
  const copyButton = document.getElementById("copy-email");
  const copyStatus = document.getElementById("copy-status");
  const email = "jayysonawane07@gmail.com";

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = "Email address copied!";
    } catch {
      copyStatus.textContent = "Email address: " + email;
    }
  });

  // CURRENT YEAR
  document.getElementById("year").textContent = new Date().getFullYear();
})();