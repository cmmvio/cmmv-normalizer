import * as fs from 'fs';
import { faker } from '@faker-js/faker';

interface Customer {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    registrationDate: string;
}

const generateCustomerData = (id: number): Customer => ({
    id,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number({ style: 'national' }),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    registrationDate: faker.date.past().toISOString(),
});

const generateLargeXML = async (
    filePath: string,
    totalRecords: number,
): Promise<void> => {
    const writeStream = fs.createWriteStream(filePath);
    writeStream.write('<?xml version="1.0" encoding="UTF-8"?>\n');
    writeStream.write('<customers>\n');

    for (let i = 1; i <= totalRecords; i++) {
        const customer = generateCustomerData(i);

        writeStream.write('  <customer>\n');
        writeStream.write(`    <id>${customer.id}</id>\n`);
        writeStream.write(`    <name>${customer.name}</name>\n`);
        writeStream.write(`    <email>${customer.email}</email>\n`);
        writeStream.write(
            `    <phoneNumber>${customer.phoneNumber}</phoneNumber>\n`,
        );
        writeStream.write(`    <address>${customer.address}</address>\n`);
        writeStream.write(`    <city>${customer.city}</city>\n`);
        writeStream.write(`    <state>${customer.state}</state>\n`);
        writeStream.write(`    <zipCode>${customer.zipCode}</zipCode>\n`);
        writeStream.write(
            `    <registrationDate>${customer.registrationDate}</registrationDate>\n`,
        );
        writeStream.write('  </customer>\n');

        if (i % 10000 === 0) console.log(`Generated ${i} records...`);
    }

    writeStream.write('</customers>\n');
    writeStream.end();

    console.log(
        `XML file with ${totalRecords} records generated at ${filePath}`,
    );
};

generateLargeXML('./sample/large-customers.xml', 1000);
