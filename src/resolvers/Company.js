export async function users(parent, args, context) {
    return await context.user.find({company: parent.name}).limit(args.first);
}

export async function devices(parent, args, context) {
    return await context.device.find({company_id: parent.company_id}).limit(args.first);
}