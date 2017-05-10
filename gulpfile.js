/*jslint esversion: 6, browser: true*/
/*global window, console, $, jQuery, require, alert*/

const gulp = require('gulp'),
      concatCss = require('gulp-concat-css'),
      concatJs = require('gulp-concat'),
      minCss = require('gulp-csso'),
      minJs = require('gulp-uglify'),
      rename = require('gulp-rename'),
      maps = require('gulp-sourcemaps'),
      del = require('del');

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
  'src/img/avatars/**',
  'src/img/photos/large/**',
  'src/img/photos/*.jpg'
];

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
    .pipe(gulp.dest('dist/css'));
});

gulp.task('minifyScripts', ['concatScripts'], () => {
  return gulp.src('src/js/app.js')
    .pipe(minJs())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('clean', function () {
  del(['dist', 'src/css/application.css*', 'src/js/app*.js*']);
});

gulp.task('build', ['minifyStylesheets', 'minifyScripts'], () => {
  return gulp.src(sourceBuild, {base: 'src'})
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
