/*jslint esversion: 6, browser: true*/
/*global window, console, $, jQuery, require, alert*/

const gulp = require('gulp'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      maps = require('gulp-sourcemaps');

gulp.task('concatScripts', () => {
  return gulp.src([
    'src/js/jquery.js',
    'src/js/fastclick.js',
    'src/js/foundation.js',
    'src/js/foundation.equalizer.js',
    'src/js/foundation.reveal.js'
  ])
    .pipe(maps.init())
    .pipe(concat('app.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('src/js'));
});

gulp.task('minifyScripts', ['concatScripts'], function () {
  return gulp.src('src/js/app.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('src/js'));
});