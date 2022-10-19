import { useSelector } from 'react-redux';
import { getCustomers } from '../../reducers/customers';
import { Customer } from '../../types/customer';
import { Select, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from './styles.module.scss';
import { getLongStringCurrency } from '../../utils/invoiceAmount';

interface Props {
    selectedCustomer: string;
    setSelectedCustomer: (newStr: string) => void;
}

export const CustomerSelector = ({
    selectedCustomer,
    setSelectedCustomer,
}: Props) => {
    const customers: Customer[] = useSelector(getCustomers);

    return (
        <div>
            <Select
                label='Select customer'
                placeholder='Pick one'
                required
                value={selectedCustomer}
                onChange={setSelectedCustomer}
                data={customers.map((customer) => ({
                    value: customer.id,
                    label:
                        customer.name + ' - ' + getLongStringCurrency(customer),
                }))}
            />
            <Link to='/customer/add/'>
                <Text className={classes.createCustomerLink}>
                    Create a customer
                </Text>
            </Link>
        </div>
    );
};
