import {
    XMLParser,
    AbstractParserSchema,
    ToLowerCase,
    Tokenizer,
    ToDate,
    ToObjectId,
    ToInt,
} from '../src';

import { CustomersContract } from './customers.contract';
import { Customers } from '../src/models/customers.model';
import { ECKeys } from '@cmmv/encryptor';

const keys = ECKeys.generateKeys();

const tokenizer = Tokenizer({
    publicKey: ECKeys.getPublicKey(keys),
});

class CustomerParserSchema extends AbstractParserSchema {
    public field = {
        id: {
            to: 'id',
            transform: [ToInt, ToObjectId],
        },
        name: { to: 'name' },
        email: {
            to: 'email',
            validation: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            transform: [ToLowerCase],
        },
        phoneNumber: {
            to: 'phone',
            transform: [tokenizer],
        },
        registrationDate: {
            to: 'createdAt',
            transform: [ToDate],
        },
    };
}

new XMLParser({
    contract: CustomersContract,
    schema: CustomerParserSchema,
    model: Customers,
    input: './sample/large-customers.xml',
    nodeName: 'customer',
})
    .pipe(async (data: Customers) => {
        console.log(data);
    })
    .once('end', () => console.log('End process!'))
    .once('error', error => console.error(error))
    .start();
