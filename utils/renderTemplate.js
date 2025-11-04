const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

exports.renderTemplate = (templateName, data) => {
  const filePath = path.join(__dirname, `../templates/${templateName}.html`);
  const source = fs.readFileSync(filePath, 'utf8');
  const template = handlebars.compile(source);
  return template(data);
};
