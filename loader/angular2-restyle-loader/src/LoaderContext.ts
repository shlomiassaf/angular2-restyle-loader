export interface LoaderContext<T> {
  /**
   * Loader API version. Currently 2.
   * This is useful for providing backwards compatibility.
   * Using the version you can specify custom logic or fallbacks for breaking changes.
   */
  version: string;


  /**
   *  The directory of the module. Can be used as context for resolving other stuff.
   *  In the example: /abc because resource.js is in this directory
   */
  context: string;

  /**
   * The resolved request string.
   * In the example: "/abc/loader1.js?xyz!/abc/node_modules/loader2/index.js!/abc/resource.js?rrr"
   */
  request: string;


  /**
   *  A string. The query of the request for the current loader.
   *  In the example: in loader1: "?xyz", in loader2: ""
   */
  query: T;


  /**
   * A data object shared between the pitch and the normal phase.
   */
  data?: any;

  async(): (err: Error, content?: string) => void;

  /**
   *  Make this loader result cacheable. By default it's not cacheable.
   *  A cacheable loader must have a deterministic result, when inputs and dependencies haven't changed.
   *  This means the loader shouldn't have other dependencies than specified with this.addDependency.
   *  Most loaders are deterministic and cacheable.
   */
  cacheable(flag?: boolean): void;

  /**
   * loaders = [{request: string, path: string, query: string, module: function}]
   * An array of all the loaders. It is writeable in the pitch phase.
   * In the example:
   * [
   *   { request: "/abc/loader1.js?xyz",
   *     path: "/abc/loader1.js",
   *     query: "?xyz",
   *     module: [Function]
   *   },
   *   { request: "/abc/node_modules/loader2/index.js",
   *     path: "/abc/node_modules/loader2/index.js",
   *     query: "",
   *     module: [Function]
   *   }
   *]
   */
  loaders: any[];

  /**
   * The index in the loaders array of the current loader.
   * In the example: in loader1: 0, in loader2: 1
   */
  loaderIndex: number;

  /**
   * The resource part of the request, including query.
   * In the example: "/abc/resource.js?rrr"
   */
  resource: string;

  /**
   * The resource file.
   * In the example: "/abc/resource.js"
   */
  resourcePath: string

  /**
   * The query of the resource.
   * In the example: "?rrr"
   */
  resourceQuery: string;

  /**
   * Emit a warning.
   * @param message
   */
  emitWarning(message: string): void;

  /**
   * Emit a error.
   * @param message
   */
  emitError(message: string): void;

  /**
   * Execute some code fragment like a module.
   *
   * Don't use require(this.resourcePath), use this function to make loaders chainable!
   *
   * @param code
   * @param filename
   */
  exec(code: string, filename: string): any;


  /**
   * Resolve a request like a require expression.
   * @param context
   * @param request
   * @param callback
   */
  resolve(context: string, request: string, callback: (err: Error, result: string) => void): any

  /**
   * Resolve a request like a require expression.
   * @param context
   * @param request
   */
  resolveSync(context: string, request: string): string


  /**
   * Adds a file as dependency of the loader result in order to make them watchable.
   * For example, html-loader uses this technique as it finds src and src-set attributes.
   * Then, it sets the url's for those attributes as dependencies of the html file that is parsed.
   * @param file
   */
  addDependency(file: string): void;

  /**
   * Adds a file as dependency of the loader result in order to make them watchable.
   * For example, html-loader uses this technique as it finds src and src-set attributes.
   * Then, it sets the url's for those attributes as dependencies of the html file that is parsed.
   * @param file
   */
  dependency(file: string): void;

  /**
   * Add a directory as dependency of the loader result.
   * @param directory
   */
  addContextDependency(directory: string): void

  /**
   * Remove all dependencies of the loader result. Even initial dependencies and these of other loaders. Consider using pitch.
   */
  clearDependencies(): void;


  /**
   * Pass values to the next loader.
   * If you know what your result exports if executed as module, set this value here (as a only element array).
   */
  value: any;

  /**
   * Passed from the last loader.
   * If you would execute the input argument as module, consider reading this variable for a shortcut (for performance).
   */
  inputValue: any;

  /**
   * The options passed to the Compiler.
   */
  options: any;

  /**
   * A boolean flag. It is set when in debug mode.
   */
  debug: boolean;

  /**
   * Should the result be minimized.
   */
  minimize: boolean;

  /**
   * Should a SourceMap be generated.
   */
  sourceMap: boolean;


  /**
   * Target of compilation. Passed from configuration options.
   * Example values: "web", "node"
   */
  target: 'web' | 'node' | string;

  /**
   * This boolean is set to true when this is compiled by webpack.
   *
   * Loaders were originally designed to also work as Babel transforms.
   * Therefore if you write a loader that works for both, you can use this property to know if
   * there is access to additional loaderContext and webpack features.
   */
  webpack: boolean;


  /**
   * Emit a file. This is webpack-specific.
   * @param name
   * @param content
   * @param sourceMap
   */
  emitFile(name: string, content: Buffer|String, sourceMap: any): void


  /**
   * Access to the compilation's inputFileSystem property.
   */
  fs: any;

  /**
   * Hacky access to the Compilation object of webpack.
   */
  _compilation: any;

  /**
   * Hacky access to the Compiler object of webpack.
   */
  _compiler: any;


  /**
   * Hacky access to the Module object being loaded.
   */
  _module

}
