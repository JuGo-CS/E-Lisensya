import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx';
import StudentsPermits from './pages/StudentsPermits.jsx';
import StudentRoommates from './pages/StudentRoommates.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {

  	return (
		<div className="min-h-screen w-full bg-slate-200 font-['Cambria',serif] overflow-hidden">
	
			<div className="min-h-screen sm:max-w-150 mx-auto bg-white flex flex-col overflow-hidden shadow-xl">

				<Header />
				<Navbar />

				<div>
					<Routes>
						<Route path="/" element={<StudentsPermits id={1} />} />
						<Route path="/roommates" element={<StudentRoommates id={1} />} />
						<Route path="/profile" element={<div className="p-4">Under Construction</div>} />
					</Routes>
				</div>

				{/* <div>
					<StudentsPermits id={1}/>
				</div> */}

				{/* <div>
					<StudentRoommates id={1}/>
				</div> */}

			</div>

			{/* <Routes>
				<Route path="/" element={<StudentsPermits id={4}/>}/>
				<Route path="/roommates" element={<StudentRoommates id={1} />}/>
			</Routes> */}

		</div>


  	);
}

export default App
