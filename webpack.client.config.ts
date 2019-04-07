import path from "path";
import { Configuration } from "webpack";
import HtmlWebPackPlugin from "html-webpack-plugin";
import { CheckerPlugin } from "awesome-typescript-loader";

const webpackConfig: Configuration = {
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
    new HtmlWebPackPlugin({
      template: "./src/client/index.html",
      filename: "./index.html",
      excludeChunks: ["server"]
    }),
    new CheckerPlugin()
  ]
};

export default webpackConfig;
