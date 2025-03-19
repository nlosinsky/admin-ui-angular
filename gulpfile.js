const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminPngQuant = require('imagemin-pngquant');
const gzip = require('gulp-gzip');

const path = 'dist/admin-ui-angular';
const assets = `${path}/assets`;

gulp.task('images', () => {
  return gulp.src(`${assets}/**/*`)
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true, optimizationLevel: 3 }),
      imagemin.mozjpeg({ progressive: true }),
      imageminPngQuant({
        quality: [0.65, 0.9],
        speed: 1
      }),
      imagemin.svgo({ plugins: [{ removeViewBox: false }] })
    ]))
    .pipe(gulp.dest(assets));
});

gulp.task('gzip', () => {
  return gulp.src([`${path}/**/*.*`])
    .pipe(gzip({
      append: false,
      gzipOptions: { level: 9 }
    }))
    .pipe(gulp.dest(`${path}-gzip`));
});
