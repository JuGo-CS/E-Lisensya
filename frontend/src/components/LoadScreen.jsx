const LoadScreen = () => {
    return ( 
        <div className="flex justify-center items-center mt-10">
            <div className="flex flex-col items-center justify-center rounded-2xl p-4 h-80 sm:h-100 w-80 sm:w-120 bg-slate-300 text-black italic border border-slate-900">
                <h2 className="text-xl sm:text-2xl font-bold">Currently fetching the data</h2>
                <p className="text-m sm:text-xl font-light ">Please wait...</p>
            </div>
        </div>
    );
}
 
export default LoadScreen;