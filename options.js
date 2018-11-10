import loadJsonFile from 'load-json-file';
import meteorProjectPath from 'meteor-project-path';
import path from 'path';
import sha1 from './sha1';

global.nathantreidStaticAssets = global.nathantreidStaticAssets || { lastNotifiedHash: null, };
const optionsFilePath = path.join(meteorProjectPath || '', 'package.json');

const defaultOptions = {
  extensions: [
    'gif',
    'jpg',
    'png',
    'svg',
  ],
  pathPrefix: 'static/',
  exportAbsolutePaths: true,
};

let initialExtensions;
let options;

loadOptions();
initialExtensions = JSON.stringify(options.extensions);

function loadOptions() {
  const previousHash = options ? options.hash : null;
  const userOptions = loadOptionsFromFile();
  options = { ...defaultOptions, ...userOptions };
  options.hash = sha1(JSON.stringify(options));

  if (previousHash && previousHash !== options.hash && global.nathantreidStaticAssets.lastNotifiedHash !== options.hash) {
    global.nathantreidStaticAssets.lastNotifiedHash = options.hash;
    console.info('nathantreid:static-assets plugin options updated, recompiling all static assets.');

    if (JSON.stringify(options.extensions) !== initialExtensions) {
      console.warn(`The list of extensions handled by the nathantreid:static-assets plugin has changed to: ${options.extensions}.\nThis change requires a manual Meteor restart to take effect.\n`)
    }
  }
}

function loadOptionsFromFile() {
  /* The Meteor project path is only null when publishing */
  return meteorProjectPath
    ? loadJsonFile.sync(optionsFilePath).staticAssets || {}
    : {};
}

export default function getOptions() {
  loadOptions();

  return options;
}
