import { useState } from 'react';
import useFetch from '../hooks/useFetch.jsx';
import LoadScreen from '../components/ui/LoadScreen';

const PersonnelRoommates = () => {
    const host = window.location.hostname;
    const [refreshKey] = useState(0);
    const url = `http://${host}/sample/E-Lisensya/backend/personnel/GetActiveByRoom.php?r=${refreshKey}`;

    const { data, isPending, errorMes } = useFetch(url);

    if (isPending) return <LoadScreen />;
    if (errorMes) return <p style={{ color: 'red' }}>Error: {errorMes}</p>;

    const rooms = data?.rooms || [];

    if (rooms.length === 0) {
        return (
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pb-25">
                <div className="mt-5 shrink-0">
                    <h1 className="font-black text-2xl sm:text-3xl text-slate-900 ml-4 sm:mx-7 pb-1 sm:pb-2">Residents</h1>
                    <p className='mx-4 sm:mx-7 text-base sm:text-2xl text-gray-600 italic'>
                        No students are currently out on a permit.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pb-25">
            <div className="mt-5 shrink-0">
                <h1 className="font-black text-2xl sm:text-3xl text-slate-900 ml-4 sm:mx-7 pb-1 sm:pb-2">Residents</h1>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto max-h-full max-sm:mb-1">
                {rooms.map((room) => (
                    <div key={room.room_number} className="mx-4 sm:mx-7 shrink-0">
                        {/* Room header */}
                        <h2 className="text-xl sm:text-2xl text-gray-600 mb-1">
                            Room {room.room_number}
                        </h2>
                        <hr className="border-t border-gray-400 mb-3" />

                        {/* Student cards */}
                        <div className="flex flex-col gap-3">
                            {room.students.map((student) => (
                                <div key={student.permit_id} className="bg-orange-100 rounded-2xl border-2 border-slate-900">
                                    <div className="font-black text-slate-900">
                                        <div className="grid grid-cols-2 p-3 sm:text-xl items-center">
                                            <p className="pl-2">Student</p>
                                            <p className="-ml-5 sm:-ml-20"> - {student.student_name}</p>
                                        </div>

                                        <hr className="border-t-2 border-slate-900" />

                                        <div className="grid grid-cols-2 p-3 sm:text-xl items-center">
                                            <p className="pl-2">Permit</p>
                                            <p className="-ml-5 sm:-ml-20"> - {student.permit_name}</p>
                                        </div>

                                        <hr className="border-t-2 border-slate-900" />

                                        <div className="grid grid-cols-2 p-3 sm:text-xl items-center">
                                            <p className="pl-2">Filed at</p>
                                            <p className="-ml-5 sm:-ml-20"> - {student.time_created}</p>
                                        </div>

                                        <hr className="border-t-2 border-slate-900" />

                                        <div className="grid grid-cols-2 p-3 sm:text-xl items-center">
                                            <p className="pl-2">Valid until</p>
                                            <p className="-ml-5 sm:-ml-20"> - {student.valid_until}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default PersonnelRoommates;