import LoadScreen from "./ui/LoadScreen";
import useFetch from "../hooks/useFetch";

const Roommates = ({studentId}) => {

    const host = window.location.hostname;
    const url = studentId ? `http://${host}/sample/E-Lisensya/backend/student/Roommates.php?id=${studentId}` : null;

    const { data, isPending, errorMes } = useFetch(url);

    if (isPending) return <LoadScreen />;
    if (errorMes) return <p style={{ color: 'red' }}>Error: {errorMes}</p>;
    
    if (data && data.roommates === null) {

        return (
            <div>
                <p className=' mx-4 sm:mx-7 text-base sm:text-2xl text-gray-600 italic'>You do not have any roommates.</p>
                
            </div>
        );
    }

    if (data && data.error) {
        return <p className="text-red-500 mx-4">{data.error}</p>;
    }

    return ( 
        <div className="flex flex-col gap-4" >
            <h1 className="font-black text-2xl sm:text-3xl text-slate-900 ml-4 sm:mx-7 pb-1 sm:pb-2">Room Occupants </h1>

            {data.map((roommayt, index) => {
                const cardColor = 'bg-slate-100';

                return (
                    <div key={index} className={`h-auto ${cardColor} rounded-2xl border border-slate-900 mx-4 sm:mx-7 shrink-0`}>
                        <div className="font-black text-slate-900">
                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Name</p>
                                <p className="-ml-5 sm:-ml-20"> - {roommayt.roommate_name}</p>
                            </div>

                            <hr className="border-t-2 border-slate-900" />

                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Program</p>
                                <p className="-ml-5 sm:-ml-20"> - {roommayt.program}</p>
                            </div>

                            <hr className="border-t-2 border-slate-900" />

                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Year level</p>
                                <p className="-ml-5 sm:-ml-20"> - {roommayt.year_level}</p>
                            </div>

                            <hr className="border-t-2 border-slate-900" />

                            <div className="grid grid-cols-2 p-4 sm:text-2xl items-center">
                                <p className="pl-2">Birthday</p>
                                <p className="-ml-5 sm:-ml-20"> - {roommayt.birthday}</p>
                            </div>
                        </div>
                    </div>
                );
            })}

        </div>
    );
}
 
export default Roommates;