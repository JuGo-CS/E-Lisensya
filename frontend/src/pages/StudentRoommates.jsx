import Roommates from "../components/Roommates.jsx";

const StudentRoommates = ({id}) => {
    
    return ( 
        <div className="h-full flex flex-col overflow-y-auto pb-25">
            
            {/* Active Permits */}
            <div className="mt-5 shrink-0">
                <Roommates studentId={id} />
            </div>

        </div>
    );
}
 
export default StudentRoommates;