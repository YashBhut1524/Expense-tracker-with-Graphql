import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
    query getTransactions {
        transactions {
            _id
			description
			paymentType
			category
			amount
			location
			date
        }
    }
`

export const GET_TRANSACTION = gql`
	query getTransaction ($id: ID!) {
		transaction(transactionId: $id) {
			_id
			description
			paymentType
			category
			amount
			location
			date
			user {
				_id
				name
				username
				profilePicture
			}
		}
	}
`

export const GET_TRANSACTIONS_STATISTICS = gql`
	query getTransactionStatistics {
		categoryStatistics {
			category
			totalAmount
		}
	}
`