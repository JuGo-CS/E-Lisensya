

import { useState, useMemo } from 'react';
import usePost from '../../../hooks/usePost.jsx';

const AddPermit = ({ id, onFiled }) => {
    const [showModal, setShowModal] = useState(false);
    const [permitType, setPermitType] = useState('Late');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // device time checks
    const now = useMemo(() => new Date(), []);
    const hour = now.getHours();

    // FOR THE TIME LOGIC CATCHER ~  NO FILING OF PERMIT AFTER 6:00PM
    // don't forget to 'uncomment' ang ara sa backend/student/FilePermit.php
    // const allowedNow = hour >= 6 && hour < 18;
    const allowedNow = 1;

    // compute preview of valid-until based on permitType and device time
    const validUntilPreview = useMemo(() => {
        if (permitType === 'Late') {
            const d = new Date(now);
            d.setHours(23, 0, 0, 0);
            return d;
        }
        if (permitType === 'Overnight') {
            const d = new Date(now);
            d.setDate(d.getDate() + 1);
            d.setHours(23, 0, 0, 0);
            return d;
        }
        return null; // Weekend
    }, [permitType, now]);

    const open = () => {
        setError(null);
        if (!allowedNow) {
            setError('Filing is allowed between 6:00 AM and 6:00 PM.');
            return;
        }
        setShowModal(true);
        setPermitType('Late');
    };

    const { post } = usePost();

    const handleSubmit = async () => {
        setError(null);
        const nowCheck = new Date();

        setIsSubmitting(true);
        const host = window.location.hostname;
        const url = `http://${host}/sample/E-Lisensya/backend/student/FilePermit.php`;
        const result = await post(url, {
            student_id: id,
            personnel_id: 0,
            permit_name: permitType,
            client_time: nowCheck.toISOString(),
            client_offset_minutes: nowCheck.getTimezoneOffset()
        });

        console.log('FilePermit result:', result);
        if (result.success && result.response && result.response.success) {
            setShowModal(false);
            if (onFiled) onFiled();
        } else {
            const detail = result.response ?? result.error ?? result;
            const msg = (detail && detail.message) ? detail.message : (typeof detail === 'string' ? detail : JSON.stringify(detail));
            setError(msg || 'Failed to file permit');
        }
        setIsSubmitting(false);
    };

    // Always show the File A Permit button; disable it outside allowed hours

    return (
        <div className="h-20 sm:h-25 mt-5 mx-5 sm:mx-7 -mb-4 text-black">
            <button onClick={open} disabled={!allowedNow} className={`h-full w-full rounded-xl text-white font-black text-3xl sm:text-5xl transition-all ${allowedNow ? 'bg-slate-700 hover:bg-slate-900 cursor-pointer' : 'bg-gray-400 opacity-60 cursor-not-allowed'}`}>
                File A Permit
            </button>

            {!allowedNow && (
                <div className="text-sm text-gray-600 mt-2">Filing allowed between 6:00 AM and 6:00 PM.</div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-11/12 sm:w-110 shadow-2xl border">
                        <div className="flex items-start gap-4">
                            <div>
                                <h2 className="font-extrabold text-3xl">File a Permit</h2>
                                <p className="text-base">Choose a permit type and confirm. Filing is allowed between <strong>6:00 AM</strong> and <strong>6:00 PM</strong>.</p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                                <input type="radio" name="ptype" value="Late" checked={permitType==='Late'} onChange={() => setPermitType('Late')} />
                                <div>
                                    <div className="font-bold text-xl">Late</div>
                                    <div className="text-base">Extends curfew until 11:00 PM tonight.</div>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                                <input type="radio" name="ptype" value="Overnight" checked={permitType==='Overnight'} onChange={() => setPermitType('Overnight')} />
                                <div>
                                    <div className="font-bold text-xl">Overnight</div>
                                    <div className="text-base">Extends curfew until 11:00 PM the following day.</div>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                                <input type="radio" name="ptype" value="Weekend" checked={permitType==='Weekend'} onChange={() => setPermitType('Weekend')} />
                                <div>
                                    <div className="font-bold text-xl">Weekend</div>
                                    <div className="text-base">No time limits for weekends.</div>
                                </div>
                            </label>
                        </div>

                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg">Preview valid until:</div>
                            <div className="font-bold text-lg">{validUntilPreview ? validUntilPreview.toLocaleString() : 'No limit'}</div>
                        </div>

                        {error && <div className="text-red-600 mt-3">{error}</div>}

                        <div className="mt-5 flex gap-3 h-15 text-xl">

                            <button onClick={() => setShowModal(false)} className="flex-1 bg-white border border-slate-500  hover:bg-slate-950 hover:text-white transition-all rounded-lg py-2">Cancel</button>

                            <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-slate-800 text-white rounded-lg py-2 hover:bg-slate-950 transition-all">{isSubmitting ? 'Filing...' : 'File Permit'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddPermit;