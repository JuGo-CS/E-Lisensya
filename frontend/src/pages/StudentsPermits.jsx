import ActivePermits from "../components/permit_page/student/ActivePermits.jsx";
import InactivePermits from "../components//permit_page/student/InactivePermits.jsx";
import DateTimeIndicator from "../components/DateTimeIndicator.jsx";

const StudentsPermits = ( {id} ) => {
    return ( 
    
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pb-25">
            
            {/* Server Date & Time */}
            <div className="mt-5 shrink-0">
                <DateTimeIndicator />
            </div>

            {/* Active Permits */}
            <div className="shrink-0">
                <h1 className="font-black text-2xl sm:text-3xl text-slate-900 ml-4 sm:mx-7 pb-1 sm:pb-2">Active Permits </h1>
                <ActivePermits studentId={id} />
            </div>

            <hr class=" border-t-2 border-slate-900 mt-12 mb-5" />

            {/* Inactive Permits */}
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto ">
                <h1 className="font-black text-2xl sm:text-3xl text-slate-900 ml-4 sm:mx-7 pb-1 sm:pb-2">Inactive Permits</h1>
                <InactivePermits studentId={id} />
            </div>
        </div>
    );
}
 
export default StudentsPermits;