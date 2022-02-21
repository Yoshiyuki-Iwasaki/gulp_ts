module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development",

  // ローカル開発用環境を立ち上げる
  // 実行時にブラウザが自動的に localhost を開く
  devServer: {
    contentBase: "dist",
    open: true, // 自動的にブラウザが立ち上がる
  },

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: [`./src/ts/index.ts`, `./src/js/index.js`],

  // babel
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  // import 文で .ts ファイルを解決するため
  // これを定義しないと import 文で拡張子を書く必要が生まれる。
  // フロントエンドの開発では拡張子を省略することが多いので、
  // 記載したほうがトラブルに巻き込まれにくい。
  resolve: {
    // 拡張子を配列で指定
    extensions: [".ts", ".js"],
  },
  // ファイルの出力設定
  output: {
    // 出力ファイル名
    filename: "bundle.js",
  },
};
