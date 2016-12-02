const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const seq = require('gulp-sequence');
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const autoprefix = require('gulp-autoprefixer');
const uglifyCss = require('gulp-uglifycss');
const concatCss = require('gulp-concat-css');
const rename = require('gulp-rename');


// Server side
gulp.task('lint', function() {
    return gulp
        .src('server/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('server', function() {
    return gulp
      .src('server/**/*.js')
        .pipe(babel({
            presets: ['es2015'],
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function() {
    return gulp.src('dist/**/*.*', { read: false })
        .pipe(rm());
});

// Frontend
gulp.task('static', function() {
    return gulp
        .src('./frontend/scss/main.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: require('node-normalize-scss').includePaths,
        }).on('error', sass.logError))
        .pipe(concatCss('main.css', {
            rebaseUrls: false,
        }))
        .pipe(autoprefix())
        .pipe(gulp.dest('./frontend/public/css'))
        .pipe(rename('main.min.css'))
        .pipe(uglifyCss())
        .pipe(gulp.dest('./frontend/public/css'));
});


gulp.task('icons', function() {
    return gulp.src('./bower_components/components-font-awesome/fonts/**.*')
        .pipe(gulp.dest('./frontend/public/fonts'));
});

gulp.task('frontend', function(cb) {
    return seq('icons', 'static', cb);
});

gulp.task('watch', function() {
    gulp.watch('./frontend/scss/**/*.scss', ['static']);
});

gulp.task('default', seq('clean', 'lint', 'server', 'frontend'));
