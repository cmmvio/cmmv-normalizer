// Generated automatically by CMMV

import * as fastJson from 'fast-json-stringify';
import { Expose, instanceToPlain, Type } from 'class-transformer';

export interface ICustomers {
    id?: any;
    name: string;
    phone: string;
    createdAt: string;
}

export class Customers implements ICustomers {
    @Expose()
    id?: any;

    @Expose()
    name: string;

    @Expose()
    phone: string;

    @Expose()
    @Type(() => Date)
    createdAt: string;

    constructor(partial: Partial<Customers>) {
        Object.assign(this, partial);
    }

    public serialize() {
        return instanceToPlain(this);
    }

    public toString() {
        return CustomersFastSchema(this);
    }
}

// Schema for fast-json-stringify
export const CustomersFastSchema = fastJson({
    title: 'Customers Schema',
    type: 'object',
    properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        createdAt: { type: 'string' },
    },
    required: [],
});
