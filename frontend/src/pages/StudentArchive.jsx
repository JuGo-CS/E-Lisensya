import LoadScreen from "../components/ui/LoadScreen";
import useFetch from "../hooks/useFetch.jsx";

const StudentArchive = ({ studentId }) => {
    const host = window.location.hostname;
    const url = studentId ? `http://${host}/sample/E-Lisensya/backend/student/InactivePermits.php?id=${studentId}` : null;

    const { data, isPending, errorMes } = useFetch(url);

    if (isPending) return <LoadScreen />;
    if (errorMes) return <p style={{ color: 'red' }}>Error: {errorMes}</p>;

    if (!data || data.permit === null) {
        return (
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pb-25">
                <div className="mt-5 shrink-0">
                    <h1 className="font-black text-2xl sm:text-3xl text-slate-900 ml-4 sm:mx-7 pb-1 sm:pb-2">Archive</h1>
                    <p className='mx-4 sm:mx-7 text-base sm:text-2xl text-gray-600 italic'>You do not have any archived permits.</p>
                </div>
            </div>
        );
    }

    const statusColors = {
        COMPLETED: 'bg-green-100',
        REJECTED: 'bg-red-300',
        BREACHED: 'bg-red-100',
        CANCELLED: 'bg-gray-200',
    };

    // Group permits by validated date (or date_created if not validated)
    const grouped = {};
    data.forEach((item) => {
        const key = item.validated_date_raw || 'Others';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
    });

    // Sort groups: validated dates descending, 'Others' at the end
    const sortedGroups = Object.keys(grouped).sort((a, b) => {
        if (a === 'Others') return 1;
        if (b === 'Others') return -1;
        return new Date(b) - new Date(a);
    });

    const formatDateLabel = (dateStr) => {
        if (dateStr === 'Others') return 'Other permits';
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
                            {grouped[dateKey].map((permitItem, index) => {
                                const cardColor = statusColors[permitItem.status] || 'bg-green-100';

                                return (
                                    <div key={index} className={`h-auto ${cardColor} rounded-2xl border border-slate-900 mx-4 sm:mx-7 shrink-0`}>
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

                                            {permitItem.validated_at && (
                                                <>
                                                    <hr className="border-t-2 border-slate-900" />
                                                    <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                                        <p className="pl-2">Validated at</p>
                                                        <p className="-ml-5 sm:-ml-20"> - {permitItem.validated_at}</p>
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
 
export default StudentArchive;
