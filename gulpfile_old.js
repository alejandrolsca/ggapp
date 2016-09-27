var gulp = require('gulp'),
    gutil = require('gulp-util'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    changed = require('gulp-changed'),
    livereload = require('gulp-livereload'),
    fs = require('fs'),
    cleanCSS = require('gulp-clean-css'),
    htmlreplace = require('gulp-html-replace'),
    config = require('./gulp/config');

gulp.task('markup', function () {
    return gulp.src(config.markup.src)
        .pipe(htmlreplace({
            'vendorcss': 'content/css/vendor.min.css',
            'maincss': 'content/css/main.min.css',
            'vendorjs': 'content/js/vendor.min.js',
            'js': 'content/js/js.min.js',
            'app': 'content/js/app.min.js'
        }))
        .pipe(gulp.dest(config.markup.dest))
        .pipe(notify({
            title: "markup",
            message: "<%= file.relative %> done!.",
            onLast: true,
        }));
});

gulp.task('bundle', function () {
    return buildScript(config.bundle.src, true);
});

gulp.task('jslibs', function (done) {
    config.js.libs.forEach(function (lib) {
        var sourceMap = lib + '.map';
        fs.exists(sourceMap, function (exists) {
            if (exists) {
                gulp.src(sourceMap)
                    .pipe(gulp.dest(config.js.dest))
            }
        })
    });

    return gulp.src(config.js.libs)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(config.js.base))
        .pipe(notify({
            title: "vendor js",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(config.js.dest))
        .pipe(notify({
            title: "vendor js",
            message: "<%= file.relative %> done!.",
            onLast: true,
        }))
});

gulp.task('js', function () {
    return gulp.src(config.js.src)
        .pipe(concat('js.js', { newLine: '; \r\n' }))
        .pipe(gulp.dest(config.js.base))
        .pipe(notify({
            title: "js",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(config.js.dest))
        .pipe(notify({
            title: "js",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }));
});

gulp.task('csslibs', function (done) {
    return gulp.src(config.css.libs)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(config.css.base))
        .pipe(cleanCSS({ debug: true }, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(notify({
            title: "vendor css",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(config.css.dest))
        .pipe(notify({
            title: "vendor css",
            message: "<%= file.relative %> done!.",
            onLast: true,
        }))
});

gulp.task('css', function () {
    return gulp.src(config.css.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(config.css.base))
        .pipe(cleanCSS({ debug: true }, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(notify({
            title: "css",
            message: "<%= file.relative %> done!.",
            onLast: false,
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(config.css.dest))
        .pipe(notify({
            title: "css",
            message: "<%= file.relative %> done!.",
            onLast: true,
        }))
});

gulp.task('images', function (done) {
    return gulp.src(config.images.src)
        .pipe(changed(config.images.dest)) // Ignore unchanged files
        //.pipe(imagemin()) // Optimize
        .pipe(gulp.dest(config.images.dest))
        .pipe(notify({
            title: "images",
            message: "<%= file.relative %> copied to dist!.",
            onLast: false,
        }));
});

gulp.task('fontslibs', function (done) {
    return gulp.src(config.fonts.libs)
        .pipe(changed(config.fonts.base)) // Ignore unchanged files
        .pipe(gulp.dest(config.fonts.base))
        .pipe(notify({
            title: "vendor fonts",
            message: "<%= file.relative %> copied to src!.",
            onLast: false,
        }))
        .pipe(changed(config.fonts.dest))  // Ignore unchanged files
        .pipe(gulp.dest(config.fonts.dest))
        .pipe(notify({
            title: "vendor fonts",
            message: "<%= file.relative %> copied to dist!.",
            onLast: false,
        }))
});

gulp.task('fonts', function (done) {
    return gulp.src(config.fonts.src)
        .pipe(changed(config.fonts.dest)) // Ignore unchanged files
        .pipe(gulp.dest(config.fonts.dest))
        .pipe(notify({
            title: "fonts",
            message: "font <%= file.relative %> copied to dist.",
            onLast: false,
        }));
});

gulp.task('html', function () {
    return gulp.src(config.html.src, { base: config.src })
        .pipe(changed(config.html.dest))  // Ignore unchanged files
        .pipe(gulp.dest(config.html.dest));
});

var watchPaths = [
    config.bundle.src,
    config.js.libs,
    config.js.src,
    config.css.libs,
    config.css.src,
    config.images.src,
    config.fonts.src,
    config.html.src,
];

// watch file
gulp.task('watch', function (done) {
    gulp.watch(config.markup.src, ['markup']);
    gulp.watch(config.js.libs, ['jslibs']);
    gulp.watch(config.js.src, ['js']);
    gulp.watch(config.css.src, ['csslibs']);
    gulp.watch(config.css.src, ['css']);
    gulp.watch(config.images.src, ['images']);
    gulp.watch(config.fonts.src, ['fontslibs']);
    gulp.watch(config.fonts.src, ['fonts']);
    gulp.watch(config.html.src, ['html']);

    gulp.watch(watchPaths)
        .on('change', function (file) {
            console.log('File ' + file.path + ' was ' + file.type + ', running tasks...');
            //livereload.changed(file.path);
        });

    //livereload.listen();
});

gulp.task('default', ['markup', 'bundle', 'jslibs', 'js', 'csslibs', 'css', 'images', 'fontslibs', 'fonts', 'html', 'watch'], function () {

});

function handleErrors(error) {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'Compile Error',
        message: error.message
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {

    var props = {
        entries: [file],
        debug: true,
        transform: [] //will transform the source code before the parsing
    };

    // watchify() if watch requested, otherwise run browserify() once 
    var bundler = watch ? watchify(browserify(props)) : browserify(props);

    function rebundle() {
        console.log('rebundle...');
        var stream = bundler.bundle();
        stream
            .on('error', handleErrors)
            .pipe(source(file)) // gives streaming vinyl file object
            .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
            .pipe(rename({ dirname: '', basename: 'app', extname: '.js' }))
            .pipe(gulp.dest(config.js.base))
            .pipe(notify({
                title: "watchify",
                message: "bundle <%= file.relative %> done!.",
                onLast: false,
            }))
            .pipe(uglify()) // now gulp-uglify works 
            .pipe(rename({ basename: 'app', extname: '.min.js' }))
            .pipe(gulp.dest(config.js.dest))
            .pipe(notify({
                title: "watchify",
                message: "bundle <%= file.relative %> done!.",
                onLast: true,
            }));
    }

    // listen for an update and run rebundle
    bundler.on('update', function () {
        rebundle();
    });

    // run it once the first time buildScript is called
    return rebundle();
}