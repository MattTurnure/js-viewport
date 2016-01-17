'use strict';

var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    del         = require('del'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    htmlmin     = require('gulp-htmlmin'),
    cssnano     = require('gulp-cssnano'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;

var sassOptions = {
    defaultEncoding: 'UTF-8',
    lineNumbers: true,
    style: 'expanded',
    precision: 8
};

gulp.task('html', function () {
    return gulp.src('src/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('sass', function () {
    gulp.src('src/scss/**/*.scss')
    .pipe(concat('demo.css'))
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/demo'))
    .pipe(browserSync.stream());
});

gulp.task('packageSass', function () {
    return gulp.src('src/scss/js-viewport.scss')
        .pipe(gulp.dest('dist/'));
});

gulp.task('packageCSS', function () {
    gulp.src('src/scss/js-viewport.scss')
    .pipe(rename('js-viewport.css'))
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('packageScripts', function () {
    return gulp.src('src/js-viewport.js')
        .pipe(gulp.dest('dist/'));
});

gulp.task('demoScripts', function () {
    return gulp.src([
            'src/js-viewport.js',
            'src/demo.js',
            'src/demo.layout.js'
        ])
        .pipe(concat('demo.js'))
        .pipe(gulp.dest('dist/demo'));
});

gulp.task('clean', function (cb) {
    del(['dist'], cb);
});

gulp.task('build', ['html', 'sass', 'packageSass', 'packageCSS', 'packageScripts', 'demoScripts']);

gulp.task('default', ['build']);

gulp.task('serve', ['html', 'sass', 'demoScripts'], function () {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/**/*.js', ['demoScripts']);
    gulp.watch('src/index.html', ['html']);

    gulp.watch('src/index.html').on('change', reload);
    gulp.watch('dist/demo/demo.js').on('change', reload);
});