'use strict';
import gulp from 'gulp';
import gutil from 'gulp-util';
import concat from 'gulp-concat';
import del from 'del';
import changed from 'gulp-changed';
import gulpIf from 'gulp-if';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
// runs a sequence of gulp tasks in the specified order;
// hack until gulp 4.0 which supports defining task dependencies
import runSequence from 'run-sequence'
import jade from 'gulp-jade';
import minifyCSS from 'gulp-cssnano';
import uncss from 'gulp-uncss';
import autoprefixer from 'gulp-autoprefixer';
import minifyHTML from 'gulp-htmlmin';
// to not get an error, also need to npm install jshint;
// scans a program and reports about commonly made mistakes and potential bugs;
import jshint from 'gulp-jshint';
import uglify from 'gulp-uglify';
// strip console, alert, and debugger statements from JS code;
import stripDebug from 'gulp-strip-debug';
import ngHtml2Js from "gulp-ng-html2js";
// parse build blocks in HTML files to replace references;
// gets all links and all scripts and compiles it into one;
// pagespeed insights with reporting;
import psi from 'psi';
import Pageres from 'pageres';

let paths = {
  scripts: 'client/app/**/*.js',
  images: 'client/images/*',
  css: 'client/styles/*.css',
  components: 'client/app/components/**/*.html',
  jade: 'client/**/*.jade'
};

// to make it run synchronously:done
gulp.task('default', (cb) => {
  runSequence('clean',
              ['css', 'scripts'],
              'jade',
              'components',
              'images',
              'watch',
              cb);
});

gulp.task('clean', () => {
  return gutil.log('gulp is running!!')
  return del(['tmp'])
  return del(['client/dist'])
});

// done
// try to apply the uncss to the vendor/css
gulp.task('css', () => {
  return gulp.src([paths.css])
             .pipe(changed('client/dist/css', {extension: '.css'}))
             .pipe(autoprefixer({
                browsers: ['last 3 versions'],
                cascade: false
              }))
             .pipe(gulp.dest('tmp/css'))
             .pipe(rename({suffix: '.min'}))
             .pipe(minifyCSS().on('error', gutil.log))
             .pipe(gulp.dest('client/dist/css'))

})

// done
gulp.task('scripts', ['jshint'], () => {
  return gulp.src([paths.scripts])
             .pipe(changed('client/dist/js'))
             .pipe(babel({presets: ['es2015']}))
             .pipe(concat('bundle.js'))
             .pipe(gulp.dest('tmp/js'))
             .pipe(rename({suffix: '.min'}))
             .pipe(stripDebug())
             .pipe(uglify().on('error', gutil.log))
             .pipe(gulp.dest('client/dist/js'))
});

// done
gulp.task('jshint', () => {
  return gulp.src('paths.scripts')
             .pipe(jshint())
             .pipe(jshint.reporter('jshint-stylish'))
             .pipe(jshint.reporter('fail'));
});

// compile to HTML:done
// would be awesome to incorporate gulp-useref;
gulp.task('jade', () => {
  return gulp.src(paths.jade)
             .pipe(changed('client/dist/index'))
             // .pipe(useref()) doesn't work: gets rid of comments
             // during converting Jade to HTML
             .pipe(jade({
                pretty: true
              }))
             .pipe(gulpIf('index.html', gulp.dest('tmp/index')))
             .pipe(minifyHTML({
                collapseWhitespace:true,
                minifyJS:true,
                minifyURLs: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
              }))
             .pipe(rename({suffix: '.min'}))
             .pipe(gulpIf('index.min.html', gulp.dest('client/dist/index')))

})

// templatecaching for quick retrieval: done;
gulp.task('components', () => {
  return gulp.src(paths.components)
             .pipe(changed('client/dist/js/components'))
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
             .pipe(gulp.dest('tmp/js'))
             .pipe(rename({suffix: '.min'}))
             .pipe(stripDebug())
             .pipe(uglify().on('error', gutil.log))
             .pipe(gulp.dest('client/dist/js'))
})

// done
gulp.task('images', () => {
  return gulp.src(paths.images)
             .pipe(changed('client/dist/images'))
             .pipe(imagemin({
                progressive: true,
                interlaced: true,
                multipass: true,
                optimizationLevel: 5,
                svgoPlugins: [
                  {removeViewBox: false},
                  {cleanupIDs: false}
                ],
                use: [pngquant()]
              }))
             .pipe(gulp.dest('client/dist/images'))
})

gulp.task('watch', () => {
  gulp.watch(paths.scripts, ['scripts', 'jshint']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.components, ['components']);
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
