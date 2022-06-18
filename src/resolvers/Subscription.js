import { pubsub } from "../constants.js"

export const userPosted = {
    subscribe: () => pubsub.asyncIterator('USER_POSTED'),
}

export const userUpdated = {
    subscribe: () => pubsub.asyncIterator('USER_UPDATED'),
}

export const userDeleted = {
    subscribe: () => pubsub.asyncIterator('USER_DELETED'),
}
