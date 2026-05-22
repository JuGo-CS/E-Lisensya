import { useState } from 'react';
import { useEffect} from 'react';

const useFetch = (url) => {

    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [errorMes, setErrorMes] = useState(null);
    
    useEffect(() => {
        
        // setTimeout(() => {
            fetch(url)
                .then(async res => {
                    if (!res.ok) {
                        // try to read body for more info
                        const text = await res.text();
                        throw new Error(text || `HTTP ${res.status}`);
                    }

                    const text = await res.text();
                    try {
                        const json = JSON.parse(text);
                        return json;
                    } catch (e) {
                        // non-JSON response
                        throw new Error(text || 'Invalid JSON response');
                    }
                })
                .then((data) => {
                    setData(data);
                    setIsPending(false);
                    setErrorMes(null);
                })
                .catch((error) => {
                    setIsPending(false);
                    setErrorMes(error.message);
                })
            // }, 1000);

        // return () => abortCont.abort();

    }, [url]);

    return {data, isPending, errorMes};
}

export default useFetch;