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
    const packageRelativeHostingPath = `${packageOptions.pathPrefix}${inputFile.getPathInPackage()}`;
    const appRelativeHostingPath = inputFile.getPackageName() ? `packages/${inputFile.getPackageName().replace(':', '_')}/${packageRelativeHostingPath}` : packageRelativeHostingPath;
    let exportCode;
    exportCode = packageOptions.exportAbsolutePaths
      ? `module.exports = require('meteor/meteor').Meteor.absoluteUrl('${appRelativeHostingPath}').replace(new RegExp('^.*//.*?/'), '/');`
      : `module.exports = '${appRelativeHostingPath}';`;

    inputFile.addJavaScript({
      path: inputFile.getPathInPackage() + '.js',
      sourcePath: inputFile.getPathInPackage(),
      data: exportCode,
    });

    inputFile.addAsset({
      data: inputFile.getContentsAsBuffer(),
      path: `${packageRelativeHostingPath}`,
    });
  }
}
