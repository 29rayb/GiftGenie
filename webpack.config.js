// var ETP = require("extract-text-webpack-plugin");
module.exports = {
  // think of it as your Angular `app.js` file;
  entry: './client/app/app.js',
  // will be outputted file you'll reference in your index.jade
  output: {
    // root;
    path: __dirname,
    filename: 'bundle.js'
  },
  // plugins work at bundle or chunk level and usually work at the end of the bundle process;
  plugins: [
    // additional node modules that usually work on resulting bundle;
    // i.e. uglifyJSPlugin takes the bundle.js and minimizes
    // and obfuscates the contents to decrease the file size.
    // i.e. extract-text-webpack-plugin: uses css / style -loader to
    // gather all CSS into one place and extracts the result into a
    // separate external styles.css file and includes it index.html
    // new ETP("styles.css")
  ],
  module: {
    // additional node modules that help 'load' or 'import' files of various types
    // into browser acceptable formats like JS, Stylesheets and so on;
    // Webpack searches for CSS files dependecies inside the modules;
    // loaders work at the individual file level before or during the bundle is generated;
    loaders: [
      {
        test: /\.js$/,  // test for .js file, if it passes, use the loader
        exclude: /(node_modules|vendor)/,
        loader: 'babel'
        // query: {presets: ['es2015']} // can be put in separate file: .babelrc
      }
      // to dump style.css into the <style> tag inside the HTML
      // chaining works from right to left and are separated by !
      // {
        // test: /\.css$/, loader:ETP.extract("style-loader", "css-loader")
        // loader: 'style!css'// same as style-loader!css-loader;
      // }
    ]
  }
  // resolve: {
  //   // this tells webpack where actually to find jquery because
  //   // you'll need it in the provideplugin
  //   alias: {
  //     jquery: path.resolve(__dirname, './client/vendor/jquery/dist/jquery.min.js')
  //   }
  // },
  // plugins: [
  //   // this tells webpack to provide the "$" variable globally in all
  //   // your app files as jquery
  //   new webpack.ProvidePlugin({
  //     $: "jquery",
  //   })
  // ]
};

// require.context allows us to grab hold of all files in a directory,
// even down through subdirectories if a 'true' boolean is passed as the
// second parameter, and a regex can even be passed as third parameter to
// do cool stuff like omit bullshit

// webpack-dev-server:
// hot: enables Hot Module Reloading that tries to reload just the component
// that's changed instead of the entire page;
// inline: option adds live reloading for the entire page;
// if we pass both options, then when the source changes, HMR happens first;

