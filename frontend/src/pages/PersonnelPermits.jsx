import { useState, useCallback } from 'react';
import ActivePendingPermits from "../components/permit_page/personnel/ActivePendingPermits.jsx";
import ProcessedPermits from "../components/permit_page/personnel/ProcessedPermits.jsx";
import DateTimeIndicator from "../components/DateTimeIndicator.jsx";

const PersonnelPermits = ({ id }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), []);

    return ( 
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pb-25">
            
            {/* Server Date & Time */}
            <div className="mt-5 shrink-0">
                <DateTimeIndicator />
            </div>

            <div className="shrink-0">
                <h1 className="font-black text-2xl sm:text-3xl text-slate-900 ml-4 sm:mx-7 pb-1 sm:pb-2">Active Permits</h1>

                <ActivePendingPermits personnelId={id} onActionDone={triggerRefresh} />

            </div>

            <hr className="border-t-2 border-slate-900 mt-12 mb-5" />

            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
                <h1 className="font-black text-2xl sm:text-3xl text-slate-900 ml-4 sm:mx-7 pb-1 sm:pb-2">Processed Permits</h1>

                <ProcessedPermits refreshKey={refreshKey} />
            </div>
        </div>
     );
}
 
export default PersonnelPermits;