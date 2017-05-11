/*jslint esversion: 6, browser: true*/
/*global window, console, $, jQuery, require, alert*/

const gulp = require('gulp'),
      concatCss = require('gulp-concat-css'),
      concatJs = require('gulp-concat'),
      minCss = require('gulp-csso'),
      minJs = require('gulp-uglify'),
      rename = require('gulp-rename'),
      gzip = require('gulp-gzip'),
      maps = require('gulp-sourcemaps'),
      del = require('del'),
      imgResize = require('gulp-image-resize');

const sourceCss = [
  'src/css/normalize.css',
  'src/css/foundation.css',
  'src/css/basics.css',
  'src/css/menu.css',
  'src/css/hero.css',
  'src/css/photo-grid.css',
  'src/css/modals.css',
  'src/css/footer.css',
];

const sourceJs = [
  'src/js/jquery.js',
  'src/js/fastclick.js',
  'src/js/foundation.js',
  'src/js/foundation.equalizer.js',
  'src/js/foundation.reveal.js'
];

const sourceBuild = [
  'src/css/application.min.css',
  'src/js/app.min.js',
  'src/index.html',
  'src/img/avatars/*.jpg'
];

const sourceImg = 'src/img/photos/orig/p*.jpg';
const sourceHdr = 'src/img/photos/orig/header.jpg';

gulp.task('concatStylesheets', () => {
  return gulp.src(sourceCss)
    .pipe(maps.init())
    .pipe(concatJs('application.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('src/css'));
});

gulp.task('concatScripts', () => {
  return gulp.src(sourceJs)
    .pipe(maps.init())
    .pipe(concatJs('app.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('src/js'));
});

gulp.task('minifyStylesheets', ['concatStylesheets'], () => {
  return gulp.src('src/css/application.css')
    .pipe(minCss())
    .pipe(rename('application.min.css'))
    .pipe(gzip())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('minifyScripts', ['concatScripts'], () => {
  return gulp.src('src/js/app.js')
    .pipe(minJs())
    .pipe(rename('app.min.js'))
    .pipe(gzip())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('imgResizeSm', () => {
  gulp.src(sourceImg)
    .pipe(imgResize({
      width: 600,
      quality: 0.8,
      imageMagick: true
    }))
    .pipe(gulp.dest('dist/img/photos'));
});

gulp.task('imgResizeLg', () => {
  gulp.src(sourceImg)
    .pipe(imgResize({
      width: 900,
      quality: 0.9,
      imageMagick: true
    }))
    .pipe(gulp.dest('dist/img/photos/large'));
});

gulp.task('imgResizeHdr', () => {
  gulp.src(sourceHdr)
    .pipe(imgResize({
      percentage: 50,
      quality: 0.9,
      imageMagick: true
    }))
    .pipe(gulp.dest('dist/img/photos/large'));
});

gulp.task('imgResizePhotos', ['cleanPhotos'], () => {
  gulp.start('imgResizeSm');
  gulp.start('imgResizeLg');
  gulp.start('imgResizeHdr');
});

gulp.task('cleanPhotos', () => {
  del('dist/img/photos');
});

gulp.task('clean', () => {
  del(['dist', 'src/css/application.css*', 'src/js/app*.js*']);
});

gulp.task('build', ['minifyStylesheets', 'minifyScripts'], () => {
  return gulp.src(sourceBuild, {base: 'src'})
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
