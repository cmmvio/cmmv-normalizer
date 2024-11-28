import { Contract, ContractField, AbstractContract } from '@cmmv/core';

@Contract({
    controllerName: 'Customers',
    protoPath: 'src/protos/customers.proto',
    protoPackage: 'customers',
    generateController: false,
})
export class CustomersContract extends AbstractContract {
    @ContractField({ protoType: 'string' })
    name: string;

    @ContractField({ protoType: 'string' })
    phone: string;

    @ContractField({ protoType: 'date' })
    createdAt: Date;
}
