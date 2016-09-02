const fs = require('fs');
const uuid = require('node-uuid');
const path = require('path');
const rc = require('rc');
const argv = require('minimist')(process.argv.slice(2));

const project = argv.project;
const HOME = process.env.HOME;
const DYNAMIC_PROFILES_DIR = path.join(HOME, 'Library/Application Support/iTerm2/DynamicProfiles');

const { projectRoot, apps } = rc(project);

function template({ name, cmd = '' } = {}) {
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

const fileStream = fs.createWriteStream(path.join(DYNAMIC_PROFILES_DIR, `${project}.json`));

fileStream.write(`{
"Profiles": [
`);

apps.forEach(function (ctx, i) {
  if (i === (apps.length - 1)) fileStream.end(template(ctx) + '\n]\n}');
  else fileStream.write(template(ctx) + ',\n');
});
