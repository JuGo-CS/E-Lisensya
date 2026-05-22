import { useState } from "react";

const Login = ({ onLoginSuccess }) => {
    const [isPending, setIsPending] = useState(false);
    const [errorMes, setErrorMes] = useState(null);

    const handleLogIn = (e) => {
        e.preventDefault(); 
        setIsPending(true);
        setErrorMes(null);

        const formData = new FormData(e.target);
        const usernameInput = formData.get("username");
        const passwordInput = formData.get("password");

        const host = window.location.hostname;
        const url = `http://${host}/sample/E-Lisensya/backend/auth/LoggingIn.php?userName=${encodeURIComponent(usernameInput)}&password=${encodeURIComponent(passwordInput)}`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw Error("Could not connect to authentication server.");
                }
                return res.json();
            })
            .then((data) => {
                setIsPending(false);
                
                // Checking the response database content matches your PHP echo
                if (data.personal_id !== null && data.personal_id !== undefined) {
                    onLoginSuccess({
                        personal_id: Number(data.personal_id),
                        is_student: Number(data.is_student)
                    });
                } else {
                    throw Error("Invalid username or password.");
                }
            })
            .catch((error) => {
                setIsPending(false);
                setErrorMes(error.message);
            });
    };

    return ( 
        <div className="flex flex-col justify-center px-6 py-12 bg-white rounded-2xl mx-5 sm:mx-10 max-sm:mt-20 sm:m-auto">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" className="mx-auto h-10 w-auto" />
                <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-black sm:text-4xl">Sign in to your account</h2>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleLogIn} method="POST" className="space-y-6">
                    
                    {/* Displaying your errorMes variable */}
                    {errorMes && (
                        <div className="text-red-600 bg-red-50 p-2 text-center text-sm font-semibold rounded-md">
                            {errorMes}
                        </div>
                    )}

                    <div>
                        <label htmlFor="username" className="block text-sm/6 font-medium text-gray-950">Username</label>
                        <div className="mt-2">
                            <input id="username" type="text" name="username" required autoComplete="username" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-950">Password</label>
                        </div>
                        <div className="mt-2">
                            <input id="password" type="password" name="password" required autoComplete="current-password" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            disabled={isPending}
                            className="flex w-full justify-center items-center rounded-md bg-indigo-500 px-3 py-1.5  hover:bg-slate-800 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 h-13 text-white font-black text-2xl sm:text-3xl disabled:opacity-50"
                        >
                            {isPending ? "Logging in..." : "Sign in"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
 
export default Login;