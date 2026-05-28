import { useState } from 'react';
import useFetch from '../../../hooks/useFetch.jsx';
import usePost from '../../../hooks/usePost.jsx';
import LoadScreen from '../../ui/LoadScreen';

const ProcessedPermits = ({ refreshKey = 0, personnelId }) => {
    const host = window.location.hostname;
    const url = `http://${host}/sample/E-Lisensya/backend/personnel/GetDailyProcessedPermits.php?r=${refreshKey}`;

    const { data, isPending, errorMes } = useFetch(url);
    const { post } = usePost();

    const [editModal, setEditModal] = useState(null); // { permit, currentStatus }
    const [processing, setProcessing] = useState(false);
    const [actionResult, setActionResult] = useState(null);

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

    // Determine which statuses the permit can be changed to
    const getEditOptions = (currentStatus) => {
        const options = [];
        if (currentStatus === 'COMPLETED') {
            options.push({ label: 'Reject', value: 'REJECTED' });
        } else if (currentStatus === 'REJECTED') {
            options.push({ label: 'Confirm', value: 'COMPLETED' });
        } else if (currentStatus === 'CANCELLED') {
            // CANCELLED is irreversible — no edit options
        }
        return options;
    };

    const handleEdit = async (newStatus) => {
        if (processing || !editModal) return;
        setProcessing(true);
        setActionResult(null);

        try {
            const result = await post(
                `http://${host}/sample/E-Lisensya/backend/personnel/EditProcessedPermit.php`,
                {
                    permit_id: editModal.permit.permit_id,
                    personal_id: personnelId,
                    new_status: newStatus,
                }
            );

            const msg = result.response?.message || result.error?.message || result.error || JSON.stringify(result.response || result.error || {});

            if (result.success && result.response && result.response.success) {
                setActionResult({ ok: true, message: msg });
                setTimeout(() => {
                    setEditModal(null);
                    setActionResult(null);
                    window.location.reload();
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

    return (
        <>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-full max-sm:mb-1 pb-25">
                {permits.map((permit) => {
                    const cardColor = statusColors[permit.status] || 'bg-gray-100';
                    const editOptions = getEditOptions(permit.status);
                    const canEdit = editOptions.length > 0;

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

                            {canEdit && (
                                <>
                                    <hr className="border-t-2 border-slate-900" />
                                    <div className="p-3 flex justify-center">
                                        <button
                                            onClick={() => {
                                                setActionResult(null);
                                                setEditModal({ permit, currentStatus: permit.status });
                                            }}
                                            className="font-bold text-base sm:text-xl bg-slate-700 hover:bg-slate-950 text-white rounded-lg px-6 py-2 transition-all cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Edit Modal */}
            {editModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-11/12 sm:w-130 shadow-xl">
                        <h2 className="font-black text-xl sm:text-4xl mb-3">Edit Permit Status</h2>
                        <p className="text-md sm:text-2xl text-gray-700 mb-4">
                            {editModal.permit.student_name}'s {editModal.permit.permit_name} permit is currently <strong>{editModal.currentStatus}</strong>.
                            <br />Change to:
                        </p>

                        {actionResult && (
                            <p className={`mb-3 text-sm text-center ${actionResult.ok ? 'text-green-600' : 'text-red-600'}`}>
                                {actionResult.message}
                            </p>
                        )}

                        <div className="flex flex-col gap-3">
                            {getEditOptions(editModal.currentStatus).map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleEdit(opt.value)}
                                    disabled={processing}
                                    className={`w-full font-bold text-xl sm:text-2xl py-3 rounded-xl text-white transition-all cursor-pointer ${
                                        processing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : opt.value === 'COMPLETED'
                                                ? 'bg-slate-700 hover:bg-slate-950'
                                                : opt.value === 'REJECTED'
                                                    ? 'bg-red-600 hover:bg-red-800'
                                                    : 'bg-gray-500 hover:bg-gray-700'
                                    }`}
                                >
                                    {processing ? 'Processing...' : opt.label}
                                </button>
                            ))}
                            <button
                                onClick={() => { if (!processing) { setEditModal(null); setActionResult(null); } }}
                                className="w-full font-bold text-xl sm:text-2xl py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all cursor-pointer mt-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
 
export default ProcessedPermits;
