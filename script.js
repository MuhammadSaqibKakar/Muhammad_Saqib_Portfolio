const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const clickedInsideMenu = navLinks.contains(target);
    const clickedToggle = menuToggle.contains(target);
    if (!clickedInsideMenu && !clickedToggle && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function wireCopyButtons(selector, successText) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.getAttribute("data-copy-text");
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const original = button.textContent;
        button.textContent = successText;
        setTimeout(() => {
          button.textContent = original;
        }, 1400);
      } catch (error) {
        console.error("Clipboard access failed", error);
      }
    });
  });
}

wireCopyButtons(".copy-name-btn", "Name Copied");
wireCopyButtons(".copy-email-btn", "Email Copied");

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("sender-name")?.value.trim();
    const email = document.getElementById("sender-email")?.value.trim();
    const subjectInput = document.getElementById("sender-subject")?.value.trim();
    const message = document.getElementById("sender-message")?.value.trim();
    if (!name || !email || !subjectInput || !message) return;

    const subject = encodeURIComponent(`${subjectInput} - from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:Engrsaqibkakar241@gmail.com?subject=${subject}&body=${body}`;
  });
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const certCards = document.querySelectorAll(".cert-card");

if (lightbox && lightboxImage && lightboxClose && certCards.length > 0) {
  certCards.forEach((card) => {
    card.addEventListener("click", () => {
      const fullImage = card.getAttribute("data-full");
      if (!fullImage) return;
      lightboxImage.src = fullImage;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  };

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}
