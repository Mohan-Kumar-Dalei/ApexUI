// Every call to the server goes through here, so errors come back in one shape.
export class ApiError extends Error {
    constructor(message, status, fields) {
        super(message);
        this.status = status;
        this.fields = fields || {};
    }
}

// The demo build (VITE_DEMO=1) has no server: the same routes run in the browser.
const DEMO = import.meta.env.VITE_DEMO === '1';

export async function api(path, { method = 'GET', body, signal } = {}) {
    if (DEMO) {
        const { mockApi } = await import('./mock.js');
        try {
            const data = await mockApi(path, { method, body });
            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
            return data;
        } catch (e) {
            if (e.name === 'AbortError') throw e;
            throw new ApiError(e.message, e.status, e.fields);
        }
    }
    let res;
    try {
        res = await fetch(`/api${path}`, {
            method,
            signal,
            headers: body ? { 'content-type': 'application/json' } : undefined,
            body: body ? JSON.stringify(body) : undefined,
            credentials: 'same-origin',
        });
    } catch (e) {
        if (e.name === 'AbortError') throw e;
        throw new ApiError('Could not reach the store. Check your connection and try again.', 0);
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(data.error || 'Something went wrong. Try again.', res.status, data.fields);
    return data;
}

export const rupees = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
