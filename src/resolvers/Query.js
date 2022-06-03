export async function getAllUsers(parent, args, context, info) {
    return await context.user.find();
}