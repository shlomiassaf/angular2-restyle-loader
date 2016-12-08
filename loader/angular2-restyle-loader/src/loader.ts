import { ComponentVisitor } from './ast/ComponentVisitor';
import { RestyleLoaderContext } from './options';
import { URI as _URI } from './URI';

function invokeIf(objOrFn: any, ...args: any[]): any {
  if (typeof objOrFn === 'function') {
    return objOrFn(...args);
  } else {
    return objOrFn;
  }
}

function resolveValue(this: RestyleLoaderContext, value: string | _URI): Promise<string | _URI> {
  return Promise.resolve(value)
    .then( result => {
      if (typeof result === 'string') {
        return result;
      } else if (_URI.isURI(result)) {
        const context = this.query.context || process.cwd();
        let resolve, reject, promise = new Promise( (res, rej) => {resolve = res; reject = rej; });

        this.resolve(context, result.path, (err, fullPath) => {
          if (err) {
            reject(err);
          } else {
            this.addDependency(fullPath);
            resolve(loader.uri(fullPath));
          }
        });
       return promise;
      } else {
        throw new Error('ResourceReplace not supported.');
      }
    })
}

function loader (this: RestyleLoaderContext, content: string): string | undefined {
  this.cacheable && this.cacheable();

  if (this.query && typeof this.query !== 'string') {
    const callback = this.async();
    const promises = [];
    const visitor = new ComponentVisitor(content);

    if (visitor.length > 0) {
      for (let c of this.query.components) {
        if (visitor.has(c.selector)) {
          const cmpExp = visitor.find(c.selector);

          if (c.template) {
            const p = resolveValue.call(this, invokeIf(c.template, cmpExp.template))
              .then( val => cmpExp.setTemplate(val) );
            promises.push(p);
          }

          if (c.styles) {
            const p = Promise.resolve(invokeIf(c.styles, cmpExp.styles))
              .then( arr => Promise.all(arr.map( val => resolveValue.call(this, val) )) )
              .then( arr => cmpExp.setStyles(arr) );
            promises.push(p);
          }
        }
      }
    }

    if (promises.length > 0) {
      Promise.all(promises).then( () => callback(null, visitor.genCode(true)) );
    } else {
      callback(null, content);
    }
  } else {
    return content;
  }
}

module loader {
  export const seperable = true;

  export const URI = _URI;

  export function uri(path) {
    return new _URI(path);
  }

  export const isURI = _URI.isURI;
}

export = loader;


