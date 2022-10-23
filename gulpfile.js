const fs = require("fs"); // ファイルを同期して読み込みできるモジュール
const { src, dest, watch, series } = require("gulp"); // gulp使用するモジュール
const sass = require("gulp-dart-sass"); // dartsass使用するモジュール
const postcss = require("gulp-postcss"); // CSSを変換するポストプロフェッサー
const autoprefixer = require("autoprefixer"); // autoprefixer使用するモジュール
const flexBugsFixes = require("postcss-flexbugs-fixes"); // flexboxのバグを自動修正するモジュール
const ejs = require("gulp-ejs"); // ejs使用するモジュール
const htmlMin = require("gulp-htmlmin"); // HTMLを圧縮するモジュール
const rename = require("gulp-rename"); // ファイル名をリネームするモジュール
const replace = require("gulp-replace"); // 文字列を置換するモジュール
const changed = require("gulp-changed"); // 変更されたファイルのみを変更するモジュール
const imageMin = require("gulp-imagemin"); // 画像を圧縮するモジュール
const imageMinPngquant = require("imagemin-pngquant"); // 画像を圧縮するモジュール
const imageMinMozjpeg = require("imagemin-mozjpeg"); // 画像を圧縮するモジュール
const progeny = require("gulp-progeny"); // 差分ビルドを可能にするモジュール
const plumber = require("gulp-plumber"); // エラー時のタスク停止防止するモジュール
const notify = require("gulp-notify"); // エラー通知
const sourcemaps = require("gulp-sourcemaps"); // ソースマップ出力
const typescript = require("gulp-typescript"); // typescript使用するモジュール
const uglify = require("gulp-uglify"); // ファイルを圧縮するモジュール
const browserSync = require("browser-sync"); // ブラウザリロードモジュール
const webpack = require("webpack"); // webpack使用するモジュール
const webpackStream = require("webpack-stream"); // webpack使用するモジュール
const webpackConfig = require("./webpack.config.js"); // webpackの設定ファイルの読み込み
const mode = require("gulp-mode")({
  mode: ["production", "development"],
  default: "development",
  verbose: false
});
const del = require("del"); // クリーンアップを行うモジュール

/* --------
  PATH
-------- */
const directoryName = "directoryName"; // ディレクトリ名
const baseSirDir = "./src"; // 出力元の共通Path
let baseDistDir; // 出力先のディレクトリPath
const isProduction = mode.production; // production環境の条件分岐で使用する変数
const isDevelopment = mode.development; // development環境の条件分岐で使用する変数

if (isProduction()) {
  baseDistDir = "../src/" + directoryName; // production環境で使用されるPath
} else {
  baseDistDir = "./dist"; // development環境で使用されるPath
}

const path = {
  src: {
    ejs: [baseSirDir + "/ejs/**/*.ejs", "!" + baseSirDir + "/ejs/_inc/*.ejs"],
    watchEjs: baseSirDir + "/ejs/**/*.ejs",
    sass: baseSirDir + "/sass/*.scss",
    ts: baseSirDir + "/ts/*.ts",
    jsVender: [baseSirDir + "/js/lib/*.js"],
    image: baseSirDir + "/image/**",
    json: baseSirDir + "/config.json"
  },
  dist: {
    ejs: baseDistDir,
    sass: baseDistDir + "/assets/css",
    ts: baseDistDir + "/assets/ts",
    jsVender: baseDistDir + "/assets/js/lib",
    image: baseDistDir + "/assets/image"
  }
};

/* --------
  EJS
-------- */
const htmlMinOption = {
  collapseWhitespace: true //タグ間の空白を削除
};
const configHtmlMin = {
  removeComments: true // コメントを削除
};
const htmlInitDel = /[\s\S]*?(<!DOCTYPE)/i; // <!DOCTYPEの直前の0文字以上の空白文字の正規表現
const htmlSpaceLineDel = /[ ]+(\r\n|\n|\r)+/gi; // インデントの正規表現

const configJsonData = fs.readFileSync(path.src.json); //jsonファイルを読み込む
const configObj = JSON.parse(configJsonData);
const ejsDataOption = {
  config: configObj
};

const compileEjs = () => {
  return src(path.src.ejs)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Ejs compile Error",
          message: "<%= error.message %>"
        })
      })
    ) // エラー時に通知が来るようにする
    .pipe(isDevelopment(sourcemaps.init())) // Development環境でソースマップを初期化する
    .pipe(ejs(ejsDataOption)) // jsonファイルを読み込む
    .pipe(rename({ extname: ".html" })) // 拡張子をhtmlに変更する
    .pipe(isProduction(htmlMin(htmlMinOption))) // htmlファイルを圧縮する
    .pipe(replace(htmlInitDel, "$1")) // <!DOCTYPEの直前の0文字以上の空白文字を<!DOCTYPEに置換する
    .pipe(isProduction(htmlMin(configHtmlMin))) // htmlファイルを圧縮する
    .pipe(replace(htmlSpaceLineDel, "")) // コメント削除の結果インデントのみ残った部分を削除する
    .pipe(isDevelopment(sourcemaps.write("./"))) // Development環境でソースマップを作成する
    .pipe(dest(path.dist.ejs));
};

/* --------
  SASS
-------- */
const autoPrefixerOption = {
  grid: true
};
const postCssOption = [flexBugsFixes, autoprefixer(autoPrefixerOption)];

const compileSass = (done) => {
  // style.scssファイルを取得
  return src(path.src.sass)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Sass compile Error",
          message: "<%= error.message %>"
        })
      })
    ) // エラー時に通知が来るようにする
    .pipe(isDevelopment(sourcemaps.init())) // Development環境でソースマップを初期化する
    .pipe(progeny()) // 差分をビルドする
    .pipe(isDevelopment(sass({ includePaths: ["src/sass"] }))) // dartsass コンパイル
    .pipe(isProduction(sass({ includePaths: ["src/sass"], outputStyle: "expanded" }))) // dartsass コンパイル
    .pipe(postcss(postCssOption)) // postcssでcssを変換する
    .pipe(isDevelopment(sourcemaps.write("./"))) // Development環境でソースマップを作成する
    .pipe(dest(path.dist.sass));
};

/* --------
  Typescript
-------- */
const compileTs = () => {
  return src(path.src.ts)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "TS compile Error",
          message: "<%= error.message %>"
        })
      })
    ) // エラー時に通知が来るようにする
    .pipe(isDevelopment(sourcemaps.init())) // Development環境でソースマップを初期化する
    .pipe(typescript({ target: "ES6" }))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(isDevelopment(sourcemaps.write("./"))) // Development環境でソースマップを作成する
    .pipe(dest(path.dist.ts));
};

/* --------
  JsVender
-------- */
const compileVender = () => {
  return src(path.src.jsVender)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "jsVender compile Error",
          message: "<%= error.message %>"
        })
      })
    ) // エラー時に通知が来るようにする
    .pipe(uglify()) // ファイルを圧縮する
    .pipe(dest(path.dist.jsVender));
};

/* --------
  Image
-------- */
const imageMinOption = [
  imageMinPngquant({ quality: [0.65, 0.8] }),
  imageMinMozjpeg({ quality: 85 }),
  imageMin.gifsicle({
    interlaced: false,
    optimizationLevel: 1,
    colors: 256
  }),
  imageMin.mozjpeg(),
  imageMin.optipng(),
  imageMin.svgo({
    plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
  })
];

const compileImage = () => {
  return src(path.src.image)
    .pipe(changed(path.dist.image)) // 変更されたファイルのみを対象範囲にする
    .pipe(imageMin(imageMinOption)) // 画像を圧縮する
    .pipe(dest(path.dist.image));
};

// サーバー起動
const browsersync = (done) => {
  browserSync.init({
    server: {
      baseDir: baseDistDir
    }
  });
  done();
};

// ブラウザ自動リロード
const browserReload = (done) => {
  browserSync.reload();
  done();
};

// Clean Up
const cleanUp = (done) => {
  del.sync([baseDistDir + "/**", "!" + baseDistDir], { force: true });
  done();
};

//Watch
const watchFiles = () => {
  watch(path.src.dir, series(compileEjs, compileSass, compileTs, compileVender, compileImage, browserReload));
};

exports.default = series(
  cleanUp,
  compileEjs,
  compileSass,
  compileTs,
  compileVender,
  compileImage,
  browsersync,
  browserReload
);

exports.watch = series(browsersync, watchFiles);
