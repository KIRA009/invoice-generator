import { configureStore, Middleware, Action } from '@reduxjs/toolkit';
import { createHashHistory } from 'history';
import { createLogger } from 'redux-logger';
import thunkMiddlware, { ThunkAction } from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
// eslint-disable-next-line import/no-cycle
import { createRootReducer } from './rootReducer';

export const history = createHashHistory();
const rootReducer = createRootReducer();
export type RootState = ReturnType<typeof rootReducer>;
const middleware: Middleware[] = [thunkMiddlware];

const excludeLoggerEnvs = ['test', 'production'];
const shouldIncludeLogger = !excludeLoggerEnvs.includes(
    process.env.NODE_ENV || ''
);

if (shouldIncludeLogger) {
    const logger = createLogger({
        level: 'info',
        collapsed: true,
    });
    middleware.push(logger);
}

const persistConfig = {
    key: 'root',
    storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configuredStore = (initialState?: RootState) => {
    // Create Store
    const store = configureStore({
        reducer: persistedReducer,
        middleware,
        preloadedState: initialState,
    });
    return store;
};
export type Store = ReturnType<typeof configuredStore>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
