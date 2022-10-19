import { Box, Text } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { CheckCircledIcon } from '@modulz/radix-icons';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteInvoice } from '../../reducers/invoices';
import { Customer } from '../../types/customer';
import { Invoice } from '../../types/invoice';
import {
    getInvoiceAmount,
    getInvoiceAmountInString,
} from '../../utils/invoiceAmount';
import { InvoicePage } from '../InvoicePage';
import classes from './styles.module.scss';

interface Props {
    invoice: Invoice;
    customer: Customer;
}

export const InvoiceDetails = ({ invoice, customer }: Props) => {
    const dispatch = useDispatch();
    const notifications = useNotifications();
    const [showDownloadLink, setShowDownloadLink] = useState(false);
    const sumWithSymbol = getInvoiceAmountInString(
        getInvoiceAmount(invoice),
        customer
    );
    const _deleteInvoice = (
        e: MouseEvent<HTMLAnchorElement>,
        invoiceId: string
    ) => {
        e.preventDefault();

        dispatch(
            deleteInvoice(invoiceId, () => {
                notifications.showNotification({
                    message: 'Invoice deleted successfully',
                    color: 'green',
                    icon: <CheckCircledIcon />,
                });
            })
        );
    };
    return (
        <Box key={invoice.id} className={classes.invoice}>
            <Text component='span'>
                INV - {invoice.number} for {sumWithSymbol}
            </Text>
            <Text component='span'>
                <Link to={`/invoice/edit/${invoice.id}`}>
                    <Text>Edit invoice</Text>
                </Link>
                {showDownloadLink ? (
                    <PDFDownloadLink
                        document={
                            <InvoicePage
                                invoice={invoice}
                                customer={customer}
                            />
                        }
                        fileName={`INV - ${invoice.number}`}
                        aria-label='Save PDF'
                    >
                        Download
                    </PDFDownloadLink>
                ) : (
                    <Link to='#' onClick={(e) => setShowDownloadLink(true)}>
                        <Text>Show download link</Text>
                    </Link>
                )}
                <Link to='#' onClick={(e) => _deleteInvoice(e, invoice.id)}>
                    <Text>Delete invoice</Text>
                </Link>
            </Text>
        </Box>
    );
};
