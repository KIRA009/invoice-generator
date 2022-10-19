import React, {
    ChangeEvent,
    MouseEvent,
    useEffect,
    useRef,
    useState,
} from 'react';
import { InvoiceItem } from '../../types/invoice-item';
import { Table, TextInput, Text, ActionIcon } from '@mantine/core';
import classes from './styles.module.scss';
import { TrashIcon, PlusCircledIcon } from '@modulz/radix-icons';
import { useNotifications } from '@mantine/notifications';

interface Props {
    items: InvoiceItem[];
    setItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
}

export const ItemList = ({ items, setItems }: Props) => {
    const notifications = useNotifications();
    const [total, setTotal] = useState(0 as number);
    const itemDescriptionRef = useRef<HTMLInputElement>(null);
    const itemQuantityRef = useRef<HTMLInputElement>(null);
    const itemRateRef = useRef<HTMLInputElement>(null);
    const itemAmountRef = useRef<HTMLInputElement>(null);

    const addItem = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (
            !itemDescriptionRef.current ||
            !itemQuantityRef.current ||
            !itemRateRef.current
        )
            return;
        const itemDetails: InvoiceItem = {
            itemDetail: itemDescriptionRef.current.value,
            quantity: Number(itemQuantityRef.current.value),
            rate: Number(itemRateRef.current.value),
            amount: 0,
        };
        itemDetails.amount = itemDetails.rate * itemDetails.quantity;
        if (itemDetails.amount === 0 || itemDetails.itemDetail.length === 0) {
            notifications.showNotification({
                message: 'Please ensure amount and detail are valid',
                color: 'red',
            });
            return;
        }
        itemDescriptionRef.current.value = '';
        itemQuantityRef.current.value = '';
        itemRateRef.current.value = '';
        if (itemAmountRef.current) itemAmountRef.current.value = '';

        setItems((prev) => {
            let newItems = [...prev];
            newItems.push(itemDetails);
            return newItems;
        });
    };
    const removeItem = (e: MouseEvent<HTMLButtonElement>, index: number) => {
        setItems((prev) => {
            let newItems = [...prev];
            newItems.splice(index, 1);
            return newItems;
        });
    };
    const onRateQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (
            !itemQuantityRef.current ||
            !itemRateRef.current ||
            !itemAmountRef.current
        )
            return;
        itemAmountRef.current.value = `${
            itemQuantityRef.current.valueAsNumber *
            itemRateRef.current.valueAsNumber
        }`;
    };

    useEffect(() => {
        setTotal(items.reduce((a, b) => a + b.amount, 0));
    }, [items]);
    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>Item description</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody className={classes.itemListTableBody}>
                    <tr>
                        <td>
                            <TextInput
                                className={classes.addIteminput}
                                ref={itemDescriptionRef}
                            />
                        </td>
                        <td>
                            <TextInput
                                onChange={onRateQuantityChange}
                                className={classes.addIteminput}
                                type='number'
                                ref={itemQuantityRef}
                            />
                        </td>
                        <td>
                            <TextInput
                                onChange={onRateQuantityChange}
                                className={classes.addIteminput}
                                type='number'
                                ref={itemRateRef}
                            />
                        </td>
                        <td className={classes.amount}>
                            <TextInput
                                className={classes.addIteminput}
                                type='number'
                                readOnly
                                ref={itemAmountRef}
                            />
                            <ActionIcon
                                className={classes.delIcon}
                                color='blue'
                                variant='filled'
                                onClick={addItem}
                            >
                                <PlusCircledIcon />
                            </ActionIcon>
                        </td>
                    </tr>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td className={classes.description}>
                                {item.itemDetail}
                            </td>
                            <td>{item.quantity}</td>
                            <td>{item.rate}</td>
                            <td className={classes.amount}>
                                {item.amount}{' '}
                                <ActionIcon
                                    className={classes.delIcon}
                                    color='red'
                                    variant='filled'
                                    onClick={(
                                        e: MouseEvent<HTMLButtonElement>
                                    ) => removeItem(e, index)}
                                >
                                    <TrashIcon />
                                </ActionIcon>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Text className={classes.bottomText}>Subtotal: {total}</Text>
            <Text className={classes.bottomText}>Total: {total}</Text>
        </div>
    );
};
