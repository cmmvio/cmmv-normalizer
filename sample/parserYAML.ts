import {
    YAMLParser,
    AbstractParserSchema,
    ToLowerCase,
    Tokenizer,
    ToDate,
    ToObjectId,
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
            transform: [ToObjectId],
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

new YAMLParser({
    contract: CustomersContract,
    schema: CustomerParserSchema,
    model: Customers,
    input: './sample/large-customers.yml',
})
    .pipe(async data => {
        console.log(data);
    })
    .once('end', () => console.log('End process!'))
    .once('error', error => console.error(error))
    .start();
