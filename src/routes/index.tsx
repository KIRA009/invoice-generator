import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AddCustomer } from '../pages/AddCustomer';
import { AddInvoice } from '../pages/AddInvoice';
import { EditInvoice } from '../pages/EditInvoice';
import { Invoices } from '../pages/Invoices';
import { RouteInterface } from '../types/route';

const routes: RouteInterface[] = [
    {
        url: '/',
        component: Invoices,
    },
    {
        url: '/invoice/add/',
        component: AddInvoice,
    },
    {
        url: '/invoice/edit/:id',
        component: EditInvoice,
    },
    {
        url: '/customer/add/',
        component: AddCustomer,
    },
    {
        url: '/invoices',
        component: Invoices,
    },
];

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {routes.map((route) => (
                    <Route
                        path={route.url}
                        key={route.url}
                        element={<route.component />}
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
};
