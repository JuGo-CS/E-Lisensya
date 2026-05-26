import { NavLink } from 'react-router-dom';

const Navbar = ({ isStudent }) => {
    const navText = isStudent === 1 ? "Roommates" : "Residents";


    return ( 
        <div className='fixed bottom-0 left-0 right-0 sm:max-w-150 mx-auto  h-20 bg-slate-300 flex items-center justify-evenly text-slate-900 sm:text-5xl'>
            
            <NavLink 
                to="/" 
                className={({ isActive }) => 
                    isActive 
                        ? "font-black text-2xl sm:text-3xl transition-all scale-105 text-slate-900 underline" 
                        : "font-medium text-base sm:text-2xl text-slate-600 hover:text-slate-900 transition-colors"
                }
            >
                Permits
            </NavLink>

            <NavLink 
                to="/roommates" 
                className={({ isActive }) => 
                    isActive 
                        ? "font-black text-2xl sm:text-3xl transition-all scale-105 text-slate-900 underline" 
                        : "font-medium text-base sm:text-2xl text-slate-600 hover:text-slate-900 transition-colors"
                }
            >
                {navText}
            </NavLink>

            <NavLink 
                to="/archive" 
                className={({ isActive }) => 
                    isActive 
                        ? "font-black text-2xl sm:text-3xl transition-all scale-105 text-slate-900 underline" 
                        : "font-medium text-base sm:text-2xl text-slate-600 hover:text-slate-900 transition-colors"
                }
            >
                Archive
            </NavLink>

            <NavLink 
                to="/profile" 
                className={({ isActive }) => 
                    isActive 
                        ? "font-black text-2xl sm:text-3xl transition-all scale-105 text-slate-900 underline" 
                        : "font-medium text-base sm:text-2xl text-slate-600 hover:text-slate-900 transition-colors"
                }
            >
                Profile
            </NavLink>

        </div>
    );
}

export default Navbar;