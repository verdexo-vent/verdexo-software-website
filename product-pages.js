const reducedProductMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-product-tabs]").forEach((tabs) => {
  const image = document.querySelector(tabs.dataset.target);
  if (!image) return;
  tabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("active")) return;
      tabs.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      image.classList.add("changing");
      window.setTimeout(() => {
        image.src = button.dataset.src;
        image.alt = button.dataset.alt;
        image.onload = () => image.classList.remove("changing");
      }, reducedProductMotion ? 0 : 120);
    });
  });
});

document.querySelectorAll("[data-query-form]").forEach((form) => {
  const product = form.dataset.product;
  const emailButton = form.querySelector("[data-send-email]");
  const whatsappButton = form.querySelector("[data-send-whatsapp]");

  function getDetails() {
    const data = new FormData(form);
    return {
      name: String(data.get("name") || "").trim(),
      contact: String(data.get("contact") || "").trim(),
      topic: String(data.get("topic") || "").trim(),
      query: String(data.get("query") || "").trim()
    };
  }

  function validate() {
    return form.reportValidity();
  }

  emailButton?.addEventListener("click", () => {
    if (!validate()) return;
    const details = getDetails();
    const subject = `${product} enquiry: ${details.topic}`;
    const body = `Hi Verdexo,\n\nI am ${details.name}.\nContact: ${details.contact}\nProduct: ${product}\nQuestion: ${details.query}\n\nPlease get back to me.`;
    window.location.href = `mailto:software@verdexoventures.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  whatsappButton?.addEventListener("click", () => {
    if (!validate()) return;
    const details = getDetails();
    const message = `Hi Verdexo, I am ${details.name}. I have a ${product} query about ${details.topic}. ${details.query} My contact is ${details.contact}.`;
    window.open(`https://wa.me/919830092595?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
});

const galleryImages = [...document.querySelectorAll(".gallery-card img")];
if (galleryImages.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <div class="image-lightbox-inner" role="dialog" aria-modal="true" aria-label="Software screenshot preview">
      <button class="image-lightbox-close" type="button" aria-label="Close screenshot preview">×</button>
      <img src="" alt="">
    </div>
  `;
  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".image-lightbox-close");
  let previousFocus = null;

  function openLightbox(image) {
    previousFocus = document.activeElement;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    previousFocus?.focus();
  }

  galleryImages.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Enlarge ${image.alt}`);
    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });
}
