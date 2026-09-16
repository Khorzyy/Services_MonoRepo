import crypto from 'crypto';

const sessions = new Map();

export const createSession = (user) => {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, user);
    return sessionId;
};

export const getSession = (sessionId) => {
    return sessions.get(sessionId);
};

export const deleteSession = (sessionId) => {
    sessions.delete(sessionId);
};
