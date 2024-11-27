import { ObjectId } from 'mongodb';
import * as crypto from 'node:crypto';

/**
 * Converts a number to a padded hexadecimal string and creates an ObjectId.
 *
 * @param num A number to convert.
 * @returns The ObjectId instance.
 */
function numberToObjectId(num: number): ObjectId {
    if (num < 0 || num > 0xffffff)
        throw new Error(
            'Number must be a non-negative integer and fit within 3 bytes (0-16777215).',
        );

    const timestamp = Math.floor(Date.now() / 1000);
    const randomBytes = crypto.randomBytes(5);
    const counter = Buffer.alloc(3);
    counter.writeUIntBE(num, 0, 3);

    const objectIdBuffer = Buffer.concat([
        Buffer.alloc(4).writeUIntBE(timestamp, 0, 4) && Buffer.alloc(4),
        randomBytes,
        counter,
    ]);

    return new ObjectId(objectIdBuffer);
}

/**
 * Converts the input value to a MongoDB ObjectId.
 *
 * @param input The input value to convert. Must be a valid 24-character hex string or an ObjectId.
 * @returns The ObjectId instance.
 * @throws Will throw an error if the input is not a valid ObjectId format.
 */
export function ToObjectId(input: string | number | ObjectId): ObjectId {
    if (typeof input === 'number') return numberToObjectId(input);

    if (input instanceof ObjectId) return input;

    if (typeof input === 'string' && /^[a-fA-F0-9]{24}$/.test(input))
        return new ObjectId(input);

    throw new Error(`Invalid ObjectId input: ${input}`);
}
