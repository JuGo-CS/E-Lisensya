import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx';
import StudentsPermits from './pages/StudentsPermits.jsx';

function App() {

  	return (
		<div className="min-h-screen w-full bg-slate-200 font-['Cambria',serif]">
      
			<div className="min-h-screen sm:max-w-150 mx-auto bg-white">

				<Header />
				<Navbar />

				<StudentsPermits />

			</div>

    </div>


  	);
}

export default App
