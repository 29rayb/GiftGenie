'use strict';
let gulp = require('gulp');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let imagemin = require('gulp-imagemin');
let pngquant = require('imagemin-pngquant');
let del = require('del');
let changed = require('gulp-changed');
let gutil = require('gulp-util');
let jshint = require('gulp-jshint');
let babel = require('gulp-babel');
let sass = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');
let minifyCSS = require('gulp-cssnano');
let autoprefixer = require('gulp-autoprefixer');
let rename = require('gulp-rename');
let minifyHTML = require('gulp-htmlmin');
let ngHtml2Js = require("gulp-ng-html2js");
let stripDebug =require('gulp-strip-debug');
let uncss = require('gulp-uncss');
let rev = require('gulp-rev');
let revCollector = require('gulp-rev-collector');
let git = require('gulp-git');
let useref = require('gulp-useref');
let gulpIf = require('gulp-if');
let ignore = require('gulp-ignore');
let revReplace = require('gulp-rev-replace');
let filter = require('gulp-filter');

var pump = require('pump');
var stripDebug = require('gulp-strip-debug');
var zip = require('gulp-zip');

var psi = require('psi');
var Pageres = require('pageres');


// this loads all the plugins in the package.json, but now
// have to refer to them as plugins.name() rather than name()
// so plugins.gulp-util rather than gutil
// var plugins = require('gulp-load-plugins');

let paths = {
  scripts: 'client/app/**/*.js',
  images: 'client/images/*',
  cssAssets: 'client/vendor/**/*.css',
  jsAssets: 'client/vendor/**/*.js',
  // scss: 'client/*.scss',
  css: 'client/*.css',
  html: 'client/app/components/**/*.html',
  index: './index.html'
};

gulp.task('default', ['clean',  'css', 'scripts', 'refd', 'index', 'html', 'images', 'watch']);

gulp.task('clean', function(){
  return gutil.log('gulp is running!!')
  return del(['build']);
});

// need the links and scripts from here;
gulp.task('refd', function(){
  var jsFilter = filter("**/*.js", { restore: true });
  var cssFilter = filter("**/*.css", { restore: true });
  return gulp.src(paths.index)
             .pipe(useref())
             .pipe(jsFilter)
             .pipe(uglify())
             .pipe(jsFilter.restore)
             .pipe(cssFilter)
             .pipe(minifyCSS())
             .pipe(cssFilter.restore)
             .pipe(rev())
             .pipe(revReplace())
             .pipe(gulp.dest('build/index'))
})

// need the index.html from here;
gulp.task('index', function(){
  return gulp.src(paths.index)
             .pipe(sourcemaps.init())
             .pipe(changed('build/hmtl'))
             .pipe(rename({suffix: '.min'}))
             .pipe(minifyHTML({
                collapseWhitespace:true,
                minifyJS:true,
                minifyURLs: true,
                removeComments: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
              }))
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('build/html'))
})

// need the templatecache-angular views.html from here;
gulp.task('html', function(){
  return gulp.src(paths.html)
             .pipe(sourcemaps.init())
             .pipe(changed('build/js/components'))
             .pipe(ngHtml2Js({
                moduleName: function(file){
                  let pathParts = file.path.split('/');
                  let folder = pathParts[pathParts.length - 2];
                  return folder.replace(/-[a-z]/g, function(match){
                    return match.substr(1).toUpperCase();
                  });
                }
              }))
             .pipe(concat('components.js'))
             .pipe(gulp.dest('build/js'))
             .pipe(rename({suffix: '.min'}))
             .pipe(uglify().on('error', gutil.log))
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('build/js'))
})

// dont really need anything from here;
gulp.task('css', function(){
  return gulp.src([paths.css])
             .pipe(sourcemaps.init())
             .pipe(changed('build/css', {extension: '.css'}))
             .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
              }))
             .pipe(uncss({
              html: ['index.html', paths.html]
             }))
             .pipe(gulp.dest('build/css'))
             .pipe(rename({suffix: '.min'}))
             .pipe(minifyCSS().on('error', gutil.log))
             .pipe(rev())
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('build/css'))

})


// for sass-only
// change the build/scss to build/css when using sass
gulp.task('build-css', function(){
  return gulp.src(paths.scss)
             .pipe(sourcemaps.init())
             .pipe(changed('build/scss', {extension: '.css'}))
             .pipe(sass({outputStyle: 'compressed'}).on('error', gutil.log))
             .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
              }))
             .pipe(concat({path: 'style.css', cwd: ''}))
             .pipe(uncss({
                html: ['index.html', paths.html]
              }))
             .pipe(gulp.dest('build/scss'))
             .pipe(rename({suffix: '.min'}))
             .pipe(minifyCSS().on('error', gutil.log))
             .pipe(rev())
             .pipe(sourcemaps.write('.'))
             // can't get it to work
             // .pipe(rev.manifest({
             //    base: 'build/css',
             //    merge: true
             //  }))
             .pipe(gulp.dest('build/scss'))
})

// don't really need anything from here;
gulp.task('scripts', function(){
  return gulp.src([paths.scripts])
             .pipe(sourcemaps.init()) // proecss the original sources
             .pipe(babel({presets: ['es2015']}))
             .pipe(changed('build/js'))
             .pipe(stripDebug())
             .pipe(concat({path: 'bundle.js', cwd: ''}))
             .pipe(gulp.dest('build/js'))
             .pipe(rename({suffix: '.min'}))
             .pipe(uglify().on('error', gutil.log))
             .pipe(rev())
             .pipe(sourcemaps.write('.')) // add the map to modified source
             // can't get it to work
             // .pipe(rev.manifest({
             //    base: 'build/js',
             //    merge: true
             //  }))
             .pipe(gulp.dest('build/js'))
});

// needs the images
gulp.task('images', function(){
  return gulp.src(paths.images)
             .pipe(changed('build/images'))
             .pipe(imagemin({
                proressive: true,
                interlaced: true,
                multipass: true,
                optimizationLevel: 5,
                svgoPlugins: [
                  {removeViewBox: false},
                  {cleanupIDs: false}
                ]
              }))
             .pipe(rev())
             // doesn't work
             // .pipe(rev.manifest({
             //    base: 'build/images',
             //    merge: true
             //  }))
             .pipe(gulp.dest('build/images'))
})

gulp.task('watch', function(){
  gulp.watch(paths.scripts, ['scripts', 'jshint']);
  gulp.watch(paths.css, ['css']);
  // gulp.watch(paths.scss, ['build-css']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.index, ['refd', 'index']);
});

gulp.task('jshint', function(){
  return gulp.src('paths.scripts')
             .pipe(jshint())
             .pipe(jshint.reporter('jshint-stylish'))
             .pipe(jshint.reporter('fail'));
});

psi('http://giftsgenies.herokuapp.com/#/').then(data => {
  console.log(data.ruleGroups.SPEED.score);
  console.log(data.pageStats);
})

psi.output('http://giftsgenies.herokuapp.com/#/').then(() => {
  console.log('donee')
});

psi('http://giftsgenies.herokuapp.com/#/', {nokey: 'true', strategy: 'mobile'}).then(data => {
  console.log('Speed score: ' + data.ruleGroups.SPEED.score);
  console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
});

// working;
// const pageres = new Pageres({delay: 2})
//     .src('http://localhost:3000/', ['480x320', '1024x768', 'iphone 6'], {crop: true})
//     .src('http://giftsgenies.herokuapp.com/#/', ['480x320', '1024x768', 'iphone 6'])
//     .dest('client/images/screenshots')
//     .run()
//     .then(() => console.log('done'));
