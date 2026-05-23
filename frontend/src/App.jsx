import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx';
import StudentsPermits from './pages/StudentsPermits.jsx';
import StudentRoommates from './pages/StudentRoommates.jsx';
import PersonnelPermits from './pages/PersonnelPermits.jsx'; 
import PersonnelRoommates from './pages/PersonnelRoommates.jsx';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import { useState, useEffect } from 'react';

function App() {
	// persist user in localStorage so reloads keep the session
	const [user, setUser] = useState(() => {
		try {
			const raw = localStorage.getItem('user');
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	});

	useEffect(() => {
		// keep localStorage in sync when `user` changes
		if (user) localStorage.setItem('user', JSON.stringify(user));
		else localStorage.removeItem('user');
	}, [user]);

	return (
		<div className="h-screen w-full bg-slate-200 font-['Cambria',serif]">

		<div className={`h-screen sm:max-w-150 mx-auto ${user ? "bg-white" :  "bg-slate-900"} flex flex-col shadow-xl`}>

				
				{!user &&
					<Login onLoginSuccess={(userData) => setUser(userData)} />
				}
				

				{user && (
                    <>
						<Header />
						<Navbar isStudent={user.is_student}/>  

						<div className="flex-1 min-h-0 overflow-auto">
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
								<Route path="/profile" element={<Profile onSignOut={() => setUser(null)} />} />
							</Routes>
						</div> 
                    </>
                )}

			</div>


		</div>


  	);
}

export default App
