import { useState } from 'react';
import useFetch from '../../../../../database/useFetch.jsx';
import usePost from '../../../../../database/usePost.jsx';
import LoadScreen from '../../LoadScreen';

const ActivePendingPermits = ({ personnelId }) => {
    const host = window.location.hostname;
    const [refreshKey, setRefreshKey] = useState(0);
    const url = `http://${host}/sample/E-Lisensya/backend/personnel/GetActivePendingPermit.php?r=${refreshKey}`;

    const { data, isPending, errorMes } = useFetch(url);
    const { post } = usePost();

    // modal state
    const [modal, setModal] = useState(null); // { type: 'confirm'|'deny', permit: {...} }
    const [processing, setProcessing] = useState(false);
    const [actionResult, setActionResult] = useState(null);

    if (isPending) return <LoadScreen />;
    if (errorMes) return <p style={{ color: 'red' }}>Error: {errorMes}</p>;

    const permits = data?.permits || [];

    if (permits.length === 0) {
        return (
            <p className='mx-4 sm:mx-7 text-base sm:text-2xl text-gray-600 italic'>
                No active or pending permits at the moment.
            </p>
        );
    }

    const handleAction = async () => {
        if (processing || !modal) return;
        setProcessing(true);
        setActionResult(null);

        const isConfirm = modal.type === 'confirm';
        const endpoint = isConfirm
            ? `http://${host}/sample/E-Lisensya/backend/personnel/ApprovePermit.php`
            : `http://${host}/sample/E-Lisensya/backend/personnel/RejectPermit.php`;

        try {
            const result = await post(endpoint, {
                permit_id: modal.permit.permit_id,
                personal_id: personnelId,
            });

            const msg = result.response?.message || result.error?.message || result.error || JSON.stringify(result.response || result.error || {});

            if (result.success && result.response && result.response.success) {
                setActionResult({ ok: true, message: msg });
                setTimeout(() => {
                    setModal(null);
                    setActionResult(null);
                    setRefreshKey(k => k + 1);
                }, 800);
            } else {
                setActionResult({ ok: false, message: msg });
            }
        } catch (err) {
            setActionResult({ ok: false, message: err.message || 'Request failed' });
        } finally {
            setProcessing(false);
        }
    };

    const statusColors = {
        ACTIVE: 'bg-orange-100',
        PENDING: 'bg-yellow-100',
    };

    return (
        <>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-full max-sm:mb-1">
                {permits.map((permit) => {
                    const cardColor = statusColors[permit.status] || 'bg-gray-100';
                    const isActive = permit.status === 'ACTIVE';

                    return (
                        <div key={permit.permit_id} className={`h-auto ${cardColor} rounded-2xl border-2 border-slate-900 mx-4 sm:mx-7 shrink-0`}>
                            <div className="font-black text-slate-900">
                                {/* Student Name */}
                                <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                    <p className="pl-2">Student</p>
                                    <p className="-ml-5 sm:-ml-20"> - {permit.student_name}</p>
                                </div>

                                <hr className="border-t-2 border-slate-900" />

                                {/* Room */}
                                <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                    <p className="pl-2">Room</p>
                                    <p className="-ml-5 sm:-ml-20"> - {permit.room_number}</p>
                                </div>

                                <hr className="border-t-2 border-slate-900" />

                                {/* Permit type */}
                                <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                    <p className="pl-2">Permit type</p>
                                    <p className="-ml-5 sm:-ml-20"> - {permit.permit_name}</p>
                                </div>

                                <hr className="border-t-2 border-slate-900" />

                                {/* Time created */}
                                <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                    <p className="pl-2">Time created</p>
                                    <p className="-ml-5 sm:-ml-20"> - {permit.date_created}</p>
                                </div>
                            </div>

                            {/* Action buttons — only for PENDING permits */}
                            {isActive ? (
                                <div className='flex items-center justify-center mx-auto font-extrabold italic text-xl sm:text-3xl h-13 sm:h-18 w-73 sm:w-120 item bg-gray-300 text-gray-600 rounded-xl mb-4'>
                                    <p>Student is out on permit...</p>
                                </div>
                            ) : (
                                <div className='mx-auto font-extrabold text-xl sm:text-3xl h-13 sm:h-18 grid grid-cols-2 gap-4 sm:gap-8 w-73 sm:w-120 item mb-4'>
                                    <button
                                        onClick={() => {
                                            setActionResult(null);
                                            setModal({ type: 'deny', permit });
                                        }}
                                        className="flex items-center justify-center text-gray-800 bg-gray-200 hover:bg-red-700 hover:text-white rounded-xl cursor-pointer transition-all"
                                    >
                                        Deny
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActionResult(null);
                                            setModal({ type: 'confirm', permit });
                                        }}
                                        className="flex items-center justify-center bg-slate-700 hover:bg-slate-950 text-white rounded-xl cursor-pointer transition-all"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Confirmation / Deny Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-11/12 sm:w-130 shadow-xl">
                        <h2 className="font-black text-xl sm:text-4xl mb-3">
                            {modal.type === 'confirm' ? 'Confirming permit' : 'Denying permit'}
                        </h2>
                        <p className="text-md sm:text-2xl text-gray-700">
                            {modal.type === 'confirm'
                                ? `Approve ${modal.permit.student_name}'s ${modal.permit.permit_name} permit?`
                                : `Reject ${modal.permit.student_name}'s ${modal.permit.permit_name} permit?`}
                        </p>
                        <p className="text-md sm:text-2xl text-red-700 -mt-2 mb-4"> This is irreversible!</p>

                        {actionResult && (
                            <p className={`mb-3 text-sm text-center ${actionResult.ok ? 'text-green-600' : 'text-red-600'}`}>
                                {actionResult.message}
                            </p>
                        )}

                        <div className="flex justify-between gap-3">
                            <button
                                onClick={() => { if (!processing) { setModal(null); setActionResult(null); } }}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 sm:text-2xl"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleAction}
                                disabled={processing}
                                className={`sm:text-2xl flex-1 rounded-lg py-2 text-white ${
                                    processing
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : modal.type === 'confirm'
                                            ? 'bg-slate-700 hover:bg-slate-950'
                                            : 'bg-red-600 hover:bg-red-800'
                                }`}
                            >
                                {processing
                                    ? 'Processing...'
                                    : modal.type === 'confirm'
                                        ? 'Yes, confirm'
                                        : 'Yes, deny'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
 
export default ActivePendingPermits;