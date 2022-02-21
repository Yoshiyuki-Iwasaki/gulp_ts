export function tabFunction() {
  document.querySelectorAll("[data-tab-open]").forEach(elem => {
    // 開閉する対象の要素を取得する
    const targetButtonId = <string>elem.getAttribute("data-tab-open");
    const tabSelect = <HTMLInputElement>document.getElementById(targetButtonId);

    // タブを選択
    elem.addEventListener("click", function () {
      tabContentRemoved();
      tabSelect.classList.add("js-active");
    });
  });

  //ボタンを押した際にコンテンツを一旦非表示にする
  function tabContentRemoved() {
    document
      .querySelectorAll(".topPageSection__inner__content")
      .forEach(elem => {
        elem.classList.remove("js-active");
      });
  }
}
