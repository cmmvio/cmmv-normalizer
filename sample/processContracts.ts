import { Application } from '@cmmv/core';
import { CustomersContract } from '../sample/customers.contract';

Application.create({
    contracts: [CustomersContract],
});
