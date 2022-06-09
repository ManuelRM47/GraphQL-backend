import Joi from 'joi';
import Validation from '../validation/joi.schemas.js';

//? Devices API
export async function postDevice(parent, args, context, info) {
    const newDevice = {
        description: args.description,
        company_id: args.company_id,
        alert: args.alert,
        alert_message: args.alert_message,
        max_value: args.max_value,
        min_value: args.min_value,
        deleted: false
    }

    Joi.assert(newDevice,Validation.deviceSchema);
    const DeviceID = await getDeviceID(context.generate);

    newDevice.device_id = `D${DeviceID.count}`;
    newDevice.createdAt = new Date();
    newDevice.updatedAt = new Date();

    await context.device.create(newDevice);

    return newDevice;
}

export async function updateDevice(parent, args, context, info) {
    const updatedDevice = {
        device_id: args.device_id,
        description: args.description,
        company_id: args.company_id,
        alert: args.alert,
        alert_message: args.alert_message,
        max_value: args.max_value,
        min_value: args.min_value,
    }

    Joi.assert(updatedDevice, Validation.updateDeviceSchema);
    updatedDevice.updatedAt = new Date();

    const devicesResponse = await context.device.updateOne(
        { device_id: args.device_id, company_id: args.company_id, deleted: false },
        { $set: {
            description: updatedDevice.description,
            alert: updatedDevice.alert,
            alert_message: updatedDevice.alert_message,
            max_value: updatedDevice.max_value,
            min_value: updatedDevice.min_value,
            updatedAt: updatedDevice.updatedAt,
        }}
    )

    if (devicesResponse.matchedCount > 0) {
        return await context.device.findOne({ device_id: args.device_id });
    } else {
        throw new Error("Device not found with device_id and company_id provided");
    }
}

export async function deleteDevice(parent, args, context, info) {
    let deletedDevice = {
        device_id: args.device_id,
        company_id: args.company_id,
    }

    Joi.assert(deletedDevice,Validation.deleteDeviceSchema);

    deletedDevice = await context.device.findOne({ device_id: args.device_id });

    const devicesResponse = await context.device.updateOne(
        { device_id: args.device_id, company_id: args.company_id, deleted: false },
        { $set:{
            updatedAt: new Date(),
            deleted: true
        }}
    )

    if (devicesResponse.matchedCount > 0) {
        return deletedDevice;
    } else {
        throw new Error("Device not found with device_id and company_id provided");
    }
}

async function getDeviceID(model) {
    try {
        const testResponse = await model.findOneAndUpdate(
            { generate_id: "DEVICE_ID" },
            { $inc: { "count": 1 }}
        )
        return testResponse
    } catch (e) {
        console.error(`Unable to generate device ID - ${e}`);
        return { error: e };
    }
}
