import { combineReducers } from 'redux';
// eslint-disable-next-line import/no-cycle
import customerReducer from './reducers/customers';
import invoiceReducer from './reducers/invoices';

export const createRootReducer = () => {
    return combineReducers({
        customers: customerReducer,
        invoices: invoiceReducer,
    });
};
