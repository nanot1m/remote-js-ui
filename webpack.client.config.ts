import path from "path";
import { Configuration } from "webpack";
import HtmlWebPackPlugin from "html-webpack-plugin";
import { CheckerPlugin } from "awesome-typescript-loader";
import { Configuration as DevServerType } from "webpack-dev-server";
// @ts-ignore
import WebpackMessages from "webpack-messages";

const webpackConfig: Configuration & { devServer?: DevServerType } = {
  name: "client",
  entry: {
    client: "./src/client/index.tsx"
  },
  output: {
    path: path.join(__dirname, "build/client"),
    publicPath: "/",
    filename: "[name].[hash].js"
  },
  target: "web",
  devtool: "#source-map",
  devServer: {
    port: 8081,
    proxy: {
      "/ws": {
        target: "http://localhost:8080",
        ws: true
      }
    },
    stats: {
      all: false,
      publicPath: true
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "awesome-typescript-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.html$/,
        use: ["html-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: ["node_modules", "./src"]
  },
  plugins: [
    new WebpackMessages({
      name: "client",
      logger: (str: string) => console.log(`>> ${str}`)
    }),
    new HtmlWebPackPlugin({
      template: "./src/client/index.html",
      filename: "./index.html",
      excludeChunks: ["server"]
    }),
    new CheckerPlugin()
  ]
};

export default webpackConfig;
