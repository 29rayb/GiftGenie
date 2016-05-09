// moves every require("style.css") in entry chunks into a separate css output file;
// will be faster b/c stylesheet bundle is loaded in parallel to JS bundle;
// var ETP = require("extract-text-webpack-plugin");
module.exports = {
  // to optimize common code with caching between two components that share code
  // var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
  // put plugins: [commonPlugin] and load <script: src="build/common.js"></script>
  // think of it as your Angular `app.js` file;
  entry: './client/app/app.js',
  // have multi-components,
  // entry: {
  //   Profile: './profile.js',
  //   Feed: './feed.js'
  // },
  // output: {
  //   path: 'build',
  //   filename: '[name].js'
  // }
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
      },
      // {
      //   test:/\.(png|jpg)$/,
      //   loader: 'url-loader?limit=8192'
      // }
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
  //   // to enable requiring files without specifying the extensions, you must add
  //   // a resolve.extensions parameter specifying which files webpack searches for;
  //   extensions: ['', '.js', '.jxs']
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

// <b> webpack-dev-server: <b>
// hot: enables Hot Module Reloading that tries to reload just the component
// that's changed instead of the entire page;
// inline: option adds live reloading for the entire page;
// if we pass both options, then when the source changes, HMR happens first;

// async loading for dependencies
// don't want to have to download features until you actually need them;
// specify the split point where you want to load async;
// 
// if(window.location.pathname === '/feed'){
// showLoadingstate();
// require.ensure([], function(){
//  hideLoadingState();
//  require('./feed').show(); // when this function is called, the module is sync. avail.
// });
// } else if (window.location.pathname === '/profile'){
// showLoadingState();
// require.ensure([], function(){
//  hideLoadingState();
//  require('./profile').show();
// })
// }





















