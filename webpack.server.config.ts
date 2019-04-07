import path from "path";
import { Configuration } from "webpack";
import nodeExternals from "webpack-node-externals";
import { CheckerPlugin } from "awesome-typescript-loader";

const webpackConfig: Configuration = {
  name: "server",
  entry: {
    server: "./src/server/index.ts"
  },
  output: {
    path: path.join(__dirname, "build"),
    publicPath: "/",
    filename: "[name]/index.js"
  },
  target: "node",
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "awesome-typescript-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: ["node_modules", "./src"]
  },
  plugins: [new CheckerPlugin()]
};

export default webpackConfig;
