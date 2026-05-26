import { useState } from 'react';
import usePost from '../../../hooks/usePost.jsx';
import LoadScreen from '../../ui/LoadScreen';
import useFetch from '../../../hooks/useFetch.jsx';
import AddPermit from './AddPermit.jsx';

const ActivePermits = ({ studentId }) => {
    const host = window.location.hostname;
    const [refreshKey, setRefreshKey] = useState(0);
    const url = studentId ? `http://${host}/sample/E-Lisensya/backend/student/ActivePermits.php?id=${studentId}&r=${refreshKey}` : null;

    const { data, isPending, errorMes } = useFetch(url);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelResult, setCancelResult] = useState(null);
    const [isLoggingReturn, setIsLoggingReturn] = useState(false);
    const { post } = usePost();

    if (isPending) return <LoadScreen />;
    if (errorMes) return <p style={{ color: 'red' }}>Error: {errorMes}</p>;

    // build the main content depending on whether there's an active permit
    let mainContent;

    const handleLogReturn = async () => {
        if (isLoggingReturn) return;
        setIsLoggingReturn(true);
        setCancelResult(null);
        const url = `http://${host}/sample/E-Lisensya/backend/student/LogReturn.php`;
        try {
            const result = await post(url, {
                permit_id: data?.permit_id,
                actor_id: studentId,
            });

            const msg = result.response?.message || result.error?.message || result.error || JSON.stringify(result.response || result.error || {});
            if (result.success && result.response && result.response.success) {
                // refresh permit data
                setTimeout(() => setRefreshKey(k => k + 1), 500);
            } else {
                setCancelResult(msg);
            }
        } catch (err) {
            setCancelResult(err.message || 'Request failed');
        } finally {
            setIsLoggingReturn(false);
        }
    }
     

    if (!data || data.permit === null) {
        mainContent = (
            <div>
                <p className=' mx-4 sm:mx-7 text-base sm:text-2xl text-gray-600 italic'>You do not have any active permit.</p>
                <AddPermit id={studentId} onFiled={() => setRefreshKey(k => k + 1)} />
            </div>
        );
    } else {
        mainContent = (
            <div className={`${data?.status === 'ACTIVE' ? 'h-61 sm:h-73' : 'h-75 sm:h-90'} bg-orange-100 rounded-2xl border-2 border-slate-900 mx-4 sm:mx-7`}>
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

                    {data?.status === 'PENDING' && (
                        <>
                            <hr className="border-t-2 border-slate-900" />
                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Log Return</p>
                                <p className="-ml-5 sm:-ml-20"> - {data.arrival_time || 'N/A'}</p>
                            </div>
                        </>
                    )}
                </div>

                {data?.status === 'ACTIVE' && (
                    <div className='mx-auto font-extrabold text-xl sm:text-3xl h-13 sm:h-18 grid grid-cols-2 gap-4 sm:gap-8 w-73 sm:w-120 item '>
                        <button
                            onClick={() => {
                                setCancelResult(null);
                                setShowCancelModal(true);
                            }}
                            className="flex items-center justify-center text-gray-800 bg-gray-200 hover:bg-slate-950 hover:text-white rounded-xl cursor-pointer transition-all"
                        >
                            Cancel
                        </button>
                        <button onClick={handleLogReturn} disabled={isLoggingReturn} className={`flex items-center justify-center ${isLoggingReturn ? 'bg-gray-400 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-950'} text-white rounded-xl cursor-pointer transition-all`}>
                            {isLoggingReturn ? 'Logging...' : 'Log Return'}
                        </button>
                    </div>
                )}

                {data?.status === 'PENDING' && (
                    <div className='flex items-center justify-center mx-auto font-extrabold italic text-xl sm:text-3xl h-13 sm:h-18 w-73 sm:w-120 item cursor-not-allowed bg-gray-300 text-gray-600 rounded-xl'>
                        <p>Pending approval...</p>
                    </div>
                )}


            </div>
        );
    }

    // single modal instance for confirmation
    const cancelModal = showCancelModal ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-11/12 sm:w-130 shadow-xl">
                <h2 className="font-black text-xl sm:text-4xl mb-3 ">Cancelling the permit</h2>
                <p className="text-md sm:text-2xl text-gray-700">Do you wish to continue?</p>
                <p className="text-md sm:text-2xl text-red-700 -mt-2 mb-4"> This is irreversible!</p>

                {cancelResult && (
                    <p className="mb-3 text-sm text-center">{cancelResult}</p>
                )}

                <div className="flex justify-between gap-3">
                    <button
                        onClick={() => { if (!isCancelling) setShowCancelModal(false); }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 sm:text-2xl"
                    >
                        Close
                    </button>
                    <button
                        onClick={async () => {
                            if (isCancelling) return;
                            setIsCancelling(true);
                            setCancelResult(null);
                            try {
                                const url = `http://${host}/sample/E-Lisensya/backend/student/CancelPermit.php`;
                                const result = await post(url, {
                                    permit_id: data?.permit_id,
                                    actor_id: studentId,
                                    actor_is_student: 1
                                });

                                setCancelResult(result.response?.message || JSON.stringify(result.response || result.error));
                                setIsCancelling(false);
                                if (result.success && result.response && result.response.success) {
                                    // refresh data without reloading the page
                                    setTimeout(() => {
                                        setShowCancelModal(false);
                                        setRefreshKey(k => k + 1);
                                    }, 700);
                                }
                            } catch (err) {
                                setCancelResult(err.message || 'Request failed.');
                                setIsCancelling(false);
                            }
                        }}
                        className="sm:text-2xl flex-1 bg-slate-700 hover:bg-slate-950 text-white rounded-lg py-2"
                    >
                        {isCancelling ? 'Cancelling...' : 'Yes, continue'}
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            {mainContent}
            {cancelModal}
        </>
    );
}
 
export default ActivePermits;