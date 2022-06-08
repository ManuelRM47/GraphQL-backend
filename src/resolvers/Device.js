export async function records(parent, args, context) {
    return await context.record.find({device_id: parent.device_id}).limit(args.first).sort({time_stamp: -1});
}