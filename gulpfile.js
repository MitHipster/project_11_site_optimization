/*jslint esversion: 6, browser: true*/
/*global window, console, $, jQuery, require, alert*/

const gulp = require('gulp'),
      concat = require('gulp-concat');

gulp.task('concatScripts', () => {
  return gulp.src([
    'src/js/jquery.js',
    'src/js/fastclick.js',
    'src/js/foundation.js',
    'src/js/foundation.equalizer.js',
    'src/js/foundation.reveal.js'
  ]);
});