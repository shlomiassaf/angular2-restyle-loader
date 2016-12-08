const recast = require("recast");
const n = recast.types.namedTypes;

/**
 * Resolves a string expression from an AST property value.
 * Supports Literal, BinaryExpression and TemplateLiteral instructions.
 * BinaryExpression and TemplateLiteral are supported if their internal instructions are Literal only.
 * @param value
 * @returns string
 */
export function resolveStringValue(value: any /* Expression | Pattern */): string {
  if (n.Literal.check(value)) {
    return value.value;
  } else if (n.BinaryExpression.check(value) && value.operator === '+') {
    return resolveStringValue(value.left) + resolveStringValue(value.right);
  } else if (n.TemplateElement.check(value)) {
    return value.value.cooked;
  } else if (n.TemplateLiteral.check(value)) {
    const vals = [], len = value.expressions.length;
    let i = 0;

    for (i; i<len; i++) {
      vals.push(resolveStringValue(value.quasis[i]));
      vals.push(resolveStringValue(value.expressions[i]));
    }
    vals.push(resolveStringValue(value.quasis[i]));

    return vals.join('');
  }
  else {
    throw new Error(`Can't resolve static string. Type ${value.type} is not allowed.`);
  }
}
