export function acccordion() {
  const data_bth_open: NodeListOf<Element> = document.querySelectorAll(
    "[data-bth-open]"
  );
  data_bth_open.forEach(elem => {
    // タブを選択
    elem.addEventListener("click", function () {
      // this.classList.toggle("js-active");
      // const next = this.nextSibling;
      // next.classList.toggle("js-active");
    });
  });
}
