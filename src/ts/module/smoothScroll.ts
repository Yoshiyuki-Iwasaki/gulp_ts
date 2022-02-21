export function smoothScrollFunction() {
  // smoothScroll
  const smoothScrollTrigger = document.querySelectorAll('a[href^="#"]');
  for (let i = 0; i < smoothScrollTrigger.length; i++) {
    smoothScrollTrigger[i].addEventListener("click", e => {
      e.preventDefault();
      const href = <string>smoothScrollTrigger[i].getAttribute("href");
      const targetElement = <HTMLElement>(
        document.getElementById(href.replace("#", ""))
      );
      const rect = targetElement.getBoundingClientRect().top;
      const offset = window.pageYOffset;
      const gap = 60;
      const target = rect + offset - gap;
      window.scrollTo({
        top: target,
        behavior: "smooth",
      });
    });
  }
}
