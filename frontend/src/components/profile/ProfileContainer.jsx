import { useState, useRef } from 'react';
import useFetch from '../../hooks/useFetch.jsx';
import usePost from '../../hooks/usePost.jsx';
import ConfirmModal from '../ui/ConfirmModal.jsx';
import Toast from '../ui/Toast.jsx';

const ProfileContainer = ({ onSignOut }) => {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;
    const id = user?.personal_id;
    const host = window.location.hostname;

    const [refreshKey, setRefreshKey] = useState(0);
    const url = id ? `http://${host}/sample/E-Lisensya/backend/profile/GetProfile.php?id=${id}&r=${refreshKey}` : null;
    const { data, isPending, errorMes } = useFetch(url);
    const { post } = usePost();

    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [addingValue, setAddingValue] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const confirmActionRef = useRef(null);
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');
    const [toast, setToast] = useState(null);
    const toastTimeoutRef = useRef(null);

    const addToast = (message, type = 'info') => {
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        setToast({ message, type });
        toastTimeoutRef.current = setTimeout(() => setToast(null), 3500);
    };

    const isNonEmptyString = (s) => typeof s === 'string' && s.trim().length > 0;
    const isValidContact = (s) => typeof s === 'string' && /^\d{11}$/.test(s);

    const refresh = () => setRefreshKey(k => k + 1);

    const handleAdd = async () => {
        setFeedback(null);
        if (!isValidContact(addingValue)) {
            const err = 'Contact must be exactly 11 digits.';
            setFeedback(err);
            addToast(err, 'error');
            return;
        }

        const result = await post(`http://${host}/sample/E-Lisensya/backend/profile/AddContact.php`, {
            id, contact_number: addingValue
        });
        const msg = result.response?.message || result.error || (result.response?.success ? 'Added' : 'Error');
        setFeedback(msg);
        addToast(msg, result.response?.success ? 'success' : 'error');
        if (result.response?.success) { setAddingValue(''); refresh(); }
    };

    const handleDelete = (contact) => {
        setFeedback(null);
        setConfirmTitle('Delete contact');
        setConfirmMessage(`Are you sure you want to delete ${contact}? This cannot be undone.`);
        confirmActionRef.current = async () => {
            const result = await post(`http://${host}/sample/E-Lisensya/backend/profile/DeleteContact.php`, {
                id, contact_number: contact
            });
            const msg = result.response?.message || result.error || (result.success ? 'Deleted' : 'Error');
            setFeedback(msg);
            addToast(msg, result.success ? 'success' : 'error');
            if (result.success) refresh();
        };
        setConfirmVisible(true);
    };

    const startEdit = (i, v) => { setEditingIndex(i); setEditingValue(v); setFeedback(null); };
    const cancelEdit = () => { setEditingIndex(null); setEditingValue(''); };
    const saveEdit = (oldContact) => {
        setFeedback(null);
        if (!isValidContact(editingValue)) {
            const err = 'Contact must be exactly 11 digits.';
            setFeedback(err);
            addToast(err, 'error');
            return;
        }
        setConfirmTitle('Save contact change');
        setConfirmMessage(`Are you sure you want to change ${oldContact} to ${editingValue}?`);
        confirmActionRef.current = async () => {
            const result = await post(`http://${host}/sample/E-Lisensya/backend/profile/UpdateContact.php`, {
                id, old_contact: oldContact, new_contact: editingValue
            });
            const msg = result.response?.message || result.error || (result.success ? 'Updated' : 'Error');
            setFeedback(msg);
            addToast(msg, result.success ? 'success' : 'error');
            if (result.success) { cancelEdit(); refresh(); }
        };
        setConfirmVisible(true);
    };

    // username/password editing controls
    const [editingCred, setEditingCred] = useState(null); // 'username' | 'password' | null
    const [credValue, setCredValue] = useState('');
    const startEditCred = (field, value) => { setEditingCred(field); setCredValue(value || ''); setFeedback(null); };
    const cancelEditCred = () => { setEditingCred(null); setCredValue(''); };
    const saveCred = (field) => {
        setFeedback(null);
        if (!isNonEmptyString(credValue)) {
            const err = field === 'username' ? 'Username cannot be empty.' : 'Password cannot be empty.';
            setFeedback(err);
            addToast(err, 'error');
            return;
        }
        setConfirmTitle(field === 'username' ? 'Save username' : 'Change password');
        setConfirmMessage(field === 'username' ? `Change username to "${credValue}"?` : `Change your password?`);
        confirmActionRef.current = async () => {
            const body = { id };
            if (field === 'username') body.username = credValue;
            if (field === 'password') body.password = credValue;
            const result = await post(`http://${host}/sample/E-Lisensya/backend/profile/UpdateProfile.php`, body);
            const msg = result.response?.message || result.error || (result.success ? 'Saved' : 'Error');
            setFeedback(msg);
            addToast(msg, result.success ? 'success' : 'error');
            if (result.success) { cancelEditCred(); refresh(); }
        };
        setConfirmVisible(true);
    };

    if (!id) return <div className="p-6">Not logged in</div>;
    if (isPending) return <div className="p-6">Loading...</div>;
    if (errorMes) return <div className="p-6 text-red-600">Error: {errorMes}</div>;
    // defensive: if data is still null (possible transient state), show loading instead of crashing
    if (!data) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-sm:mb-20 sm:mb-20">
            <div className="bg-gray-100 rounded-2xl p-6 border border-slate-900 overflow-x-hidden">
                <div className="flex items-center justify-center mb-3">
                    <h2 className="font-extrabold text-2xl sm:text-4xl">PROFILE</h2>
                </div>

                <div className="space-y-3">
                    <div>
                        <div className="text-sm sm:text-lg text-gray-700">Full name</div>
                        <div className="font-bold text-lg sm:text-2xl">{data.fullname}</div>
                    </div>

                    <div>
                        <div className="text-sm sm:text-lg text-gray-700">Birthday</div>
                        <div className="font-bold text-lg sm:text-2xl">{data.birthday || 'N/A'}</div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 bg-white rounded shadow-sm min-w-0">
                            <div className="text-sm text-gray-500">Username</div>
                            {editingCred === 'username' ? (
                                <div className="mt-2 w-full flex flex-col sm:flex-row gap-2 items-stretch">
                                    <input className="border px-2 py-1 flex-1 min-w-0 w-full" value={credValue} onChange={e=>setCredValue(e.target.value)} />
                                    <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-2 sm:flex-none">
                                        <button onClick={()=>saveCred('username')} className="bg-slate-700 text-white rounded px-3 py-1 w-full sm:w-auto">Save</button>
                                        <button onClick={cancelEditCred} className="bg-gray-200 rounded px-3 py-1 w-full sm:w-auto">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-2 flex items-center gap-2 min-w-0">
                                    <div className="font-bold text-lg min-w-0 truncate">{data.username || 'N/A'}</div>
                                    <button onClick={()=>startEditCred('username', data.username)} className="ml-auto bg-yellow-300 rounded px-2 py-1 flex-none">Edit</button>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white rounded shadow-sm">
                            <div className="text-sm text-gray-500">Password</div>
                            {editingCred === 'password' ? (
                                <div className="mt-2 w-full flex flex-col sm:flex-row gap-2 items-stretch">
                                    <input type="password" className="border px-2 py-1 flex-1 min-w-0 w-full" value={credValue} onChange={e=>setCredValue(e.target.value)} />
                                    <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-2 sm:flex-none">
                                        <button onClick={()=>saveCred('password')} className="bg-slate-700 text-white rounded px-3 py-1 w-full sm:w-auto">Save</button>
                                        <button onClick={cancelEditCred} className="bg-gray-200 rounded px-3 py-1 w-full sm:w-auto">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-2 flex items-center gap-2 min-w-0">
                                    <div className="font-bold text-lg min-w-0 truncate">{data.password ? '••••••••' : 'N/A'}</div>
                                    <button onClick={()=>startEditCred('password', '')} className="ml-auto bg-yellow-300 rounded px-2 py-1 flex-none">Change</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {data.is_student === 1 ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm sm:text-lg text-gray-700">Program</div>
                                <div className="font-bold">{data.program || 'N/A'}</div>
                            </div>
                            <div>
                                <div className="text-sm sm:text-lg text-gray-700">Year level</div>
                                <div className="font-bold">{data.year_level || 'N/A'}</div>
                            </div>
                            <div>
                                <div className="text-sm sm:text-lg text-gray-700">Room number</div>
                                <div className="font-bold">{data.room_number || 'N/A'}</div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="text-sm sm:text-lg text-gray-700">Job title</div>
                            <div className="font-bold text-lg sm:text-2xl">{data.job_title || 'N/A'}</div>
                        </div>
                    )}

                    <div>
                        <div className="text-sm sm:text-lg text-gray-700">Contact numbers</div>
                        <div className="space-y-2 mt-2 bg-white p-3 rounded shadow-sm">
                            {(data.contacts || []).map((c, i) => (
                                <div key={i} className="flex items-center gap-3 py-2 border-b last:border-b-0 min-w-0">
                                    {editingIndex === i ? (
                                                <div className="w-full flex flex-col sm:flex-row gap-2 items-stretch min-w-0">
                                                    <input value={editingValue} onChange={e=>setEditingValue(e.target.value)} className="border rounded px-2 py-1 flex-1 min-w-0 w-full" />
                                                    <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-2 sm:flex-none">
                                                        <button onClick={()=>saveEdit(c)} className="bg-slate-700 text-white rounded px-3 py-1 w-full sm:w-auto">Save</button>
                                                        <button onClick={cancelEdit} className="bg-gray-200 rounded px-3 py-1 w-full sm:w-auto">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="font-bold min-w-0 truncate">{c}</div>
                                                    <div className="ml-auto flex gap-2">
                                                        <button onClick={()=>startEdit(i,c)} className="bg-yellow-300 rounded px-2 py-1 flex-none">Edit</button>
                                                        <button onClick={()=>handleDelete(c)} className="bg-red-500 text-white rounded px-2 py-1 flex-none">Delete</button>
                                                    </div>
                                                </>
                                            )}
                                </div>
                            ))}

                            <div className="mt-3 flex gap-2">
                                <input placeholder="New contact" value={addingValue} onChange={e=>setAddingValue(e.target.value)} className="border rounded px-2 py-1 flex-1 min-w-0" />
                                <button onClick={handleAdd} className="bg-green-600 text-white rounded px-3 py-1 flex-none">Add</button>
                            </div>
                        </div>
                    </div>

                    {feedback && <div className="text-sm text-gray-700 mt-2">{feedback}</div>}

                    <div className="mt-4 flex justify-center">
                        <button onClick={() => { localStorage.removeItem('user'); if (onSignOut) onSignOut(); else window.location.reload(); }} className="bg-red-600 text-white rounded px-4 py-2">Sign out</button>
                    </div>

                    <ConfirmModal visible={confirmVisible} title={confirmTitle} message={confirmMessage} onCancel={()=>setConfirmVisible(false)} onConfirm={async ()=>{ setConfirmVisible(false); if (confirmActionRef.current) await confirmActionRef.current(); }} />

                    <Toast toast={toast} />
                </div>
            </div>
        </div>
    );
};

export default ProfileContainer;
