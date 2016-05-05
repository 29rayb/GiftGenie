'use strict';
const gulp = require('gulp');
let gutil = require('gulp-util');
let concat = require('gulp-concat');
let del = require('del');
let rimraf = require('rimraf');
let addsrc = require('gulp-add-src');
let changed = require('gulp-changed');
let gulpIf = require('gulp-if');
let ignore = require('gulp-ignore');
let filter = require('gulp-filter');
let rename = require('gulp-rename');
let babel = require('gulp-babel');
let imagemin = require('gulp-imagemin');
let pngquant = require('imagemin-pngquant');
let bower = require('gulp-bower');
// runs a sequence of gulp tasks in the specified order;
// hack until gulp 4.0 which supports defining task dependencies
const runSequence = require('run-sequence')
let jade = require('gulp-jade');
let sourcemaps = require('gulp-sourcemaps');
let rev = require('gulp-rev');
let revCollector = require('gulp-rev-collector');
let revReplace = require('gulp-rev-replace');
let minifyCSS = require('gulp-cssnano');
let uncss = require('gulp-uncss');
let autoprefixer = require('gulp-autoprefixer');
let minifyHTML = require('gulp-htmlmin');
// to not get an error, also need to npm install jshint;
// scans a program and reports about commonly made mistakes and potential bugs;
let jshint = require('gulp-jshint');
let uglify = require('gulp-uglify');
// strip console, alert, and debugger statements from JS code;
let stripDebug =require('gulp-strip-debug');
let ngHtml2Js = require("gulp-ng-html2js");
// parse build blocks in HTML files to replace references;
// gets all links and all scripts and compiles it into one;
let useref = require('gulp-useref')
let inject = require('gulp-inject');
let wiredep =require('wiredep')
// pagespeed insights with reporting;
let psi = require('psi');
let Pageres = require('pageres');

let paths = {
  scripts: 'client/app/**/*.js',
  images: 'client/images/*',
  css: 'client/styles/*.css',
  html: 'client/app/components/**/*.html',
  index: 'client/**/*.jade'
};

// to make it run synchronously
gulp.task('default', (cb) => {
  runSequence('clean',
              ['css', 'scripts'],
              'refd',
              'index',
              'html',
              'images',
              'watch',
              cb);
});

gulp.task('clean', () => {
  return gutil.log('gulp is running!!')
  return del(['dist']);
});

// need the links and scripts from here;
gulp.task('refd', () => {
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
             .pipe(gulp.dest('dist/index'))
})

// need the index.html from here;
gulp.task('index', () => {
  return gulp.src(paths.index)
             .pipe(sourcemaps.init())
             .pipe(changed('dist/hmtl'))
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
             .pipe(gulp.dest('dist/html'))
})

// need the templatecache-angular views.html from here;
gulp.task('html', () => {
  return gulp.src(paths.html)
             .pipe(sourcemaps.init())
             .pipe(changed('dist/js/components'))
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
             .pipe(gulp.dest('dist/js'))
             .pipe(rename({suffix: '.min'}))
             .pipe(uglify().on('error', gutil.log))
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('dist/js'))
})

// dont really need anything from here;
gulp.task('css', () => {
  return gulp.src([paths.css])
             .pipe(sourcemaps.init())
             .pipe(changed('dist/css', {extension: '.css'}))
             .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
              }))
             .pipe(uncss({
              html: ['index.html', paths.html]
             }))
             .pipe(gulp.dest('dist/css'))
             .pipe(rename({suffix: '.min'}))
             .pipe(minifyCSS().on('error', gutil.log))
             .pipe(rev())
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('dist/css'))

})

// don't really need anything from here;
gulp.task('scripts', () => {
  return gulp.src([paths.scripts])
             .pipe(sourcemaps.init()) // proecss the original sources
             .pipe(babel({presets: ['es2015']}))
             .pipe(changed('dist/js'))
             .pipe(stripDebug())
             .pipe(concat({path: 'bundle.js', cwd: ''}))
             .pipe(gulp.dest('dist/js'))
             .pipe(rename({suffix: '.min'}))
             .pipe(uglify().on('error', gutil.log))
             .pipe(rev())
             .pipe(sourcemaps.write('.')) // add the map to modified source
             // can't get it to work
             // .pipe(rev.manifest({
             //    base: 'dist/js',
             //    merge: true
             //  }))
             .pipe(gulp.dest('dist/js'))
});

// perfect;
gulp.task('images', () => {
  return gulp.src(paths.images)
             .pipe(changed('dist/images'))
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
             .pipe(gulp.dest('dist/images'))
})

gulp.task('watch', () => {
  gulp.watch(paths.scripts, ['scripts', 'jshint']);
  gulp.watch(paths.css, ['css']);
  // gulp.watch(paths.scss, ['dist-css']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.index, ['refd', 'index']);
});

gulp.task('jshint', () => {
  return gulp.src('paths.scripts')
             .pipe(jshint())
             .pipe(jshint.reporter('jshint-stylish'))
             .pipe(jshint.reporter('fail'));
});

// getting the pagespeed insights report
psi('http://giftsgenies.herokuapp.com/#/').then(data => {
  console.log(data.ruleGroups.SPEED.score);
  console.log(data.pageStats);
})
// output a format report to the terminal
psi.output('http://giftsgenies.herokuapp.com/#/').then(() => {
  console.log('donee')
});
// supply options to PSI and get back speed and usability scores;
psi('http://giftsgenies.herokuapp.com/#/', {nokey: 'true', strategy: 'mobile'}).then(data => {
  console.log('Speed score: ' + data.ruleGroups.SPEED.score);
  console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
});

const pageres = new Pageres({delay: 2})
    .src('http://localhost:3000/', ['480x320', '1024x768', 'iphone 6'], {crop: true})
    .src('http://giftsgenies.herokuapp.com/#/', ['480x320', '1024x768', 'iphone 6'])
    .dest('./responsive-testing')
    .run()
    .then(() => console.log('done'));
