import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addInvoice, editInvoice, getInvoices } from '../../reducers/invoices';
import { InvoiceItem } from '../../types/invoice-item';
import { CustomerSelector } from '../CustomerSelector';
import { ItemList } from '../ItemList';
import { Invoice } from '../../types/invoice';
import { TextInput, Button, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useNotifications } from '@mantine/notifications';
import { CrossCircledIcon, CheckCircledIcon } from '@modulz/radix-icons';
import { Link } from 'react-router-dom';
import classes from './styles.module.scss';
import { Customer } from '../../types/customer';

interface Props {
    invoice?: Invoice;
    customer?: Customer;
}

export const InvoiceBody = ({ invoice, customer }: Props) => {
    const notifications = useNotifications();
    const [selectedCustomer, setSelectedCustomer] = useState<string>(
        customer ? customer.id : ''
    );
    const [items, setItems] = useState<InvoiceItem[]>(
        invoice ? invoice.items : []
    );
    const invoices = useSelector(getInvoices);
    const dispatch = useDispatch();
    const numberRef = useRef<HTMLInputElement>(null);
    const creationDateRef = useRef<HTMLButtonElement>(null);
    const dueDateRef = useRef<HTMLButtonElement>(null);
    const subjectRef = useRef<HTMLInputElement>(null);
    const editMode = invoice ? true : false;

    useEffect(() => {
        if (invoice) {
            if (numberRef.current) numberRef.current.value = invoice.number;
            if (creationDateRef.current)
                creationDateRef.current.value = invoice.creationDate;
            if (dueDateRef.current && invoice.dueDate)
                dueDateRef.current.value = invoice.dueDate;
            if (subjectRef.current) subjectRef.current.value = invoice.subject;
        }
    }, [invoice]);

    const save = (e: React.MouseEvent) => {
        e.preventDefault();
        if (
            !numberRef.current ||
            !creationDateRef.current ||
            !dueDateRef.current ||
            !subjectRef.current
        )
            return;
        if (
            !creationDateRef.current.value ||
            !numberRef.current.value ||
            !subjectRef.current.value
        ) {
            notifications.showNotification({
                message: 'Please fill all required values',
                color: 'red',
                icon: <CrossCircledIcon />,
            });
            return;
        }

        const _invoice: Invoice = {
            id: '',
            items,
            customerId: selectedCustomer,
            creationDate: creationDateRef.current.value,
            number: numberRef.current.value,
            subject: subjectRef.current.value,
        };

        if (dueDateRef.current.value) {
            _invoice.dueDate = dueDateRef.current.value;
        }

        if (editMode) {
            if (invoice) _invoice.id = invoice.id;
            dispatch(
                editInvoice(_invoice, () => {
                    notifications.showNotification({
                        message: 'Invoice edited successfully',
                        color: 'green',
                        icon: <CheckCircledIcon />,
                    });
                })
            );
        } else {
            dispatch(
                addInvoice(_invoice, () => {
                    notifications.showNotification({
                        message: 'New invoice added',
                        color: 'green',
                        icon: <CheckCircledIcon />,
                    });
                })
            );
        }
    };
    const defaultInvoiceNum = useMemo(() => {
        let maxInvoiceNum = 0;
        for (const invoice of invoices) {
            if (!isNaN(Number(invoice.number))) {
                maxInvoiceNum = Math.max(maxInvoiceNum, Number(invoice.number));
            }
        }
        const newInvoiceNum = maxInvoiceNum + 1;
        return String(newInvoiceNum).padStart(6, '0');
    }, [invoices]);

    return (
        <>
            <CustomerSelector {...{ selectedCustomer, setSelectedCustomer }} />
            <TextInput
                required
                label='Invoice Number'
                ref={numberRef}
                defaultValue={defaultInvoiceNum}
            />
            <DatePicker
                inputFormat='DD/MM/YYYY'
                ref={creationDateRef}
                label='Invoice date'
                required
                defaultValue={new Date()}
                clearable={false}
            />
            <DatePicker
                inputFormat='DD/MM/YYYY'
                ref={dueDateRef}
                label='Invoice due date'
            />
            <TextInput required label='Subject' ref={subjectRef} />
            <ItemList items={items} setItems={setItems} />
            <div className={classes.form_actions}>
                <Link to='/invoices'>
                    <Text>View your invoices</Text>
                </Link>
                <Button type='submit' variant='filled' onClick={save}>
                    {editMode ? 'Edit invoice' : 'Add Invoice'}
                </Button>
            </div>
        </>
    );
};
