import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm.jsx";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../GraphQl/mutations/user.mutation.js";
import { GET_TRANSACTIONS_STATISTICS } from "../GraphQl/queries/transaction.query.js";
import { GET_AUTHENTICATED_USER } from "../GraphQl/queries/user.query.js";
import { useEffect, useState } from "react";


ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {

	// //HardCoded Data for Chart
	// const chartData = {
	// 	labels: ["Saving", "Expense", "Investment"],
	// 	datasets: [
	// 		{
	// 			label: "%",
	// 			data: [6300, 8545, 5553],
	// 			backgroundColor: ["rgba(75, 192, 192)", "rgba(255, 99, 132)", "rgba(54, 162, 235)"],
	// 			borderColor: ["rgba(75, 192, 192)", "rgba(255, 99, 132)", "rgba(54, 162, 235, 1)"],
	// 			borderWidth: 0,
    //             borderRadius: 0,
	// 			spacing: 0,
	// 			cutout: 0,
	// 		},
	// 	],
	// };

	const [logout, {loading, client}] = useMutation(LOGOUT, {
		refetchQueries: ["GetAuthenticatedUser"]
	})

	const {data} = useQuery(GET_TRANSACTIONS_STATISTICS)
	console.log("category Statistics: ", data);
	const {data: authUserData} = useQuery(GET_AUTHENTICATED_USER)

	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: "₹",
				data: [],
				backgroundColor: [],
				borderColor: [],
				borderWidth: 1,
                borderRadius: 0,
				spacing: 0,
				cutout: 120,
			},
		],
	});

	useEffect(() => {
		if(data?.categoryStatistics) {
			const categories = data.categoryStatistics.map((stat) => stat.category);
			const totalAmounts = data.categoryStatistics.map((stat) => stat.totalAmount);

			const backgroundColors = [];
			const borderColors = [];

			categories.forEach((category) => {
				if (category === "saving") {
					backgroundColors.push("rgba(75, 192, 192)");
					borderColors.push("rgba(75, 192, 192)");
				} else if (category === "expense") {
					backgroundColors.push("rgba(255, 99, 132)");
					borderColors.push("rgba(255, 99, 132)");
				} else if (category === "investment") {
					backgroundColors.push("rgba(54, 162, 235)");
					borderColors.push("rgba(54, 162, 235)");
				}
			});

			setChartData((prev) => ({
				labels: categories,
				datasets: [
					{
						...prev.datasets[0],
						data: totalAmounts,
						backgroundColor: backgroundColors,
						borderColor: borderColors,
					},
				],
			}));
		}
	}, [data])

	const handleLogout = async () => {
		// console.log("Logging out...");
		try {
			await logout()
			client.resetStore()  //clearing cache from the docs
		} catch (error) {
			console.error("Error Logging out: ", error);
			toast.error(error.message)
		}
	};

	// const loading = false;

	return (
		<>
			<div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center'>
				<div className='flex items-center'>
					<p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
						Spend wisely, track wisely
					</p>
					<img
						src={authUserData?.authUser.profilePicture}
						className='w-11 h-11 rounded-full border cursor-pointer'
						alt='Avatar'
					/>
					{!loading && <MdLogout className='mx-2 w-5 h-5 cursor-pointer' onClick={handleLogout} />}
					{/* loading spinner */}
					{loading && <div className='w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin'></div>}
				</div>
				<div className='flex flex-wrap w-full justify-center items-center gap-6'>
					<div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]  '>
						<Doughnut data={chartData} />
					</div>

					<TransactionForm />
				</div>
				<Cards />
			</div>
		</>
	);
};
export default HomePage;