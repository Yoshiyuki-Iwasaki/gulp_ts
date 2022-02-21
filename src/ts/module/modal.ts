export function modalFunction() {
  //複数ボタンとモーダルが必要な場合
  document.querySelectorAll("[data-modal-open]").forEach(elem => {
    // 開閉する対象の要素を取得する
    const targetModalId = <string>elem.getAttribute("data-modal-open");
    const modal = <HTMLElement>document.getElementById(targetModalId);
    const overlay = <HTMLElement>document.getElementById("overlay");

    // 開く
    elem.addEventListener("click", function () {
      modal.classList.add("js-active");
      overlay.classList.add("js-active");
    });

    // 閉じる
    overlay.addEventListener("click", function () {
      modal.classList.remove("js-active");
      overlay.classList.remove("js-active");
    });
  });
}
