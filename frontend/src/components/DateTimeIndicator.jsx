import { useState, useEffect } from 'react';

const DateTimeIndicator = () => {
    const host = window.location.hostname;
    const [serverTime, setServerTime] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const url = `http://${host}/sample/E-Lisensya/backend/config/ServerTime.php`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch server time');
                return res.json();
            })
            .then(data => {
                if (data.datetime) {
                    setServerTime(data.datetime);
                } else {
                    throw new Error('Invalid server time response');
                }
            })
            .catch(err => {
                setError(err.message);
            });
    }, [host]);

    if (error) return null;

    return (
        <div className="text-center text-sm sm:text-base text-gray-500 font-semibold mb-2 mx-4 sm:mx-7">
            {serverTime ? (
                <p>{serverTime}</p>
            ) : (
                <p className="italic text-gray-400">Loading server time...</p>
            )}
        </div>
    );
}
 
export default DateTimeIndicator;
