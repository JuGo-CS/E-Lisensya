import LoadScreen from './LoadScreen';
import useFetch from '../../../database/useFetch.jsx';

// Renamed the component to match its file name role
const InactivePermits = ({ studentId }) => {
    const host = window.location.hostname;
    const url = studentId ? `http://${host}/sample/E-Lisensya/backend/student/InactivePermits.php?id=${studentId}` : null;

    const { data, isPending, errorMes } = useFetch(url);

    if (isPending) return <LoadScreen />;
    if (errorMes) return <p style={{ color: 'red' }}>Error: {errorMes}</p>;

    if (data.permit === null) {
        return <p className=' mx-4 sm:mx-7 text-base sm:text-2xl text-gray-600 italic'>You do not have any inactive permit.</p>;
    }

    return (
        <div className="flex flex-col gap-4 overflow-y-auto max-h-full pb-4">
            {data.map((permitItem, index) => {
                const cardColor = permitItem.status === 'BREACHED' ? 'bg-red-100' : 'bg-green-100';

                return (
                    <div key={index} className={`h-auto ${cardColor} rounded-2xl  border border-slate-900 mx-4 sm:mx-7 shrink-0`}>
                        <div className="font-black text-slate-900">
                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Permit type</p>
                                <p className="-ml-5 sm:-ml-20"> - {permitItem.permit_name}</p>
                            </div>

                            <hr className="border-t-2 border-slate-900" />

                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Signed By</p>
                                <p className="-ml-5 sm:-ml-20"> - {permitItem.personnel}</p>
                            </div>

                            <hr className="border-t-2 border-slate-900" />

                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Status</p>
                                <p className="-ml-5 sm:-ml-20"> - {permitItem.status}</p>
                            </div>

                            <hr className="border-t-2 border-slate-900" />

                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Time created</p>
                                <p className="-ml-5 sm:-ml-20"> - {permitItem.date_created}</p>
                            </div>

                            <hr className="border-t-2 border-slate-900" />

                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Log Return</p>
                                <p className="-ml-5 sm:-ml-20"> - {permitItem.arrival_time}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
 
export default InactivePermits;