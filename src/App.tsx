import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { Store } from './store';
import { Router } from './routes';
import { AppShell, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { theme } from './theme';

type Props = {
    store: Store;
};

export const App = ({ store }: Props) => {
    const persistor = persistStore(store);
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <MantineProvider theme={theme}>
                    <NotificationsProvider position='top-right'>
                        <AppShell padding='md'>
                            <Router />
                        </AppShell>
                    </NotificationsProvider>
                </MantineProvider>
            </PersistGate>
        </Provider>
    );
};
