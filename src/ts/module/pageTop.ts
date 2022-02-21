export function pageTopBtn() {
  // pageTop
  const pageTopBtn = <HTMLInputElement>document.getElementById("pagetop");
  pageTopBtn.addEventListener("click", foo);

  function foo() {
    // 縦方向のスクロール量を取得
    const nowY = window.pageYOffset;
    console.log("nowY", nowY);

    window.scrollTo(0, Math.floor(nowY * 0.8));
    if (nowY > 0) {
      window.setTimeout(foo, 10);
    }
  }
}
