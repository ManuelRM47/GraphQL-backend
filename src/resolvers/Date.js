import { GraphQLScalarType, Kind } from "graphql";

export const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        const date = new Date(value);
        let time = '';
        if (date.getHours() === 12) {
            time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} PM`
        } else if (date.getHours() === 0) {
            time = `${date.getHours() + 12}:${date.getMinutes()}:${date.getSeconds()} AM`
        } else if (date.getHours() > 12) {
            time = `${date.getHours() - 12}:${date.getMinutes()}:${date.getSeconds()} PM`
        } else {
            time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} AM`
        }
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${time}`;
    },
    parseValue(value) {
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value,10));
        }
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    }
});