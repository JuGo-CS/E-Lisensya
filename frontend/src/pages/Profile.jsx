import { useState } from 'react';
import useFetch from '../../../database/useFetch.jsx';
import usePost from '../../../database/usePost.jsx';

const Profile = () => {
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

    const refresh = () => setRefreshKey(k => k + 1);

    const handleAdd = async () => {
        setFeedback(null);
        const result = await post(`http://${host}/sample/E-Lisensya/backend/profile/AddContact.php`, {
            id, contact_number: addingValue
        });
        setFeedback(result.response?.message || result.error || 'Done');
        if (result.success) { setAddingValue(''); refresh(); }
    };

    const handleDelete = async (contact) => {
        setFeedback(null);
        const result = await post(`http://${host}/sample/E-Lisensya/backend/profile/DeleteContact.php`, {
            id, contact_number: contact
        });
        setFeedback(result.response?.message || result.error || 'Done');
        if (result.success) refresh();
    };

    const startEdit = (i, v) => { setEditingIndex(i); setEditingValue(v); setFeedback(null); };
    const cancelEdit = () => { setEditingIndex(null); setEditingValue(''); };
    const saveEdit = async (oldContact) => {
        const result = await post(`http://${host}/sample/E-Lisensya/backend/profile/UpdateContact.php`, {
            id, old_contact: oldContact, new_contact: editingValue
        });
        setFeedback(result.response?.message || result.error || 'Done');
        if (result.success) { cancelEdit(); refresh(); }
    };

    // username/password editing
    const [editingCred, setEditingCred] = useState(null); // 'username' | 'password' | null
    const [credValue, setCredValue] = useState('');
    const startEditCred = (field, value) => { setEditingCred(field); setCredValue(value || ''); setFeedback(null); };
    const cancelEditCred = () => { setEditingCred(null); setCredValue(''); };
    const saveCred = async (field) => {
        setFeedback(null);
        const body = { id };
        if (field === 'username') body.username = credValue;
        if (field === 'password') body.password = credValue;
        const result = await post(`http://${host}/sample/E-Lisensya/backend/profile/UpdateProfile.php`, body);
        setFeedback(result.response?.message || result.error || 'Done');
        if (result.success) { cancelEditCred(); refresh(); }
    };

    if (!id) return <div className="p-6">Not logged in</div>;
    if (isPending) return <div className="p-6">Loading...</div>;
    if (errorMes) return <div className="p-6 text-red-600">Error: {errorMes}</div>;

    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto bg-orange-100 rounded-2xl p-6 border-2 border-slate-900">
                <h2 className="font-extrabold text-2xl sm:text-4xl mb-3">Profile</h2>

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
                        <div className="p-4 bg-white rounded shadow-sm">
                            <div className="text-sm text-gray-500">Username</div>
                            {editingCred === 'username' ? (
                                <div className="mt-2 flex gap-2">
                                    <input className="border px-2 py-1 flex-1" value={credValue} onChange={e=>setCredValue(e.target.value)} />
                                    <button onClick={()=>saveCred('username')} className="bg-slate-700 text-white rounded px-3 py-1">Save</button>
                                    <button onClick={cancelEditCred} className="bg-gray-200 rounded px-3 py-1">Cancel</button>
                                </div>
                            ) : (
                                <div className="mt-2 flex items-center">
                                    <div className="font-bold text-lg">{data.username || 'N/A'}</div>
                                    <button onClick={()=>startEditCred('username', data.username)} className="ml-auto bg-yellow-300 rounded px-2 py-1">Edit</button>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white rounded shadow-sm">
                            <div className="text-sm text-gray-500">Password</div>
                            {editingCred === 'password' ? (
                                <div className="mt-2 flex gap-2">
                                    <input type="password" className="border px-2 py-1 flex-1" value={credValue} onChange={e=>setCredValue(e.target.value)} />
                                    <button onClick={()=>saveCred('password')} className="bg-slate-700 text-white rounded px-3 py-1">Save</button>
                                    <button onClick={cancelEditCred} className="bg-gray-200 rounded px-3 py-1">Cancel</button>
                                </div>
                            ) : (
                                <div className="mt-2 flex items-center">
                                    <div className="font-bold text-lg">{data.password ? '••••••••' : 'N/A'}</div>
                                    <button onClick={()=>startEditCred('password', '')} className="ml-auto bg-yellow-300 rounded px-2 py-1">Change</button>
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
                                <div key={i} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                                    {editingIndex === i ? (
                                        <>
                                            <input value={editingValue} onChange={e=>setEditingValue(e.target.value)} className="border rounded px-2 py-1 flex-1" />
                                            <button onClick={()=>saveEdit(c)} className="bg-slate-700 text-white rounded px-3 py-1">Save</button>
                                            <button onClick={cancelEdit} className="bg-gray-200 rounded px-3 py-1">Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="font-bold">{c}</div>
                                            <div className="ml-auto flex gap-2">
                                                <button onClick={()=>startEdit(i,c)} className="bg-yellow-400 rounded px-2 py-1">Edit</button>
                                                <button onClick={()=>handleDelete(c)} className="bg-red-500 text-white rounded px-2 py-1">Delete</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}

                            <div className="mt-3 flex gap-2">
                                <input placeholder="New contact" value={addingValue} onChange={e=>setAddingValue(e.target.value)} className="border rounded px-2 py-1 flex-1" />
                                <button onClick={handleAdd} className="bg-green-600 text-white rounded px-3 py-1">Add</button>
                            </div>
                        </div>
                    </div>

                    {feedback && <div className="text-sm text-gray-700 mt-2">{feedback}</div>}
                </div>
            </div>
        </div>
    );
};

export default Profile;
