const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const seq = require('gulp-sequence');
const rm = require('gulp-rm');

// General
gulp.task('clean', function() {
    return gulp.src(['./server/dist/**/*.*'], { read: false })
        .pipe(rm());
});

gulp.task('lint', function() {
    return gulp
        .src(['server/js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format());
});

// Server side
gulp.task('js', function() {
    return gulp
      .src('server/js/**/*.js')
        .pipe(babel({
            presets: ['es2015'],
        }))
        .pipe(gulp.dest('./server/dist'));
});

gulp.task('watch', function() {
    gulp.watch('./server/js/**/*.js', ['js']);
});

gulp.task('default', seq('clean', 'lint', 'js'));
