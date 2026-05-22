import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx';
import StudentsPermits from './pages/StudentsPermits.jsx';
import StudentRoommates from './pages/StudentRoommates.jsx';
import PersonnelPermits from './pages/PersonnelPermits.jsx'; 
import PersonnelRoommates from './pages/PersonnelRoommates.jsx';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import { useState } from 'react';

function App() {
	// const [isLogin, setIsLogin] = useState(false);
	const [user, setUser] = useState(null);

  	return (
		<div className="h-screen w-full bg-slate-200 font-['Cambria',serif] overflow-hidden">
	
			<div className={`h-screen sm:max-w-150 mx-auto ${user ? "bg-white" :  "bg-slate-900"} flex flex-col overflow-hidden shadow-xl`}>

				
				{!user &&
                    <Login onLoginSuccess={(userData) => setUser(userData)} />
                }
				

				{user && (
                    <>
						<Header />
						<Navbar />  

						<div>
							<Routes>
								{user.is_student === 1 ? (
									<>
										<Route path="/" element={<StudentsPermits id={user.personal_id} />} />
										<Route path="/roommates" element={<StudentRoommates id={user.personal_id} />} />
									</>
								) : (
									<>
										<Route path="/" element={<PersonnelPermits id={user.personal_id} />} />
										<Route path="/roommates" element={<PersonnelRoommates id={user.personal_id} />} />
									</>
								)}
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
