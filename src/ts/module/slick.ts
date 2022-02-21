import * as $ from "jquery";
import "slick-carousel";

export function slickFunction() {
  $(".wrapper").slick({
    dots: true, // ナビゲーション用ドットを有効にします。
    speed: 500, // スライドやフェード時のアニメーション速度(ミリ秒)を指定します。
    autoplay: true, // スライドの自動再生を有効にします。
    adaptiveHeight: true, // スライダの高さを現在のスライドに合わせます。
    // centerMode: true, // 前後のスライドを部分的に含めてスライドを中央に表示します
    slidesToShow: 2, //768px以上のサイズに適用
    arrows: true, // ナビゲーション用矢印(次へ / 前へ)を有効にします。
    prevArrow: '<div class="prev">PREV</div>', // "前へ"の矢印をDOMノードや、カスタムHTMLで変更することができます。
    nextArrow: '<div class="next">NEXT</div>', // "次へ"の矢印をDOMノードや、カスタムHTMLで変更することができます。
    responsive: [
      {
        breakpoint: 768, //767px以下のサイズに適用
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  });
}
