import { InvoiceBody } from '../../components/InvoiceBody';
import { Container, Text } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getInvoice } from '../../reducers/invoices';
import { getCustomer } from '../../reducers/customers';

export const EditInvoice = () => {
    const { id } = useParams();
    const invoice = useSelector(getInvoice(id as string));
    const customer = useSelector(getCustomer(invoice?.customerId as string));

    return (
        <Container size='sm'>
            <Text component='h1' size='xl'>
                EDIT INVOICE
            </Text>
            <form>
                <InvoiceBody {...{ invoice, customer }} />
            </form>
        </Container>
    );
};
