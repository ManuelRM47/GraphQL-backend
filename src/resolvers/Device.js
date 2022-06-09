export async function records(parent, args, context) {
    let pipeline = [];

    if (!!args.start_date && !!args.end_date) {
        pipeline.push({
            $match: {
                deleted: false,
                device_id: parent.device_id,
                time_stamp: {
                    $gte: args.start_date,
                    $lte: args.end_date
                } 
            },
        })
        console.log('dates');
    } else {
        pipeline.push({
            $match: {
                deleted: false,
                device_id: parent.device_id,
            },
        })
    }

    if (!!args.first) {
        pipeline.push({
            $limit: args.first
        })
    }

    pipeline.push({
        $sort: {
            time_stamp: -1,
        },
    })
    return await context.record.aggregate(pipeline);
}