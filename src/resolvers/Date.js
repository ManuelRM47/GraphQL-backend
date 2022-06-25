import { GraphQLScalarType, Kind } from "graphql";

export const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    // Backend to GraphQL
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
    // GraphQL Variable to Backend
    parseValue(value) {

        // Valid INT range >= "2022-01-01T12:00:00.000+00:00" -> 1641038400000
        if (typeof value === 'number' && parseInt(value,10) >= 1641038400000) {
            return new Date(value);
        }
        
        // Date type getTime() NaN
        if ( typeof value === 'string' && isNaN(value) && !!new Date(value).getTime()) {
            return new Date(value);
        }

        throw new Error("Invalid Date type or timestamp given was too old");
    },
    // GraphQL Literal to Backend
    parseLiteral(ast) {

        // Valid INT range >= "2022-01-01T12:00:00.000+00:00" -> 1641038400000
        if (ast.kind === Kind.INT && parseInt(ast.value,10) >= 1641038400000) {
            return new Date(parseInt(ast.value,10));
        }
        // Date type getTime() NaN
        if (ast.kind === Kind.STRING && isNaN(ast.value) && !!new Date(ast.value).getTime()) {
            return new Date(ast.value);
        }

        throw new Error("Invalid Date type or timestamp given was too old");

        //return null;
    }
});