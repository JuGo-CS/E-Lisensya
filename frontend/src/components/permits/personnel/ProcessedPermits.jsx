import useFetch from '../../../hooks/useFetch.jsx';
import LoadScreen from '../../ui/LoadScreen';

const ProcessedPermits = ({ refreshKey = 0 }) => {
    const host = window.location.hostname;
    const url = `http://${host}/sample/E-Lisensya/backend/personnel/GetDailyProcessedPermits.php?r=${refreshKey}`;

    const { data, isPending, errorMes } = useFetch(url);

    if (isPending) return <LoadScreen />;
    if (errorMes) return <p style={{ color: 'red' }}>Error: {errorMes}</p>;

    const permits = data?.permits || [];

    if (permits.length === 0) {
        return (
            <p className='mx-4 sm:mx-7 text-base sm:text-2xl text-gray-600 italic'>
                No processed permits yet.
            </p>
        );
    }

    const statusColors = {
        COMPLETED: 'bg-green-100',
        REJECTED: 'bg-red-100',
        BREACHED: 'bg-red-100',
        CANCELLED: 'bg-gray-200',
    };

    return (
        <div className="flex flex-col gap-4 overflow-y-auto max-h-full max-sm:mb-1 pb-25">
            {permits.map((permit) => {
                const cardColor = statusColors[permit.status] || 'bg-gray-100';

                return (
                    <div key={permit.permit_id} className={`h-auto ${cardColor} rounded-2xl border border-slate-900 mx-4 sm:mx-7 shrink-0`}>
                        <div className="font-black text-slate-900">
                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Student</p>
                                <p className="-ml-5 sm:-ml-20"> - {permit.student_name}</p>
                            </div>

                            <hr className="border-t-2 border-slate-900" />

                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Room</p>
                                <p className="-ml-5 sm:-ml-20"> - {permit.room_number}</p>
                            </div>

                            <hr className="border-t-2 border-slate-900" />

                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Permit type</p>
                                <p className="-ml-5 sm:-ml-20"> - {permit.permit_name}</p>
                            </div>

                            <hr className="border-t-2 border-slate-900" />

                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Status</p>
                                <p className="-ml-5 sm:-ml-20"> - {permit.status}</p>
                            </div>

                            <hr className="border-t-2 border-slate-900" />

                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Signed By</p>
                                <p className="-ml-5 sm:-ml-20"> - {permit.personnel_name}</p>
                            </div>

                            <hr className="border-t-2 border-slate-900" />

                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Time created</p>
                                <p className="-ml-5 sm:-ml-20"> - {permit.date_created}</p>
                            </div>

                            {permit.arrival_time && (
                                <>
                                    <hr className="border-t-2 border-slate-900" />
                                    <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                        <p className="pl-2">Log Return</p>
                                        <p className="-ml-5 sm:-ml-20"> - {permit.arrival_time}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
 
export default ProcessedPermits;
