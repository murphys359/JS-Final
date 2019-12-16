'use strict';

// SASS Packages
const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const autoprefixer = require('gulp-autoprefixer');

// JS packages
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const babel = require('gulp-babel');

// Web packages
const browserSync = require('browser-sync').create();

// Code from https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e
gulp.task('browserSync', ['nodemon'], function() {
    browserSync.init(null,{
        proxy:"http://localhost:5000",
        files:["dist/**/*.*"],
        port: 7000
    })
})

gulp.task('nodemon', function (cb) {
    
    var started = false;
    
    return nodemon({
        script: 'dist/server.js'
    }).on('start', function () {
        if (!started) {
            cb();
            started = true; 
        } 
    });
});

gulp.task('sassworkflow', function () {
    gulp.src([
      'node_modules/bootstrap/dist/css/bootstrap.css',
            './src/sass/**/*.scss'
    ])
    // tasks go here
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
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
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            './src/js/*.js'
        ])
        .pipe(sourcemaps.init())
         .pipe(babel({
          // transpile ES6 to ES5
          presets: ['@babel/preset-env']
        }))
        .pipe(concat('scripts.js'))
        .pipe(terser())
        .pipe(gulp.dest('./dist/js'))
        .pipe(sourcemaps.write())
        .pipe(rename('scripts.min.js'))
        .pipe(browserSync.reload({
             stream: true
         }))
});

gulp.task('html', function() {
    return gulp.src(['src/*.html', 'src/*.js'])
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.reload({
             stream: true
         }));
});

gulp.task('default',['sassworkflow', 'scripts', 'lint', 'html','browserSync'], function() {
    gulp.watch('./src/js/*.js', ['lint', 'scripts']);
    gulp.watch('./src/sass/**/*.scss', ['sassworkflow']);
    gulp.watch('./src/*.html',['html']);
    gulp.watch('./src/*.js', ['html']);
})
