import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx';
import StudentsPermits from './pages/StudentsPermits.jsx';
import StudentRoommates from './pages/StudentRoommates.jsx';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import { useState } from 'react';

function App() {
	const [isLogin, setIsLogin] = useState(false);

  	return (
		<div className="min-h-screen w-full bg-slate-200 font-['Cambria',serif] overflow-hidden">
	
			<div className={`min-h-screen sm:max-w-150 mx-auto ${isLogin ? "bg-white" :  "bg-slate-900"} flex flex-col overflow-hidden shadow-xl`}>

				
				{!isLogin &&
                    <Login onLoginSuccess={() => setIsLogin(true)} />
                }
				

				{isLogin && (
                    <>
						<Header />
						<Navbar />  

						<div>
							<Routes>
								<Route path="/" element={<StudentsPermits id={2} />} />
								<Route path="/roommates" element={<StudentRoommates id={2} />} />
								<Route path="/profile" element={<div className="p-4">Under Construction</div>} />
							</Routes>
						</div> 
                    </>
                )}

			</div>


		</div>


  	);
}

export default App
