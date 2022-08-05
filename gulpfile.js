const { src, dest, watch, series, parallel } = require("gulp");
ejs = require("gulp-ejs");
rename = require("gulp-rename");
sass = require("gulp-dart-sass");
notify = require("gulp-notify"); // エラー通知
plumber = require("gulp-plumber"); // エラー時のタスク停止防止
autoprefixer = require("gulp-autoprefixer"); // ベンダープレフィックス付与
sourcemaps = require("gulp-sourcemaps"); // ソースマップ出力
debug = require("gulp-debug"); // ログ表示
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
    OUTPUT: "./dist"
  },
  SASS: {
    SOURCE: "./src/sass/*.scss",
    OUTPUT: "./dist/assets/css"
  },
  TS: {
    SOURCE: "./src/ts/*.ts",
    OUTPUT: "./dist/assets/js"
  },
  IMAGE: {
    SOURCE: "./src/image/**",
    OUTPUT: "./dist/assets/image"
  },
  LIB: {
    SOURCE: ["./src/js/lib/*.js", "./src/js/lib/*.css"],
    OUTPUT: "./dist/assets/js/lib"
  },
  BROWSERSYNC: {
    DOCUMENT_ROOT: "./dist",
    INDEX: "index.html",
    GHOSTMODE: {
      clicks: false,
      forms: false,
      scroll: false
    }
  }
};

// サーバー起動
const buildServer = (done) => {
  browserSync.init({
    port: 8080,
    server: {
      baseDir: CONF.BROWSERSYNC.DOCUMENT_ROOT,
      index: CONF.BROWSERSYNC.INDEX
    },
    startPath: "",
    reloadOnRestart: true
  });
  done();
};

// ブラウザ自動リロード
const browserReload = (done) => {
  browserSync.reload();
  done();
};

const compileEjs = () => {
  return src(CONF.EJS.SOURCE)
    .pipe(ejs({}, {}, { ext: ".html" }))
    .pipe(rename({ extname: ".html" }))
    .pipe(dest(CONF.EJS.OUTPUT));
};

// style.scssをタスクを作成する
const compileSass = (done) => {
  // style.scssファイルを取得
  return (
    src(CONF.SASS.SOURCE)
      .pipe(
        plumber({
          errorHandler: notify.onError("Error: <%= error.message %>")
        })
      )
      .pipe(sourcemaps.init())
      // Sassのコンパイルを実行
      .pipe(
        sass({
          includePaths: ["src/sass"],
          outputStyle: "expanded"
        })
      )
      .pipe(
        autoprefixer({
          cascade: true
        })
      )
      .pipe(sourcemaps.write("/maps"))
      // cssフォルダー以下に保存
      .pipe(dest(CONF.SASS.OUTPUT))
      .pipe(debug({ title: "scss dest:" }))
  );
};

const bundleTs = () => {
  return src(CONF.TS.SOURCE)
    .pipe(typescript({ target: "ES6" }))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(dest(CONF.TS.OUTPUT));
};

const LibFunc = () => {
  return src(CONF.LIB.SOURCE) //結果をwatchへ返却する
    .pipe(dest(CONF.LIB.OUTPUT)); //指定のディレクトリに移動させる
};

const imageFunc = () => {
  return src(CONF.IMAGE.SOURCE) //結果をwatchへ返却する
    .pipe(dest(CONF.IMAGE.OUTPUT)); //指定のディレクトリに移動させる
};

//Watch
const watchFiles = () => {
  watch(CONF.EJS.SOURCE, series(compileEjs));
  watch(CONF.SASS.SOURCE, series(compileSass));
  watch(CONF.IMAGE.SOURCE, series(imageFunc));
  watch(CONF.LIB.SOURCE, series(LibFunc));
  watch(CONF.TS.SOURCE, series(bundleTs));
  watch(CONF.BROWSERSYNC.DOCUMENT_ROOT, series(browserReload));
};

exports.default = series(series(compileEjs, compileSass, LibFunc, imageFunc, bundleTs, buildServer, watchFiles));
