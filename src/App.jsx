import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//hello world
import CardGroup from './components/UI/CardGroup';
import NavBar from './components/Layout/Navbar';
import {
	Routes,
	Route,
	Navigate,
	useNavigate,
	useParams,
	useLocation,
	HashRouter,
} from 'react-router-dom';
import LoginForm from './components/Form/LoginForm';
import FormikContainer from './components/Form/FormikContainer';
import { useState } from 'react';
import { useEffect } from 'react';
import BuildNickName from './components/Form/BuildNickname';
import axios from 'axios';
import Search from './components/Form/Search';
import { QueryContext } from './Context/QueryContext';
// import { UserContext } from './Context/UserContext';
import { useContext } from 'react';
import TestSameValue from './components/UI/TestSameValue';
// const { createProxyMiddleware } = require('http-proxy-middleware');

axios.defaults.withCredentials = true //All axios request would allow credentials, this is for convenience of not needing to write withCredential every request

export const targetServerURL =
				`${(process.env.REACT_APP_LOCAL_BACKEND_8080
		|| process.env.REACT_APP_BACKEND_URL)}`

function App() {
	const [user, setUser] = useState('');
	// const [nickname, setNickname] = useState(null);
	const navigate = useNavigate();
	let params = useParams();
	let { pathname } = useLocation();
	const [query, setQuery] = useState(null);
	const [queryContext, setQueryContext] = useState(null)
	// const [userContext, setUserContext] = useContext(null)

	//The reason I use useEffect is want the app to load the user status once
	//every time the app is loaded.

	// axios.get(`${targetServerURL}`, {withCredentials:true} )
	// 	.then(async (response) => {
	// 	console.log("response from backend url /: ", response) //asdf
	// 	})

	// console.log(process.env.REACT_APP_proxy_url)

	// const proxy_url = (process.env.REACT_APP_LOCAL_BACKEND_8080 || process.env.REACT_APP_BACKEND_URL)
	// console.log('the proxy_url is:', proxy_url)
	// console.log(`REACT_APP_proxy_url_api:`, process.env.REACT_APP_proxy_url_api)
	// console.log(`REACT_APP_BACKEND_URL:`,process.env.REACT_APP_BACKEND_URL)

	//Get the info of the user if there is user, if he does not have a nickname, direct him to
	//create a nickname.
	const getUser = async () => {
		axios.get(`${targetServerURL}/auth/login/success/`)
			.then(async (response) => {
				const user = response.data
				if (user.success === false || !user.success) {
					console.log('the server said no user')
					return
				}
				console.log('userInfo from App.jsx', user)
				setUser(user);
				if (!user.nickname) {
					navigate('/createnickname')
				}
			})
			.catch((err) => {
				console.log('ERROR!!', err);
			})
	}

	useEffect(() => { //getUser is executed once after client loads the website
		getUser();
	}, []);

	if (user && user.nickname == null && pathname !== '/createnickname') { //Make sure every users have create their nickname
		navigate('/createnickname');
		console.log('no nick name');
	}
	//The structure of the interface: Persistent Navbar on top, all content below it is depending on the route
	//There is also useContext for persisting values such as user information
	return (
		<QueryContext.Provider value={{ queryContext, setQueryContext }}>
			<NavBar className='position-sticky' user={user} /> {/*position-sticky is for the bar to keep in place when user scrolls*/}
			<div className="no_padding_body"> {/*this is a custom CSS class I created*/ }
				<Routes>
					<Route exact path="/" element={<CardGroup user={user} query={query}/>} /> {/*homepage, show cardgroup, which means all cards of animal*/}
					<Route
						path="/findAdopter"
						element={user ? <FormikContainer /> : <Navigate to="/login" />}
					/>{/*Above is if user is logged in, than show the adoption form, if not, direct them into login page*/}
					{/* <Route path="/info" element={<div>领养须知</div>} />  */} {/*Not being used*/}
					<Route path="/createnickname" element={<BuildNickName />} /> {/*Go to the login page*/}
					<Route
						path="/login"
						element={user ? <Navigate to="/" /> : <LoginForm />}
					/> {/*login page, if user is logged in and mistakenly click login, it would direct them to homepage*/}
					<Route
						path="/search"
						element={<Search />}
					/>{/*Search page*/}
					{/* <Route
						path="/.well-known/pki-validation/3B9904FB619246AC9422A8FD1D2B4005.txt"
						element={<div>hello</div>}
					/> */}
					<Route path="*" element={<div>404 Cannot find the page</div>} /> {/*Signal the path is incorrect*/}
				</Routes>
			</div>
			</QueryContext.Provider>

	);
}
export default App;
