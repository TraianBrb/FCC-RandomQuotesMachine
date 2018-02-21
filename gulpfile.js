var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var del         = require('del');
var runSequence = require('run-sequence');
var surge       = require('gulp-surge');

// Static Server + watching scss/html files
gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: "./build"
    });

    gulp.watch("source/scss/*.scss", ['sass']);
    gulp.watch("source/images/**/*", ['copy:images']);
    gulp.watch("source/javascript/**/*", ['copy:javascript']);
    gulp.watch("source/*.html", ['copy:html']).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("source/scss/main.scss")
        .pipe(sass())
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.stream());
});

// Copy HTML from source to build
gulp.task('copy:html', function() {
    return gulp.src("source/*.html")
        .pipe(gulp.dest("build"));
});

// Copy Images from source to Build
gulp.task('copy:images', function() {
    return gulp.src("source/images/**/*")
        .pipe(gulp.dest("build/images"));
});

// Copy JS from source to Build
gulp.task('copy:javascript', function() {
    return gulp.src("source/javascript/**/*")
        .pipe(gulp.dest("build/javascript"));
});

// Build task that runs once in the beggining
gulp.task('build', function(cb) {
    runSequence(
        'clean',
        ['copy:html', 'sass', 'copy:images', 'copy:javascript'],
        cb);
});

// Deletes the build folder
gulp.task('clean', function() {
    console.log('🔥 Cleans all files in build folder');

    return del(['build']);
});

gulp.task('default', ['serve']);

// Publish to surge
gulp.task('deploy', ['build'], function() {
    return surge({
        project: './build',
        domain: 'rq-machine.surge.sh'
    });
});
