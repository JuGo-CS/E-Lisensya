import LoadScreen from './LoadScreen';
import useFetch from '../../../database/useFetch.jsx';
import AddPermit from './AddPermit.jsx';

const ActivePermits = ({ studentId }) => {
    const host = window.location.hostname;
    const url = studentId ? `http://${host}/sample/E-Lisensya/backend/student/ActivePermits.php?id=${studentId}` : null;

    const { data, isPending, errorMes } = useFetch(url);

    if (isPending) return <LoadScreen />;
    if (errorMes) return <p style={{ color: 'red' }}>Error: {errorMes}</p>;
    
    if (data.permit === null) {

        return (
            <div>
                
                <p className=' mx-4 sm:mx-7 text-base sm:text-2xl text-gray-600 italic'>You do do not have any active permit.</p>

                <AddPermit id={studentId} />;
                
            </div>
        );
    }


    return (
        <div className='h-61 sm:h-73 bg-orange-100 rounded-2xl border-2 border-slate-900 mx-4 sm:mx-7'>
            <div className="font-black ">
                <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                    <p className="pl-2">Permit type</p>
                    <p className="-ml-5 sm:-ml-20"> - {data.permit_name}</p>
                </div>

                <hr className="border-t-2 border-slate-900" />

                <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                    <p className="pl-2">Time created</p>
                    <p className="-ml-5 sm:-ml-20"> - {data.date_created}</p>
                </div>

                <hr className="border-t-2 border-slate-900" />

                <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                    <p className="pl-2">Valid till</p>
                    <p className="-ml-5 sm:-ml-20"> - {data.valid_until}</p>
                </div>
            </div>

            <div className='mx-auto font-extrabold text-xl sm:text-3xl h-13 sm:h-18 grid grid-cols-2 gap-4 sm:gap-8 w-73 sm:w-120 item'>
                <button className="flex items-center justify-center bg-slate-700 hover:bg-slate-950 text-white rounded-xl cursor-pointer transition-all">
                    Cancel 
                </button>
                <button className="flex items-center justify-center bg-slate-700 hover:bg-slate-950 text-white rounded-xl cursor-pointer transition-all">
                    Log Return
                </button>
            </div>
        </div>
    );
}
 
export default ActivePermits;