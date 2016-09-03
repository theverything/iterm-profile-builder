const fs = require('fs');
const uuid = require('node-uuid');
const path = require('path');

const HOME = process.env.HOME;
const DYNAMIC_PROFILES_DIR = path.join(HOME, 'Library/Application Support/iTerm2/DynamicProfiles');

function template({ project, projectRoot, name, cmd = '' } = {}) {
  return String.raw`{
  "Badge Text": "${name}",
  "Working Directory": "${path.join(projectRoot, name)}",
  "Prompt Before Closing 2": 0,
  "Unlimited Scrollback": true,
  "Tags": [
    "${project}"
  ],
  "Name": "${name}",
  "Guid": "${uuid.v4()}",
  "Custom Directory": "Yes",
  "Initial Text": "${cmd}",
}`;
}

module.exports = function buildProfiles(project, config) {
  const fileStream = fs.createWriteStream(path.join(DYNAMIC_PROFILES_DIR, `${project}.json`));
  const { projectRoot, apps } = config;

  fileStream.on('error', function (error) {
    console.error('ERROR: ', error);
    process.exit(1);
  });

  fileStream.write(`{
  "Profiles": [
  `);

  apps.forEach(function (ctx, i) {
    const profile = template(Object.assign({ project, projectRoot }, ctx));

    if (i === (apps.length - 1)) {
      fileStream.end(profile + '\n]\n}');
    } else {
      fileStream.write(profile + ',\n');
    }
  });
}
