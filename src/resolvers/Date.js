import { GraphQLScalarType, Kind } from "graphql";
import moment from 'moment-timezone';
export const DateType = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    // Backend to GraphQL
    serialize(value) {
        const date = moment(value);
        return date.format("DD-MM-YYYY h:m:s A Z");
    },
    // GraphQL Variable to Backend
    parseValue(value) {

        // Valid INT range >= "2022-01-01T12:00:00.000+00:00" -> 1641038400000
        if (typeof value === 'number' && parseInt(value,10) >= 1641038400000) {
            return moment(value).toDate();
        }
        
        // Date type getTime() NaN
        if ( typeof value === 'string' && isNaN(value) && !!new Date(value).getTime()) {
            return moment(value).toDate();
        }

        throw new Error("Invalid Date type or timestamp given was too old");
    },
    // GraphQL Literal to Backend
    parseLiteral(ast) {

        // Valid INT range >= "2022-01-01T12:00:00.000+00:00" -> 1641038400000
        if (ast.kind === Kind.INT && parseInt(ast.value,10) >= 1641038400000) {
            return moment(parseInt(ast.value,10)).toDate();
        }
        // Date type getTime() NaN
        if (ast.kind === Kind.STRING && isNaN(ast.value) && !!new Date(ast.value).getTime()) {
            return moment(ast.value).toDate();
        }

        throw new Error("Invalid Date type or timestamp given was too old");

        //return null;
    }
});