import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/headers/Header';
import Pages from './components/mainPages/Pages';
import { DataProvider } from './GlobalState';
import ReactNotification from 'react-notifications-component'

function App() {
	return (
		<DataProvider>
			<Router>
				<div className="App">
					<ReactNotification />
					<Header/>
					<Pages/>
        		</div>
			</Router>
		</DataProvider>

	);
}

export default App;
