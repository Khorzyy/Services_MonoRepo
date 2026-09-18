const BASE_URL = process.env.REACT_APP_BASE_URL;

export async function postData(endpoint, body) {
    try {
        const res = await fetch(`${BASE_URL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

// Untuk request dengan sessionId
export async function fetchWithAuth(endpoint) {
    try {
        const sessionId = localStorage.getItem("sessionId");

        const res = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: {
                "x-session-id": sessionId,
            },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}
