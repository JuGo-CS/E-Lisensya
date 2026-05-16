import { useState } from 'react';
import { useEffect} from 'react';

const useFetch = (url) => {

    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [errorMes, setErrorMes] = useState(null);
    
    useEffect(() => {
        
        // setTimeout(() => {
            fetch(url)
                .then(res => {
                    if(!res.ok){
                        throw Error("Could not fetch data.");
                    }

                    return res.json()
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