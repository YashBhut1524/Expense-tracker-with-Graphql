import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
	mutation CreateTransaction($input: CreateTransactionInput!) {
		createTransaction(input: $input) {
			_id
			description
			paymentType
			category
			amount
			location
			date
		}
	}
`;

export const UPDATE_TRANSACTION = gql `
    mutation UpdateTransaction($input: UpdateTransactionInput!) {
        createTransaction(input: $input) {
            transactionId
            description
            paymentType
            category
            amount
            date
            location
        }
    }
`

export const DELETE_TRANSACTION = gql `
    mutation DeleteTransaction($transactionId: ID!) {
        deleteTransaction(transactionId: $transactionId) {
            _id
        }
    }
`