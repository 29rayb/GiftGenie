module.exports = {
  // name: 'server code, output to ./server',
  entry: './client/app/app.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  plugins: [
    //yo
  ],
  module: {

  }
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

