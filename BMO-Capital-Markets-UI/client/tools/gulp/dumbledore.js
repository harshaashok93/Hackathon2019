const fs = require('fs');
const gulp = require('gulp');
const eslint = require('gulp-eslint');

const SOURCE = ['client/**/*.+(js|jsx)', '!client/tools/**'];
const DEST = 'dumbledore-lint.json';

function reset() {
  fs.writeFileSync(DEST, JSON.stringify({ messages: {} }));
}

function writeFile(lintResult) {
  fs.writeFileSync(DEST, JSON.stringify(lintResult, 0, 2));
}

function lint(source) {
  let lintResult;

  try {
    lintResult = JSON.parse(fs.readFileSync(DEST));
  } catch (e) {
    lintResult = { messages: {} };
    fs.writeFileSync(DEST, lintResult);
  }

  return gulp.src(source)
    .on('exit', () => writeFile(lintResult))
    .on('end', () => writeFile(lintResult))
    .pipe(eslint({ quiet: false }))
    .pipe(eslint.format())
    .pipe(eslint.result(result => {
      if (result.messages.length > 0) {
        lintResult.messages[result.filePath] = result;
      } else {
        delete lintResult.messages[result.filePath];
      }
    }));
}

gulp.task('dumbledore-lint', () => {
  reset();
  return lint(SOURCE);
});

gulp.task('dumbledore-watch', ['dumbledore-lint'], () => {
  gulp.watch(SOURCE, event => lint(event.path));
});
