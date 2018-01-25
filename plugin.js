import AssetsCompiler from './compiler';
import getOptions from './options';

Plugin.registerCompiler({
  extensions: getOptions().extensions,
}, () => new AssetsCompiler());
