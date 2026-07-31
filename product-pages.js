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
