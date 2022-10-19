import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import { Invoice } from '../types/invoice';

type initialState = Invoice[];

const findInvoiceIndex = (state: initialState, invoiceId: string): number => {
    let invoiceIndex = -1;
    state.forEach((invoice, index) => {
        if (invoiceIndex !== -1) return;
        if (invoice.id === invoiceId) invoiceIndex = index;
    });
    return invoiceIndex;
};

const invoices = createSlice({
    name: 'invoices',
    initialState: [] as initialState,
    reducers: {
        addInvoice: (state: initialState, action: PayloadAction<Invoice>) => {
            state.push(action.payload);
        },
        editInvoice: (state: initialState, action: PayloadAction<Invoice>) => {
            const invoiceIndex = findInvoiceIndex(state, action.payload.id);

            if (invoiceIndex !== -1) {
                state[invoiceIndex] = {
                    ...action.payload,
                    id: state[invoiceIndex].id,
                };
            }
        },
        deleteInvoice: (state: initialState, action: PayloadAction<string>) => {
            const invoiceIndex = findInvoiceIndex(state, action.payload);

            if (invoiceIndex !== -1) {
                state.splice(invoiceIndex, 1);
            }
        },
    },
});

export default invoices.reducer;

export const addInvoice =
    (payload: Invoice, cb: () => void): AppThunk =>
    async (dispatch) => {
        const id = new Date().getTime().toString();
        dispatch(
            invoices.actions.addInvoice({
                ...payload,
                id,
            })
        );
        cb();
    };

export const editInvoice =
    (payload: Invoice, cb: () => void): AppThunk =>
    async (dispatch) => {
        dispatch(invoices.actions.editInvoice(payload));
        cb();
    };

export const deleteInvoice =
    (payload: string, cb: () => void): AppThunk =>
    async (dispatch) => {
        dispatch(invoices.actions.deleteInvoice(payload));
        cb();
    };

export const getInvoices = (state: RootState): Invoice[] => state.invoices;
export const getInvoice =
    (invoiceId: string) =>
    (state: RootState): Invoice | undefined => {
        return state.invoices.find((invoice) => invoiceId === invoice.id);
    };
