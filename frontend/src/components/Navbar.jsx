import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return ( 
        <div className='fixed bottom-0 left-0 right-0 sm:max-w-150 mx-auto h-20 bg-slate-300 flex items-center justify-evenly text-slate-900'>
            
            <NavLink 
                to="/" 
                className={({ isActive }) => 
                    isActive ? "font-bold text-2xl transition-all" : "text-base"
                }
            >
                Permits
            </NavLink>

            <NavLink 
                to="/roomates" 
                className={({ isActive }) => 
                    isActive ? "font-bold text-xl scale-110 transition-all" : "text-base"
                }
            >
                Roommates
            </NavLink>

            <NavLink 
                to="/profile" 
                className={({ isActive }) => 
                    isActive ? "font-bold text-xl scale-110 transition-all" : "text-base"
                }
            >
                Profile
            </NavLink>

        </div>
    );
}

export default Navbar;