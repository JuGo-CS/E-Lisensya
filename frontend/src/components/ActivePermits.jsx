import LoadScreen from './LoadScreen';
import useFetch from '../../../database/useFetch.jsx';

const ActivePermits = ({ studentId }) => {
    const host = window.location.hostname;
    const url = studentId ? `http://${host}/sample/E-Lisensya/backend/student/ActivePermits.php?id=${studentId}` : null;

    const { data, isPending, errorMes } = useFetch(url);

    if (isPending) return <LoadScreen />;
    if (errorMes) return <p style={{ color: 'red' }}>Error: {errorMes}</p>;
    
    if (!data || data.permit === null || data.error) {
        return <p className='text-m text-gray-200'>You currently have no active permit.</p>;
    }

    return (
        <div className='h-61 sm:h-73 bg-slate-300 rounded-2xl border-2 border-slate-900 mx-4 sm:mx-7'>
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
                <button className="flex items-center justify-center bg-slate-700 text-white rounded-xl">
                    Cancel 
                </button>
                <button className="flex items-center justify-center bg-slate-700 text-white rounded-xl">
                    Log Return
                </button>
            </div>
        </div>
    );
}
 
export default ActivePermits;