// central API base URL for the frontend
// set VITE_API_URL in your frontend/.env file (Vite requires VITE_ prefix)
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = (path) => `${API_BASE}${path}`;

export default API_BASE;
