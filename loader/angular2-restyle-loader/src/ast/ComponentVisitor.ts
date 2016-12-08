const recast = require("recast");
const n = recast.types.namedTypes;

import { resolveStringValue } from '../utils';
import { ComponentExpression } from './ComponentExpression';
// import { generate } from 'escodegen';


export class ComponentVisitor {
  private components = new Map<string, ComponentExpression>();
  private _ast: any;

  get ast(): any {
    return this._ast;
  }

  get length(): number {
    return this.components.size;
  }

  constructor(private code: string) {
    this.visit();
  }


  has(selector: string): boolean {
    return this.components.has(selector);
  }

  find(selector: string): any {
    return this.components.get(selector);
  }

  visit() {
    const ast = recast.parse(this.code, { ecmaVersion: 6, sourceType: 'module' });
    this.components.clear();
    const components = this.components;
    recast.visit(ast, {
      visitObjectExpression: function(path) {
        if (n.CallExpression.check(path.parentPath.parentPath.value)
          && n.Identifier.check(path.parentPath.parentPath.value.callee)
          && path.parentPath.parentPath.value.callee.name === 'Component') {

          const selector: any = path.value.properties.find( p =>  p.key.name === 'selector' );
          if (selector) {
            components.set(resolveStringValue(selector.value), new ComponentExpression(path.value));
          }
        }
        this.traverse(path);
      }
    });

    this._ast = ast;
  }

  genCode(pretty: boolean): string {
    if (pretty) {
      return recast.prettyPrint(this.ast).code
    } else {
      return recast.print(this.ast).code
    }
  }

}
