import { FormEvent, RefObject, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addCustomer, editCustomer } from '../../reducers/customers';
import { Customer as CustomerType } from '../../types/customer';
import classes from './styles.module.scss';
import { TextInput, Textarea, Button, Container, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useNotifications } from '@mantine/notifications';
import { CheckCircledIcon } from '@modulz/radix-icons';

export enum States {
    View = 0,
    Edit = 1,
    Add = 2,
}

interface Props {
    state: States;
}

interface FormProps extends Props {
    nameRef?: RefObject<HTMLInputElement>;
    currencyRef?: RefObject<HTMLInputElement>;
    addressRef?: RefObject<HTMLTextAreaElement>;
    emailRef?: RefObject<HTMLInputElement>;
    websiteRef?: RefObject<HTMLInputElement>;
}

const isViewing = (state: States) => state === States.View;
const isEditing = (state: States) => state === States.Edit;
const isAdding = (state: States) => state === States.Add;

const CustomerForm = ({
    state,
    nameRef,
    currencyRef,
    addressRef,
    emailRef,
    websiteRef,
}: FormProps) => {
    return (
        <>
            <TextInput
                required
                label='Name'
                readOnly={!(isAdding(state) || isEditing(state))}
                ref={nameRef}
            />
            <TextInput
                required
                label='Currency'
                readOnly={!(isAdding(state) || isEditing(state))}
                ref={currencyRef}
            />
            <Textarea
                required
                label='Address'
                readOnly={!(isAdding(state) || isEditing(state))}
                ref={addressRef}
            />
            <TextInput
                label='Email'
                readOnly={!(isAdding(state) || isEditing(state))}
                ref={emailRef}
            />
            <TextInput
                label='Website'
                readOnly={!(isAdding(state) || isEditing(state))}
                ref={websiteRef}
            />
        </>
    );
};

const Customer = ({ state }: Props) => {
    const notifications = useNotifications();
    const dispatch = useDispatch();
    const nameRef = useRef<HTMLInputElement>(null);
    const currencyRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const websiteRef = useRef<HTMLInputElement>(null);
    const isValid = (): boolean => {
        if (
            !nameRef.current ||
            !currencyRef.current ||
            !addressRef.current ||
            !emailRef.current ||
            !websiteRef.current
        )
            return false;
        if (
            !nameRef.current.value ||
            !currencyRef.current.value ||
            !addressRef.current.value
        )
            return false;
        return true;
    };
    const _addCustomer = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid()) return;
        const newCustomer: CustomerType = {
            id: '',
            name: nameRef.current!.value,
            address: addressRef.current!.value,
            currency: currencyRef.current!.value,
        };
        if (emailRef.current!.value)
            newCustomer.email = emailRef.current!.value;
        if (websiteRef.current!.value)
            newCustomer.website = websiteRef.current!.value;

        dispatch(
            addCustomer(newCustomer, () => {
                notifications.showNotification({
                    message: 'New customer added',
                    color: 'green',
                    icon: <CheckCircledIcon />,
                });
            })
        );
    };
    const _editCustomer = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid()) return;
        const newCustomer: CustomerType = {
            id: '', // TODO: get this from somewhere
            name: nameRef.current!.value,
            address: addressRef.current!.value,
            currency: currencyRef.current!.value,
        };
        if (emailRef.current!.value)
            newCustomer.email = emailRef.current!.value;
        if (websiteRef.current!.value)
            newCustomer.website = websiteRef.current!.value;
        dispatch(editCustomer(newCustomer));
    };

    return (
        <Container size='xs'>
            <Text component='h1' size='xl'>
                {isViewing(state)
                    ? `VIEW CUSTOMER DETAILS`
                    : isEditing(state)
                    ? `EDIT CUSTOMER DETAILS`
                    : `ADD NEW CUSTOMER`}
            </Text>
            {isViewing(state) ? (
                <CustomerForm state={state} />
            ) : (
                <form onSubmit={isAdding(state) ? _addCustomer : _editCustomer}>
                    <CustomerForm
                        {...{
                            state,
                            nameRef,
                            currencyRef,
                            addressRef,
                            emailRef,
                            websiteRef,
                        }}
                    />
                    <div className={classes.form_actions}>
                        <Link to='/invoice/add/'>
                            <Text>Create an invoice</Text>
                        </Link>
                        <Button type='submit' variant='filled'>
                            {isAdding(state) ? `Add` : `Save changes`}
                        </Button>
                    </div>
                </form>
            )}
        </Container>
    );
};

export { Customer };
