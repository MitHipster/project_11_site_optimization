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

// CSS source files
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

// Javascript source files
const sourceJs = [
  'src/js/jquery.js',
  'src/js/fastclick.js',
  'src/js/foundation.js',
  'src/js/foundation.equalizer.js',
  'src/js/foundation.reveal.js'
];

// Location of files and folders to remove using 'clean'
const sourceClean = [
  'dist/index.html',
  'dist/css',
  'dist/img/avatars',
  'dist/js',
  'src/js/app.min.js',
  'src/css/application.css*',
  'src/js/app*.js*'
];

// Files to copy from src into dist
const sourceBuild = [
  'src/index.html',
  'src/img/avatars/*.jpg'
];

const sourceAppCss = 'src/css/application.css';
const sourceAppJs = 'src/js/app.js';

// Source images for resizing
const sourceImg = 'src/img/photos/orig/p*.jpg';
const sourceHdr = 'src/img/photos/orig/header.jpg';

// Location of photos in dist
const sourcePhotos = 'dist/img/photos';
const sourcePhotosLg = 'dist/img/photos/large';

// Task to concatenate CSS and create source map
gulp.task('concatStylesheets', () => {
  return gulp.src(sourceCss)
    .pipe(maps.init())
    .pipe(concatCss('application.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('src/css'));
});

// Task to concatenate JS and create source map
gulp.task('concatScripts', () => {
  return gulp.src(sourceJs)
    .pipe(maps.init())
    .pipe(concatJs('app.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('src/js'));
});

// Task to minify CSS and generate gzip file
gulp.task('minifyStylesheets', ['concatStylesheets'], () => {
  return gulp.src(sourceAppCss)
    .pipe(minCss())
    .pipe(rename('application.min.css'))
    .pipe(gzip())
    .pipe(gulp.dest('dist/css'));
});

// Task to minify JS and generate gzip file
gulp.task('minifyScripts', ['concatScripts'], () => {
  return gulp.src(sourceAppJs)
    .pipe(minJs())
    .pipe(rename('app.min.js'))
    .pipe(gzip())
    .pipe(gulp.dest('dist/js'));
});

// Task to resize original images to smaller size to improve initial page load
gulp.task('imgResizeSm', () => {
  gulp.src(sourceImg)
    .pipe(imgResize({
      width: 600,
      quality: 0.8,
      imageMagick: true
    }))
    .pipe(gulp.dest(sourcePhotos));
});

// Task to resize original images to larger size for modal view
gulp.task('imgResizeLg', () => {
  gulp.src(sourceImg)
    .pipe(imgResize({
      width: 900,
      quality: 0.9,
      imageMagick: true
    }))
    .pipe(gulp.dest(sourcePhotosLg));
});

// Task to resize header to half its original size to improve initial page load
gulp.task('imgResizeHdr', () => {
  gulp.src(sourceHdr)
    .pipe(imgResize({
      percentage: 50,
      quality: 0.9,
      imageMagick: true
    }))
    .pipe(gulp.dest(sourcePhotosLg));
});

// Task to clean photos from dist folder before recreating
gulp.task('cleanPhotos', () => {
  del(sourcePhotos);
});

// Combination of all photo tasks
gulp.task('imgResizePhotos', ['cleanPhotos'], () => {
  gulp.start('imgResizeSm');
  gulp.start('imgResizeLg');
  gulp.start('imgResizeHdr');
});

// Task to clean dist folder before recreating - excludes photo folders
gulp.task('clean', () => {
  del(sourceClean);
});

// Combined build task excluding photos
gulp.task('build', ['minifyStylesheets', 'minifyScripts'], () => {
  return gulp.src(sourceBuild, {base: 'src'})
    .pipe(gulp.dest('dist'));
});

// Default task that runs 'clean' and 'build'. Does not effect the photos folder
gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
