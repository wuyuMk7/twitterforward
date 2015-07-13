var gulp = require('gulp');

var gulp_react = require('gulp-react');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');

var paths = {
    js : {
        src: ['app/assets/javascript/*.jsx', 'app/assets/javascript/**/*.jsx'],
        dst: 'public/assets/js',
        minified: 'public/assets/js'
    }
} 

gulp.task('scripts', function () {
    return gulp.src(paths.js.src)
        .pipe(gulp_react())
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js'}))
        .pipe(gulp.dest(paths.js.minified))
});

gulp.task('clean:scripts', function (cb) {
    del('public/assets/js/*.js', cb);
});

gulp.task('default', ['scripts']);
gulp.task('build', ['scripts']);
gulp.task('clean', ['clean:scripts']);
