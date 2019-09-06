const _        = require('lodash');
const async    = require('async');
const fs       = require('fs');
const gulp     = require('gulp');
const inquirer = require('inquirer');
const mkdirp   = require('mkdirp');
const path     = require('path');

const BASEPATH     = path.join(__dirname, '../..');
const PROJECT_NAME = 'BMO Capital Markets';
const FILE_LIST    = [
  {
    ext: 'jsx',
    template: path.join(__dirname, 'templates/ComponentJSX.jst'),
  },
  {
    ext: 'scss',
    template: path.join(__dirname, 'templates/ComponentSass.jst'),
  },
];

function getFullpath(options, { componentBase, component, filepath }) {
  const filename = `${component}.${options.ext}`;
  const fullpath = path.join(componentBase, filepath, component, filename);

  return fullpath;
}

function generateMetadata({ filename, filepath, type }) {
  const componentBase = type === 'container'
    ? path.join(BASEPATH, 'containers')
    : path.join(BASEPATH, 'components', `${type}s`);

  return {
    extension     : path.extname(filename).toLowerCase(),
    component     : _.upperFirst(_.camelCase(filename)),
    kebabName     : _.kebabCase(filename),
    projectName   : PROJECT_NAME,
    basepath      : BASEPATH,
    componentBase,
    filepath,
  };
}

function onInquirerConfirm(answers) {
  const metadata = generateMetadata(answers);

  console.log('\tFile/component name:', metadata.component);

  FILE_LIST.forEach(function(item) {
    console.log(getFullpath(item, metadata));
  });

  return 'Is this correct?';
}

function writeFile(options, metadata, callback) {
  fs.readFile(options.template, function(err, data) {
    if (err) throw err;

    const fullpath = getFullpath(options, metadata);

    // Add mixins
    metadata.path     = path;
    metadata.fullpath = fullpath;

    const filedata = _.template(data)(metadata);

    // Write the directory path
    mkdirp(path.dirname(fullpath), function (err) {
      if (err) throw err;

      // Write the template file
      fs.writeFile(fullpath, filedata, function(err) {
        if (err) throw err;

        callback(); // Finished!
      });
    });
  });
}

function generateFiles(templateFiles, metadata, callback) {
  let index = 0;
  let current;

  async.whilst(
    function() {
      return index < templateFiles.length;
    },
    function(next) {
      current = templateFiles[index++];
      writeFile(current, metadata, next);
    },
    function() {
      callback();
    }
  );
}

function onInquirerDone(answers, callback) {
  if (answers.confirmed) {
    const metadata = generateMetadata(answers);

    generateFiles(FILE_LIST, metadata, callback);
  }
}

gulp.task('generate', function(done) {
  console.log(' └── generate');

  inquirer.prompt([
    {
      message: 'What would you like to generate?',
      type: 'list',
      name: 'type',
      choices: [
        { name: 'Atom', value: 'atom' },
        { name: 'Molecule', value: 'molecule' },
        { name: 'Organism', value: 'organism' },
        { name: 'Page', value: 'page' },
        { name: 'Container', value: 'container' },
      ],
    },
    {
      message: 'Enter the component name (use UpperCamelCase/PascalCase):',
      type: 'input',
      name: 'filename',
    },
    {
      message: 'Enter the subdirectory path where you\'d like to generate the files (skip for default path):',
      type: 'input',
      name: 'filepath',
    },
    {
      message: onInquirerConfirm,
      type: 'confirm',
      name: 'confirmed',
    },
  ]).then(function(answers) {
    onInquirerDone(answers, done);
  });
});
