import { useState, useCallback } from 'react';

const usePost = () => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    const post = useCallback(async (url, body = null, opts = {}) => {
        setIsPending(true);
        setError(null);
        setData(null);
        try {
            const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: body && typeof body === 'string' ? body : JSON.stringify(body),
                ...opts,
            });

            const text = await response.text();
            let json;
            try { json = JSON.parse(text); } catch (e) { json = text; }

            setData(json);
            setIsPending(false);

            if (!response.ok) {
                const msg = (json && json.message) ? json.message : `HTTP ${response.status}`;
                setError(msg);
                return { success: false, response: json, status: response.status };
            }

            return { success: true, response: json };
        } catch (e) {
            setError(e.message || 'Network error');
            setIsPending(false);
            return { success: false, error: e };
        }
    }, []);

    return { post, data, isPending, error };
};

export default usePost;
