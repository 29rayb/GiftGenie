module.exports = {
  // think of it as your Angular `app.js` file;
  entry: './client/app/app.js',
  // will be outputted file you'll reference in your index.jade
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  plugins: [
    //yo
  ],
  module: {
    loaders: [
      // load nothing yet;
    ]
  },
  resolve: {
    // this tells webpack where actually to find jquery because
    // you'll need it in the provideplugin
    alias: {
      jquery: path.resolve(__dirname, './client/vendor/jquery/dist/jquery.min.js')
    }
  },
  plugins: [
    // this tells webpack to provide the "$" variable globally in all
    // your app files as jquery
    new webpack.ProvidePlugin({
      $: "jquery",
    })
  ]
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

