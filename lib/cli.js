// Generated by CoffeeScript 1.7.1
(function() {
  var bless, colors, formatNumber, fs, input, output, path, pjson, pluralize, program;

  colors = require('colors');

  fs = require('fs');

  path = require('path');

  pjson = require(path.join(__dirname, '..', 'package.json'));

  program = require('commander');

  bless = require(path.join(__dirname, '..', 'lib', 'bless'));

  program.version(pjson.version).usage('<input file> [<output file>] [options]').option('-f, --force', 'modify the input file provided'.yellow).parse(process.argv);

  input = program.args[0];

  if (!input) {
    console.log('blessc: no input provided'.red);
    process.exit(1);
  }

  if (input !== '-' && !/\.css$/.test(input)) {
    console.log('blessc: input file is not a .css file'.red);
    process.exit(1);
  }

  output = program.args[1];

  output = output || input;

  if (output === '-') {
    console.log('blessc: no output file provided'.red);
    process.exit(1);
  }

  if (output === input && !program.force) {
    console.log('blessc: use --force or -f to modify the input file'.red);
    process.exit(1);
  }

  pluralize = function(noun, number) {
    if (number !== 1) {
      noun += 's';
    }
    return noun;
  };

  formatNumber = function(nStr) {
    var rgx, x, x1, x2;
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = (x.length > 1 ? "." + x[1] : "");
    rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  };

  fs.readFile(input, 'utf8', function(err, data) {
    var dirname, extension, fileData, filename, index, info, message, newFilename, numFiles, numSelectors, _i, _len, _ref;
    if (err) {
      throw err;
    }
    info = bless(data);
    numFiles = info.data.length;
    numSelectors = info.numSelectors;
    dirname = path.dirname(output);
    extension = path.extname(output);
    filename = path.basename(output, extension);
    if (numFiles > 1) {
      _ref = info.data;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        fileData = _ref[index];
        newFilename = "" + (path.join(dirname, filename)) + "-blessed" + (index + 1) + extension;
        fs.writeFile(newFilename, fileData, function(err) {
          if (err) {
            throw err;
          }
        });
      }
    }
    message = [];
    message.push("Input file contained " + (formatNumber(numSelectors)) + " " + (pluralize('selector', numSelectors)) + ".");
    if (numFiles > 1) {
      message.push("" + (formatNumber(numFiles)) + " " + (pluralize('file', numFiles)) + " created.");
    } else {
      message.push('No changes made.');
    }
    return console.log(message.join(' ').green.bold);
  });

}).call(this);
