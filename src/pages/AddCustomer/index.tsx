import { Customer, States } from "../../components/Customer";

export const AddCustomer = () => {
	return (
		<Customer state={States.Add} />
	);
};
