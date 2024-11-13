import Transaction from "../models/transactionModel.js"

const transactionResolver = {
    Mutation: {
        createTransaction: async (_, {input}, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input, //input is from CreateTransactionInput in transactionTypeDef
                    userId: context.getUser()._id 
                })
                await newTransaction.save()
                return newTransaction
            } catch (error) {
                console.error("Error creating Transaction: ", error);
                throw new Error("Error creating Transaction")
            }
        },

        updateTransaction: async (_, {input}) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new: true})
                return updatedTransaction
            } catch (error) {
                console.error("Error updating Transaction: ", error);
                throw new Error("Error updating Transaction")
            }
        },

        deleteTransaction: async (_, {transactionId}) => {
            try {
                const deleteTransaction = Transaction.findByIdAndDelete(transactionId)
                return deleteTransaction
            } catch (error) {
                console.error("Error deleting Transaction: ", error);
                throw new Error("Error deleting Transaction")  
            }
        },

    },
    Query: {
        transactions: async (_, __, context) => {
            try {
                if(!context.getUser()) throw new Error("Unauthorized!!")
                const userId = await context.getUser()._id
                
                const transactions = await Transaction.find({userId})
                return transactions
            } catch (error) {
                console.error("Error getting Transactions: ", error);
                throw new Error("Error getting Transactions")
            }
        },
        transaction: async (_, {transactionId}) => {
            try {
                const transaction = await Transaction.findById(transactionId)
                return transaction
            } catch (error) {
                console.error("Error getting Transaction: ", error);
                throw new Error("Error getting Transaction")
            }
        },
        
        categoryStatistics: async (_, __, context) => {
			if (!context.getUser()) throw new Error("Unauthorized");

			const userId = context.getUser()._id;
			const transactions = await Transaction.find({ userId });
			const categoryMap = {};

			// const transactions = [
			// 	{ category: "expense", amount: 50 },
			// 	{ category: "expense", amount: 75 },
			// 	{ category: "investment", amount: 100 },
			// 	{ category: "saving", amount: 30 },
			// 	{ category: "saving", amount: 20 }
			// ];

			transactions.forEach((transaction) => {
				if (!categoryMap[transaction.category]) {
					categoryMap[transaction.category] = 0;
				}
				categoryMap[transaction.category] += transaction.amount;
			});

			// categoryMap = { expense: 125, investment: 100, saving: 50 }

			return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }));
			// return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
		},
    },
}

export default transactionResolver