import { CachingCompiler } from 'meteor/caching-compiler';
import getOptions from './options';

let packageOptions;

export default class AssetsCompiler extends CachingCompiler {
  constructor() {
    super({
      compilerName: 'static-assets',
      defaultCacheSize: 1024 * 1024 * 10,
    });
  }

  getCacheKey(inputFile) {
    return `${packageOptions.hash}.${inputFile.getSourceHash()}`;
  }

  compileResultSize(compileResult) {
    return compileResult.source.length;
  }

  processFilesForTarget(files) {
    packageOptions = getOptions();

    super.processFilesForTarget(files);
  }

  compileOneFile(inputFile) {
    return { source: inputFile.getContentsAsBuffer(), };
  }

  addCompileResult(inputFile, compileResult) {
    const hostingPath = `${packageOptions.pathPrefix}${inputFile.getPathInPackage()}`;
    let exportCode;
    exportCode = packageOptions.exportAbsolutePaths
      ? `module.exports = require('meteor/meteor').Meteor.absoluteUrl('${hostingPath}');`
      : `module.exports = '${hostingPath}';`;

    inputFile.addJavaScript({
      path: inputFile.getPathInPackage() + '.js',
      sourcePath: inputFile.getPathInPackage(),
      data: exportCode,
    });

    inputFile.addAsset({
      data: inputFile.getContentsAsBuffer(),
      path: `${hostingPath}`,
    });
  }
}
