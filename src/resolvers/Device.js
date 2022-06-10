export async function records(parent, args, context) {
    let pipeline = [];

    if (!!args.start_date && !!args.end_date) {
        if(args.start_date.getTime() >= args.end_date.getTime())
        {
            throw new Error("End date cannot be older then start date");
        }

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