import { Property, ObjectExpression } from 'estree';

const recast = require("recast");
const n = recast.types.namedTypes;
const b = recast.types.builders;

import { URI } from '../URI';
import { resolveStringValue } from '../utils';
// import { Component as ComponentMeta } from '@angular/core';


export class BaseExpression {
  constructor(protected objExpression: ObjectExpression) {

  }

  getProp(propName: string): Property {
    return this.objExpression.properties.find( p => (<any>p.key).name === propName);
  }
}

export class ComponentExpression extends BaseExpression {

  get template(): string {
    const prop = this.getProp('template') as any;
    if (prop) {
      return resolveStringValue(prop.value);
    }
  }

  setTemplate(value: string | URI): void {
    const prop = this.getProp('template') as any;
    let valueExp;

    if (URI.isURI(value)) {
      valueExp = recast.parse(`require('${value.path}')`).program.body[0].expression;
    } else {
      valueExp = b.literal(value);
    }

    if (prop) {
      prop.value = valueExp;
    } else {
      const newProp = b.property('init', b.identifier('template'), valueExp);
      this.objExpression.properties.push(newProp);
    }
  }

  get styles(): string[] {
    const styles: string[] = [];
    const prop = this.getProp('styles') as any;
    if (prop && Array.isArray(prop.value.elements)) {
      for (let litral of prop.value.elements) {
        styles.push(resolveStringValue(litral));
      }
    }

    return styles;
  }

  setStyles(value: Array<string | URI>) {
    const prop = this.getProp('styles') as any;

    const elementsExp = value.map( style => URI.isURI(style)
      ? recast.parse(`require('${style.path}')`).program.body[0].expression
      : b.literal(style)
    );

    if (prop) {
      prop.value.elements = elementsExp;
    } else {
      const newProp = b.property('init', b.identifier('styles'), b.arrayExpression(elementsExp));
      this.objExpression.properties.push(newProp);
    }
  }

  constructor(cmpExpression: ObjectExpression) {
    super(cmpExpression);
  }

}
