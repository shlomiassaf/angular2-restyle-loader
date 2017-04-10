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
        if (n.AssignmentExpression.check(path.parentPath.parentPath.parentPath.value)) {
          const assignment = path.parentPath.parentPath.parentPath.value;
          if (n.Identifier.check(assignment.left.property) && assignment.left.property.name === 'decorators') {
            const argsProp = path.value.properties.find(p=>p.key.name === 'args');
            if (argsProp) {
              const decMeta = argsProp.value.elements.find( el => el.properties.find(p => p.key.name === 'selector'));
              if (decMeta) {
                const selector: any = decMeta.properties.find( p =>  p.key.name === 'selector' );
                  if (selector && !n.Identifier.check(selector.value)) {
                    components.set(resolveStringValue(selector.value), new ComponentExpression(decMeta));
                  }
              }
            }
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
