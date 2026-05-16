import ActivePermits from "../components/ActivePermits";

const StudentsPermits = () => {
    return ( 
        <div>

            {/* Active Permits */}
            <div className="mt-5">
                <h1 className="font-black text-2xl sm:text-3xl text-slate-900 ml-4 sm:mx-7 pb-1 sm:pb-2">Active Permits </h1>
                <ActivePermits studentId={2} />
            </div>

            <hr class="border-t-2 border-slate-900 mt-5 mb-5" />

            {/* Inactive Permits */}
            <div>
                <h1 className="font-black text-2xl sm:text-3xl text-slate-900">Inactive Permits</h1>
            </div>
        </div>
    );
}
 
export default StudentsPermits;