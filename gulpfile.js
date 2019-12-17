'use strict';

// SASS Packages
const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const gls = require('gulp-live-server');

// JS packages
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const babel = require('gulp-babel');

var server = gls.new('./src/server.js', {}, true);

gulp.task('sassworkflow', function () {
    gulp.src([
      'node_modules/bootstrap/dist/css/bootstrap.css',
            './src/sass/**/*.scss'
    ])
    // tasks go here
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist/css/'))
});

// add linting
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
            './src/js/*.js'
        ])
        .pipe(babel({
          // transpile ES6 to ES5
          presets: ['@babel/preset-env']
        }))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('html', function() {
    return gulp.src(['src/*.html'])
        .pipe(gulp.dest('./dist'))
});

gulp.task('server', function() {
    return server.start();
})

gulp.task('default',['sassworkflow', 'scripts', 'lint', 'html', 'server'], function(){});

