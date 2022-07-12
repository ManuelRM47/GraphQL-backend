import Joi from 'joi';
import Validation from '../validation/joi.schemas.js';
import moment from 'moment-timezone';

//? Companies API
export async function postCompany(parent, args, context, info) {
    let existingCompany = await checkCompanyExistence(context.company, args.name);
    if (!!existingCompany) {
        throw new Error("Company already exists");
    }

    const newCompany = {
        name: args.name,
        location: args.location,
        razon_social: args.razon_social,
        deleted: false,
    }

    Joi.assert(newCompany, Validation.companySchema);
    const CompanyID = await getCompanyID(context.generate);

    newCompany.company_id =`C${CompanyID.count}`;
    newCompany.createdAt = moment().toDate();;
    newCompany.updatedAt = moment().toDate();;

    await context.company.create(newCompany);

    return newCompany;
}

export async function updateCompany(parent, args, context, info) {
    // let existingCompany = await checkCompanyExistence(context.company, args.name);
    // if (!!existingCompany) {
    //     throw new Error("Company already exists");
    // }

    const updatedCompany = {
        company_id: args.company_id,
        name: args.name,
        location: args.location,
        razon_social: args.razon_social,
    }
    
    Joi.assert(updatedCompany, Validation.updateCompanySchema);
    updatedCompany.updatedAt = moment().toDate();

    const companiesResponse = await context.company.updateOne(
        { company_id: updatedCompany.company_id, name: updatedCompany.name, deleted: false },
        {
            $set: {
                location: updatedCompany.location,
                razon_social: updatedCompany.razon_social,
                updatedAt: updatedCompany.updatedAt
            }
        }
    )

    if (companiesResponse.matchedCount > 0) {
        return await context.company.findOne({ company_id: args.company_id });;
    } else {
        throw new Error("Company not found with name and company_id provided");
    }
}

export async function deleteCompany(parent, args, context, info) {

    let deletedCompany = {
        name: args.name,
        company_id: args.company_id
    } 

    Joi.assert(deletedCompany, Validation.deleteCompanySchema);

    deletedCompany = await context.company.findOne({ company_id: args.company_id });

    const companiesResponse = await context.company.updateOne(
        { name: args.name, company_id: args.company_id, deleted: false },
        {
            $set: {
                updatedAt: moment().toDate(),
                deleted: true
            }
        }
    );

    if (companiesResponse.matchedCount > 0) {
        return deletedCompany;
    } else {
        throw new Error("Company not found with name and company_id provided");
    }
}

async function checkCompanyExistence(model, name) {
    try {
        return await model.findOne( {name: name} );
    } catch (e) {
        console.error(`Something went wrong in checkCompanyExistence - ${e}`);
        throw e; 
    }
}

async function getCompanyID(model) {
    try {
        const testResponse = await model.findOneAndUpdate(
            { generate_id: "COMPANY_ID" },
            { $inc: { "count": 1 }}
        )
        return testResponse
    } catch (e) {
        console.error(`Unable to generate company ID - ${e}`);
        return { error: e };
    }
}
