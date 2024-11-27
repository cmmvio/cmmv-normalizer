// Generated automatically by CMMV

import { validate } from 'class-validator';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { AbstractService, Service } from '@cmmv/core';
import { Customers, ICustomers } from '../models/customers.model';

@Service('customers')
export class CustomersService extends AbstractService {
    public override name = 'customers';
    private items: Customers[] = [];

    async getAll(queries?: any, req?: any): Promise<Customers[]> {
        return this.items;
    }

    async getById(id: string, req?: any): Promise<Customers> {
        const item = this.items.find(i => i.id === id);

        if (item) return item;

        throw new Error('Item not found');
    }

    async add(item: ICustomers, req?: any): Promise<Customers> {
        return new Promise((resolve, reject) => {
            item['id'] = this.items.length + 1;

            const newItem = plainToClass(Customers, item, {
                excludeExtraneousValues: true,
            });

            validate(newItem, { skipMissingProperties: true }).then(err => {
                if (!err) {
                    this.items.push(newItem);
                    resolve(newItem);
                } else {
                    reject(err);
                }
            });
        });
    }

    async update(id: string, item: ICustomers, req?: any): Promise<Customers> {
        return new Promise((resolve, reject) => {
            const index = this.items.findIndex(i => i.id === parseInt(id));

            if (index !== -1) {
                let itemRaw = instanceToPlain(this.items[index]);
                let updateItem = { ...itemRaw, ...item };

                const editedItem = plainToClass(Customers, updateItem, {
                    excludeExtraneousValues: true,
                });

                validate(editedItem, { skipMissingProperties: true }).then(
                    err => {
                        if (!err) {
                            this.items[index] = editedItem;
                            resolve(editedItem);
                        } else reject(err);
                    },
                );
            } else {
                reject('Item not found');
            }
        });
    }

    async delete(
        id: string,
        req?: any,
    ): Promise<{ success: boolean; affected: number }> {
        const index = this.items.findIndex(i => i.id === parseInt(id));

        if (index !== -1) {
            this.items.splice(index, 1);
            return { success: true, affected: 1 };
        }

        throw new Error('Item not found');
    }
}
