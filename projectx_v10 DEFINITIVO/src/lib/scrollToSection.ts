export const scrollToSection = (id: string, offset = 120) => {
  let attempts = 0;
  const maxAttempts = 20;

  const tryScroll = () => {
    const el = document.getElementById(id);

    if (el) {
      const y =
        el.getBoundingClientRect().top +
        window.pageYOffset -
        offset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      return;
    }

    // retry se non trovato (es: pagina appena cambiata)
    if (attempts < maxAttempts) {
      attempts++;
      requestAnimationFrame(tryScroll);
    }
  };

  tryScroll();
};