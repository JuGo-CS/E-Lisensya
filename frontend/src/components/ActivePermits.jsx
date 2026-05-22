import { useState } from 'react';
import LoadScreen from './LoadScreen';
import useFetch from '../../../database/useFetch.jsx';
import AddPermit from './AddPermit.jsx';

const ActivePermits = ({ studentId }) => {
    const host = window.location.hostname;
    const [refreshKey, setRefreshKey] = useState(0);
    const url = studentId ? `http://${host}/sample/E-Lisensya/backend/student/ActivePermits.php?id=${studentId}&r=${refreshKey}` : null;

    const { data, isPending, errorMes } = useFetch(url);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelResult, setCancelResult] = useState(null);

    if (isPending) return <LoadScreen />;
    if (errorMes) return <p style={{ color: 'red' }}>Error: {errorMes}</p>;

    // build the main content depending on whether there's an active permit
    let mainContent;

    if (!data || data.permit === null) {
        mainContent = (
            <div>
                <p className=' mx-4 sm:mx-7 text-base sm:text-2xl text-gray-600 italic'>You do do not have any active permit.</p>
                <AddPermit id={studentId} />
            </div>
        );
    } else {
        mainContent = (
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
                    <button
                        onClick={() => {
                            setCancelResult(null);
                            setShowCancelModal(true);
                        }}
                        className="flex items-center justify-center bg-slate-700 hover:bg-slate-950 text-white rounded-xl cursor-pointer transition-all"
                    >
                        Cancel
                    </button>
                    <button className="flex items-center justify-center bg-slate-700 hover:bg-slate-950 text-white rounded-xl cursor-pointer transition-all">
                        Log Return
                    </button>
                </div>
            </div>
        );
    }

    // single modal instance for confirmation
    const cancelModal = showCancelModal ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-11/12 sm:w-96 shadow-xl">
                <h2 className="font-black text-xl sm:text-2xl mb-3">Cancelling the permit</h2>
                <p className="text-sm sm:text-base text-gray-700 mb-4">Do you wish to continue?</p>

                {cancelResult && (
                    <p className="mb-3 text-sm text-center">{cancelResult}</p>
                )}

                <div className="flex justify-between gap-3">
                    <button
                        onClick={() => { if (!isCancelling) setShowCancelModal(false); }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-2"
                    >
                        Close
                    </button>
                    <button
                        onClick={async () => {
                            if (isCancelling) return;
                            setIsCancelling(true);
                            setCancelResult(null);
                            try {
                                const res = await fetch(`http://${host}/sample/E-Lisensya/backend/student/CancelPermit.php`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        permit_id: data?.permit_id,
                                        actor_id: studentId,
                                        actor_is_student: 1
                                    })
                                });
                                const result = await res.json();
                                setCancelResult(result.message || JSON.stringify(result));
                                setIsCancelling(false);
                                if (result.success) {
                                    // refresh data without reloading the page
                                    setTimeout(() => {
                                        setShowCancelModal(false);
                                        setRefreshKey(k => k + 1);
                                    }, 700);
                                }
                            } catch (err) {
                                setCancelResult('Request failed.');
                                setIsCancelling(false);
                            }
                        }}
                        className="flex-1 bg-slate-700 hover:bg-slate-950 text-white rounded-lg py-2"
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