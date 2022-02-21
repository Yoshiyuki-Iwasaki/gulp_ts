export function hamburgerFunction() {
  const menu_trigger = <HTMLInputElement>(
    document.getElementById("menu-trigger")
  );
  const gnav = <HTMLInputElement>document.getElementById("gnav");

  menu_trigger.addEventListener("click", function () {
    this.classList.toggle("js_active");
    gnav.classList.toggle("js_active");
  });
}
