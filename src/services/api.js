const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001';
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

if (import.meta.env.PROD && typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(hostname);

  if (!isLocalHost && API_BASE_URL.startsWith('http://localhost')) {
    console.error(
      'API_BASE_URL is still pointing to a localhost address in production. Set VITE_API_BASE_URL to your deployed backend URL before building.'
    );
  }
}

async function apiFetch(path, { method = 'GET', body, token, headers = {} } = {}) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    credentials: 'include'
  };

  if (body !== undefined) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || 'Request failed');
    error.status = response.status;
    error.details = errorBody.details;
    if (errorBody.code && !error.code) {
      error.code = errorBody.code;
    }
    if (errorBody.debug && !error.debug) {
      error.debug = errorBody.debug;
    }
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function syncAccount({ token }) {
  return apiFetch('/api/auth/sync', {
    method: 'POST',
    token
  });
}

export function fetchProfile({ token }) {
  return apiFetch('/api/profile/me', {
    method: 'GET',
    token
  });
}

export function updateProfile({ token, data }) {
  return apiFetch('/api/profile/me', {
    method: 'PUT',
    token,
    body: data
  });
}

export function fetchEvents() {
  return apiFetch('/api/events');
}

export function createEvent({ token, data }) {
  return apiFetch('/api/events', {
    method: 'POST',
    token,
    body: data
  });
}

export function fetchHackFinderPosts() {
  return apiFetch('/api/hackfinder');
}

export function createHackFinderPost({ token, data }) {
  return apiFetch('/api/hackfinder', {
    method: 'POST',
    token,
    body: data
  });
}

export function fetchAdminQueues({ token }) {
  return apiFetch('/api/admin/queues', {
    method: 'GET',
    token
  });
}

export function approveEvent({ token, eventId }) {
  return apiFetch(`/api/admin/events/${eventId}/approve`, {
    method: 'POST',
    token
  });
}

export function rejectEvent({ token, eventId }) {
  return apiFetch(`/api/admin/events/${eventId}/reject`, {
    method: 'POST',
    token
  });
}

export function deleteEvent({ token, eventId }) {
  return apiFetch(`/api/admin/events/${eventId}`, {
    method: 'DELETE',
    token
  });
}

export function approveHackFinderPost({ token, postId }) {
  return apiFetch(`/api/admin/hackfinder/${postId}/approve`, {
    method: 'POST',
    token
  });
}

export function rejectHackFinderPost({ token, postId }) {
  return apiFetch(`/api/admin/hackfinder/${postId}/reject`, {
    method: 'POST',
    token
  });
}

export function deleteHackFinderPost({ token, postId }) {
  return apiFetch(`/api/admin/hackfinder/${postId}`, {
    method: 'DELETE',
    token
  });
}

export { API_BASE_URL };
