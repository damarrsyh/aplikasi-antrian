import axios from "axios";

const API_URL = "http://localhost:5000/queue"; 

export const fetchOperators = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching operators", error);
        return [];
    }
};

export const addCustomerToOperator = async (operatorId, customerData) => {
    try {
        const response = await axios.get(`${API_URL}/${operatorId}`);
        const operator = response.data;

        operator.customers.push(customerData);

        const updateResponse = await axios.put(`${API_URL}/${operatorId}`, operator);
        return updateResponse.data;
    } catch (error) {
        console.error("Error adding customer", error);
    }
};

export const updateCustomerStatus = async (operatorId, customerId, updatedData) => {
    try {
        const response = await axios.get(`${API_URL}/${operatorId}`);
        const operator = response.data;

        operator.customers = operator.customers.map(customer =>
            customer.id === customerId ? { ...customer, ...updatedData } : customer
        );

        const updateResponse = await axios.put(`${API_URL}/${operatorId}`, operator);
        return updateResponse.data;
    } catch (error) {
        console.error("Error updating customer status", error);
    }
};

export const deleteCustomerFromOperator = async (operatorId, customerId) => {
    try {
        const response = await axios.get(`${API_URL}/${operatorId}`);
        const operator = response.data;

        operator.customers = operator.customers.filter(customer => customer.id !== customerId);

        await axios.put(`${API_URL}/${operatorId}`, operator);
    } catch (error) {
        console.error("Error deleting customer", error);
    }
};
