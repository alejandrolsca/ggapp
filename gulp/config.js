var src = './src';
var dest = './dist';

module.exports = {
  server: {
    port: 3000,
    baseDir: dest
  },
  liveReload: {
    port: 35729
  },
  bundle: {
    src: src + '/app/app.js'
  },
  js: {
    src: [
      src + '/scripts/**/*.js',
    ],
    base: src + '/content/js/',
    dest: dest + '/content/js/',
    libs: [
      './bower_components/angular/angular.js',
      './bower_components/angular-ui-router/release/angular-ui-router.js',
      './bower_components/angular-animate/angular-animate.js',
      './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      './bower_components/qrcode/lib/qrcode.js',
      './bower_components/angular-qr/src/angular-qr.js',
      './bower_components/wijmo/Dist/controls/wijmo.js',
      './bower_components/wijmo/Dist/controls/wijmo.grid.js',
      './bower_components/wijmo/Dist/controls/wijmo.grid.filter.js',
      './bower_components/wijmo/Dist/interop/angular/wijmo.angular.js',
      './bower_components/jquery/dist/jquery.js',
      './bower_components/bootstrap/js/dropdown.js',
      './bower_components/bootstrap/js/collapse.js',
      './bower_components/bootstrap/js/tooltip.js',
      './bower_components/bootstrap/js/popover.js',
      './bower_components/bootstrap/js/modal.js',
      './bower_components/bootstrap/js/tab.js',
      './bower_components/auth0-lock/build/lock.js',
      './bower_components/angular-lock/dist/angular-lock.js',
      './bower_components/angular-jwt/dist/angular-jwt.js'
    ]
  },
  css: {
    src: src + '/sass/**/*.scss',
    base: src + '/content/css/',
    dest: dest + '/content/css/',
    libs: [
      './bower_components/bootstrap/dist/css/bootstrap.css',
      './bower_components/animate.css/animate.css',
      './bower_components/wijmo/Dist/styles/wijmo.css'
    ],
    settings: {
      outputStyle: ['compressed'],
      errLogToConsole: true
    }
  },

  images: {
    src: src + '/content/img/**/*',
    dest: dest + '/content/img/'
  },
  fonts: {
    src: src + '/content/fonts/**/*',
    base: src + '/content/fonts/',
    dest: dest + '/content/fonts/',
    libs: [
      './bower_components/bootstrap/dist/fonts/**/*',
    ]
  },
  markup: {
    src: [
      src + '/index.html'
    ],
    dest: dest + '/'
  },
  html: {
    src: [
      src + '/**/*.html',
      '!'.concat(src + '/index.html'),
    ],
    dest: dest + '/'
  },
};