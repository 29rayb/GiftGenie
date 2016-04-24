'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var uncss = require('gulp-uncss');
var uglify = require('gulp-uglify');
var pump = require('pump');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jscs = require('gulp-jscs');
var watch = require('gulp-watch');
var stripDebug = require('gulp-strip-debug');
var changed = require('gulp-changed');
var zip = require('gulp-zip');
var del = require('del');
var templateCachce = require('gulp-angular-templatecache');

var jscpd = require('gulp-jscpd');
var psi = require('psi');
var Pageres = require('pageres');
var browserSync = require('browser-sync').create();

gulp.task('default', function(){
  console.log('i love us')
});

// gulp.task('minify-html', function(){
//   return gulp.src('src/*.html')
//              .pipe(htmlmin({collapseWhitespace: true}))
//              .pipe(gulp.dest('dist'))
// })

// gulp.task('compress', function(cb){
//   pump([
//     gulp.src('lib/*.js'),
//     uglify();
//     gulp.dest('dist')
//   ],
//   cb
//   );
// });

// gulp.task('sass', function(){
//   return gulp.src('./sass/**/*.scss')
//              .pipe(sass().on('error', sass.logError))
//              .pipe(gulp.dest('./css'))
// })

// gulp.task('sass:watch', function(){
//   gulp.watch('./sass/**/*.scss', ['sass'])
// })

// gulp.task('browser-sync', function(){
//   browserSync.init({
//     server: {
//       baseDir: "./"
//     }
//   });
// });

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







