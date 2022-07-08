import Base64URL from 'base64-url';
import { GraphQLScalarType, Kind } from "graphql";

const toCursor = value => Base64URL.encode(`${value}`);

const fromCursor = (value) => {
  const cursor = Base64URL.decode(value);
  if (cursor) return cursor;
  return null;
};

export const CursorType = new GraphQLScalarType({
  name: 'Cursor',
  serialize(value) {
    if (value) return toCursor(value);
    return null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return fromCursor(ast.value);
    }
    return null;
  },
  parseValue(value) {
    if (value) return fromCursor(value);
    return null;
  },
});