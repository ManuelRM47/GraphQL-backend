export async function company_obj(parent, args, context) {
    return await context.company.findOne({ name: parent.company, deleted: false });
}