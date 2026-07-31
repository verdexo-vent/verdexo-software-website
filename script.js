const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reducedMotion || !("IntersectionObserver" in window)) {
  $$(".reveal").forEach((element) => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((element) => observer.observe(element));
}

const menuButton = $(".menu-toggle");
const navigation = $(".nav-links");

menuButton?.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

$$(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const heroScreens = {
  dashboard: {
    src: "assets/salon-latest-today.png",
    alt: "Salon Pro Today workspace"
  },
  appointments: {
    src: "assets/salon-latest-appointments.png",
    alt: "Salon Pro appointments workspace"
  },
  reports: {
    src: "assets/salon-latest-reports.png",
    alt: "Salon Pro reports and analytics"
  }
};

$$("[data-hero-screen]").forEach((button) => {
  button.addEventListener("click", () => {
    const screen = heroScreens[button.dataset.heroScreen];
    const image = $("#hero-screen");
    if (!screen || !image || button.classList.contains("active")) return;

    $$("[data-hero-screen]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    image.classList.add("changing");

    window.setTimeout(() => {
      image.src = screen.src;
      image.alt = screen.alt;
      image.onload = () => image.classList.remove("changing");
    }, reducedMotion ? 0 : 140);
  });
});

const voiceControl = $(".voice-control");
voiceControl?.addEventListener("click", () => {
  const playing = voiceControl.classList.toggle("playing");
  voiceControl.setAttribute("aria-pressed", String(playing));
  $(".voice-icon", voiceControl).textContent = playing ? "■" : "▶";
  $("strong", voiceControl).textContent = playing ? "Simulating a call…" : "Play sample flow";
  $("small", voiceControl).textContent = playing
    ? "Hindi and English booking flow"
    : "Interactive preview";
});

const modal = $("#demo-modal");
const interestField = $("#interest");
let lastFocusedElement = null;

function openModal(interest) {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  if (interest && interestField) {
    const matchingOption = [...interestField.options].find((option) =>
      option.text.toLowerCase().includes(interest.toLowerCase().replace(" plan", ""))
    );
    if (matchingOption) interestField.value = matchingOption.value;
  }
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.setTimeout(() => $("input", modal)?.focus(), 50);
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus();
}

$$("[data-open-demo]").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.interest));
});
$$("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("open")) closeModal();
});

$("#demo-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const interest = String(form.get("interest") || "").trim();
  const message = [
    `Hi Verdexo, I am ${name}.`,
    `I would like a live demo for ${interest}.`,
    `My WhatsApp number is ${phone}.`
  ].join(" ");
  window.open(`https://wa.me/919830092595?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  closeModal();
  event.currentTarget.reset();
});
