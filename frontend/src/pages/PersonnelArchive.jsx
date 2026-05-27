import { useState } from 'react';
import useFetch from '../hooks/useFetch.jsx';
import LoadScreen from '../components/ui/LoadScreen';

const PersonnelArchive = () => {
    const host = window.location.hostname;
    const [refreshKey] = useState(0);
    const url = `http://${host}/sample/E-Lisensya/backend/personnel/GetProcessedPermits.php?r=${refreshKey}`;

    const { data, isPending, errorMes } = useFetch(url);

    if (isPending) return <LoadScreen />;
    if (errorMes) return <p style={{ color: 'red' }}>Error: {errorMes}</p>;

    const permits = data?.permits || [];

    if (permits.length === 0) {
        return (
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pb-25">
                <div className="mt-5 shrink-0">
                    <h1 className="font-black text-2xl sm:text-3xl text-slate-900 ml-4 sm:mx-7 pb-1 sm:pb-2">Archive</h1>
                    <p className='mx-4 sm:mx-7 text-base sm:text-2xl text-gray-600 italic'>
                        No archived permits yet.
                    </p>
                </div>
            </div>
        );
    }

    const statusColors = {
        COMPLETED: 'bg-green-100',
        REJECTED: 'bg-red-100',
        BREACHED: 'bg-red-100',
        CANCELLED: 'bg-gray-200',
    };

    // Group permits by validated date; fall back to date_created for breached/cancelled
    const grouped = {};
    permits.forEach((item) => {
        const key = item.validated_date_raw || item.date_created_raw;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
    });

    // Sort groups: dates descending
    const sortedGroups = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

    const formatDateLabel = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pb-25">
            <div className="mt-5 shrink-0">
                <h1 className="font-black text-2xl sm:text-3xl text-slate-900 ml-4 sm:mx-7 pb-1 sm:pb-2">Archive</h1>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto max-h-full max-sm:mb-1">
                {sortedGroups.map((dateKey) => (
                    <div key={dateKey}>
                        <p className="text-base sm:text-lg text-gray-600 ml-4 sm:mx-7 mb-1">{formatDateLabel(dateKey)}</p>
                        <hr className="border-t border-gray-400 mx-4 sm:mx-7 mb-3" />

                        <div className="flex flex-col gap-4">
                            {grouped[dateKey].map((permit) => {
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

                                            {permit.validated_at && (
                                                <>
                                                    <hr className="border-t-2 border-slate-900" />
                                                    <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                                        <p className="pl-2">Validated at</p>
                                                        <p className="-ml-5 sm:-ml-20"> - {permit.validated_at}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default PersonnelArchive;
