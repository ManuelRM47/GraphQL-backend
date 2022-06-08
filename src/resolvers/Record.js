export async function device(parent, args, context) {
    return await context.device.findOne({device_id: parent.device_id});
}