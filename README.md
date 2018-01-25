Static Assets Compiler for Meteor

## Installation

1. Install the package

```bash
meteor add nathantreid:static-assets
```

## Usage

Once imported, static files will now be published at the path `static/path/to/file`.
The default import will provide you with a string path to the file.

```js
import someImage from `/imports/client/an-image.svg`;

console.log(someImage); // outputs static/imports/client/an-image.svg
```

## Options

The plugin options can be customized under a staticAssets entry in package.json. The default options are shown below:
```json
{
  "staticAssets": {
    "extensions": [
      "jpg",
      "png",
      "svg"
    ],
    "pathPrefix": "static/",
    "exportAbsolutePaths": true
  }
}
```

`extensions`: The file extensions that this plugin will handle. Changes to this option require a Meteor restart to take effect.
`pathPrefix`: The prefix for the hosting path. The default prefix `static/` will cause the file `/imports/client/an-image.svg` to be hosted at `static/imports/client/an-image.svg`.
`exportAbsolutePaths`: Toggle whether or not to export absolute paths using `Meteor.absoluteUrl`. When true and using the development defaults,
 will change the exported path shown above from `static/imports/client/an-image.svg` to `http://localhost:3000/static/imports/client/an-image.svg`

## Filtering unwanted files
If for some reason you need to filter the files that this plugin can see (for example to exclude the `node_modules` directory), remember that you can use the `.meteorignore` file for this purpose with any build plugin.
See https://github.com/meteor/meteor/pull/9123 for more info.
