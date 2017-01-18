'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);

const templates = {}

fs.readdirSync(__dirname)
  .filter(item => fs.statSync(path.join(__dirname, item)).isDirectory())
  .forEach(folder => {
    templates[folder] = {};
    fs.readdirSync(path.join(__dirname, folder))
      .filter(item => item.indexOf('.js') > -1)
      .forEach(templateFile => {
        templates[folder][templateFile.slice(0, templateFile.length - 3)] = require(path.join(__dirname, folder, templateFile));
      });
  });

module.exports = templates;
