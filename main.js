// Mobile Menu Toggle
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const closeBtn = document.getElementById("close-btn");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
}

if (closeBtn && mobileMenu) {
  closeBtn.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    document.body.style.overflow = "auto";
  });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    e.preventDefault();
    window.scrollTo({ top: targetElement.offsetTop - 80, behavior: "smooth" });
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });
});

// Scroll reveal (IntersectionObserver)
const revealEls = document.querySelectorAll(".reveal-on-scroll");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => io.observe(el));

// Make project cards clickable (with keyboard support)
document.querySelectorAll(".project-card[data-link]").forEach((card) => {
  const anchors = card.querySelectorAll("a");
  anchors.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  card.addEventListener("click", () => {
    const url = card.getAttribute("data-link");
    if (url) window.location.href = url;
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const url = card.getAttribute("data-link");
      if (url) window.location.href = url;
    }
  });
});

// Theme toggle (persists to localStorage)
const themeToggle = document.getElementById("theme-toggle");
const storedTheme = localStorage.getItem("theme");
if (storedTheme === "light") document.documentElement.classList.add("light");

function updateThemeButton() {
  if (!themeToggle) return;
  const isLight = document.documentElement.classList.contains("light");
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.innerHTML = isLight
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

updateThemeButton();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("light");
    const isLight = document.documentElement.classList.contains("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    updateThemeButton();
  });
}

// Tab toggle for project pages (Overview vs README)
const overviewSection = document.getElementById("overview-section");
const readmeSection = document.getElementById("readme-section");
const tabOverview = document.getElementById("tab-overview");
const tabReadme = document.getElementById("tab-readme");

function setActiveTab(which) {
  if (!overviewSection || !readmeSection || !tabOverview || !tabReadme) return;
  const showReadme = which === "readme";
  readmeSection.classList.toggle("hidden", !showReadme);
  overviewSection.classList.toggle("hidden", showReadme);
  tabOverview.classList.toggle("bg-indigo-600", !showReadme);
  tabOverview.classList.toggle("text-white", !showReadme);
  tabOverview.classList.toggle("text-indigo-200", showReadme);
  tabReadme.classList.toggle("bg-indigo-600", showReadme);
  tabReadme.classList.toggle("text-white", showReadme);
  tabReadme.classList.toggle("text-indigo-200", !showReadme);
  tabOverview.setAttribute("aria-selected", String(!showReadme));
  tabReadme.setAttribute("aria-selected", String(showReadme));
}

if (tabOverview && tabReadme) {
  tabOverview.addEventListener("click", () => setActiveTab("overview"));
  tabReadme.addEventListener("click", () => setActiveTab("readme"));
}
