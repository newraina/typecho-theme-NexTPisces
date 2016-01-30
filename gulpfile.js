var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var order = require("gulp-order");

gulp.task('mainScript', function() {
    gulp.src(['src/js/src/*.js', 'src/js/src/schemes/*.js'])
        .pipe(order([
            'motion.js',
            'jutils.js',
            'bootstrap.js',
            'affix.js',
            'schemes/*.js'
        ]))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('postScript', function() {
    gulp.src('src/js/src_post/*.js')
        .pipe(concat('postNeed.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('mainCss', function() {
    gulp.src(['src/css/*.css','vendors/font-awesome/css/font-awesome.min.css'])
        .pipe(concat('main.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('copyFont', function() {
    gulp.src(['vendors/font-awesome/fonts/*.*'])
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('default', ['mainScript', 'postScript', 'mainCss', 'copyFont']);
