const { src, dest, watch, series, parallel } = require("gulp");
ejs = require("gulp-ejs");
rename = require("gulp-rename");
sass = require("gulp-sass");
typescript = require("gulp-typescript");
babel = require("gulp-babel");
browserSync = require("browser-sync");
webpack = require("webpack");
webpackStream = require("webpack-stream"); // gulpでwebpackを使うために必要なプラグイン
// webpackの設定ファイルの読み込み
webpackConfig = require("./webpack.config.js");

//ディレクトリ構成
const CONF = {
  EJS: {
    SOURCE: ["./src/ejs/**/*.ejs", "!./src/ejs/_inc/*.ejs"],
    OUTPUT: "./dist",
  },
  SASS: {
    SOURCE: "./src/sass/*.scss",
    OUTPUT: "./dist/assets/css",
  },
  TS: {
    SOURCE: "./src/ts/*.ts",
    OUTPUT: "./dist/assets/js",
  },
  // JS: {
  //   SOURCE: "./src/js/*.js",
  //   OUTPUT: "./dist/assets/js",
  IMAGE: {
    SOURCE: "./src/image/*",
    OUTPUT: "./dist/assets/image",
  },
  LIB: {
    SOURCE: ["./src/js/lib/*.js", "./src/js/lib/*.css"],
    OUTPUT: "./dist/assets/js/lib",
  },
  BROWSERSYNC: {
    DOCUMENT_ROOT: "./dist",
    INDEX: "index.html",
    GHOSTMODE: {
      clicks: false,
      forms: false,
      scroll: false,
    },
  },
};

// サーバー起動
const buildServer = done => {
  browserSync.init({
    port: 8080,
    server: {
      baseDir: CONF.BROWSERSYNC.DOCUMENT_ROOT,
      index: CONF.BROWSERSYNC.INDEX,
    },
    startPath: "",
    reloadOnRestart: true,
  });
  done();
};

// ブラウザ自動リロード
const browserReload = done => {
  browserSync.reload();
  done();
};

const compileEjs = () => {
  // .ejsファイルを取得
  return (
    src(CONF.EJS.SOURCE)
      // pipe() 1つ一つの処理をつなげる。
      .pipe(ejs({}, {}, { ext: ".html" }))
      .pipe(rename({ extname: ".html" }))
      .pipe(dest(CONF.EJS.OUTPUT))
  );
};

// style.scssをタスクを作成する
const compileSass = done => {
  // style.scssファイルを取得
  return (
    src(CONF.SASS.SOURCE)
      // Sassのコンパイルを実行
      .pipe(sass())
      // cssフォルダー以下に保存
      .pipe(dest(CONF.SASS.OUTPUT))
  );
  done(); // 終了宣言
};

const bundleTs = () => {
  return src(CONF.TS.SOURCE)
    .pipe(typescript({ target: "ES6" }))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(dest(CONF.TS.OUTPUT));
};

// const bundleJs = () => {
//   // gulp image で実行するタスク
//   return src(CONF.JS.SOURCE) //結果をwatchへ返却する
//     .pipe(
//       babel({
//         presets: ["@babel/preset-env"],
//       })
//     )
//     .pipe(webpackStream(webpackConfig, webpack))
//     .pipe(dest(CONF.JS.OUTPUT)); //指定のディレクトリに移動させる
// };

const LibFunc = () => {
  // gulp image で実行するタスク
  return src(CONF.LIB.SOURCE) //結果をwatchへ返却する
    .pipe(dest(CONF.LIB.OUTPUT)); //指定のディレクトリに移動させる
};

const imageFunc = () => {
  // gulp image で実行するタスク
  return src(CONF.IMAGE.SOURCE) //結果をwatchへ返却する
    .pipe(dest(CONF.IMAGE.OUTPUT)); //指定のディレクトリに移動させる
};

//Watch
const watchFiles = () => {
  watch(CONF.EJS.SOURCE, series(compileEjs, browserReload));
  watch(CONF.SASS.SOURCE, series(compileSass, browserReload));
  watch(CONF.IMAGE.SOURCE, series(imageFunc, browserReload));
  watch(CONF.LIB.SOURCE, series(LibFunc, browserReload));
  watch(CONF.TS.SOURCE, series(bundleTs, browserReload));
  // watch(CONF.JS.SOURCE, series(bundleJs, browserReload));
};

exports.compileEjs = compileEjs;
exports.compileSass = compileSass;
exports.imageFunc = imageFunc;
exports.LibFunc = LibFunc;
exports.bundleTs = bundleTs;
// exports.bundleJs = bundleJs;

exports.default = series(
  parallel(compileEjs, compileSass, LibFunc, imageFunc, bundleTs),
  series(buildServer, watchFiles)
);
