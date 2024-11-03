import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import TransactionPage from "./pages/TransactionPage.jsx"
import NotFoundPage from "./pages/NotFoundPage.jsx"
import Header from "./components/ui/Header.jsx"
import { useQuery } from "@apollo/client"
import { GET_AUTHENTICATED_USER } from "./GraphQl/queries/User.query.js"
import {Toaster} from "react-hot-toast"


function App() {

  // const authUser = true
  // const { loading, error, data } = useQuery(GET_AUTHENTICATED_USER)
  const { loading, data } = useQuery(GET_AUTHENTICATED_USER)

  // console.log("Loading: ", loading);
  // console.log("Authenticated user: ",data);
  // console.log("Error: ", error);
  if(loading) return null

  return (
		<>
			{data?.authUser && <Header />}
			<Routes>
				<Route 
          path='/' 
          element={data.authUser ? <HomePage /> : <Navigate to='/login' />} 
        />
				<Route 
          path='/login' 
          element={!data.authUser ? <LoginPage /> : <Navigate to='/' />} 
        />
				<Route 
          path='/signup' 
            element={!data.authUser ? <SignupPage /> : <Navigate to='/' />} 
          />
				<Route
					path='/transaction/:id'
					element={data.authUser ? <TransactionPage /> : <Navigate to='/login' />}
				/>
				<Route 
          path='*' 
          element={<NotFoundPage />} 
        />
			</Routes>
			<Toaster />
		</>
	);

}

export default App
