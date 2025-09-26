import { useCallback, useEffect, useMemo, useState } from 'react';
import { initialData } from './data';
import { formatDate } from './utils';
import Modal from './components/Modal';
import { useAuth } from './contexts/AuthContext.jsx';
import {
  API_BASE_URL,
  fetchEvents,
  createEvent as createEventApi,
  fetchHackFinderPosts,
  createHackFinderPost as createHackFinderPostApi,
  fetchAdminQueues,
  approveEvent as approveEventApi,
  rejectEvent as rejectEventApi,
  deleteEvent as deleteEventApi,
  approveHackFinderPost as approveHackFinderPostApi,
  rejectHackFinderPost as rejectHackFinderPostApi,
  deleteHackFinderPost as deleteHackFinderPostApi
} from './services/api.js';
const ROLES = {
  ADMIN: 'admin',
  EVENT_HEAD: 'eventHead',
  STUDENT: 'student'
};

const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.EVENT_HEAD]: 'Event Head',
  [ROLES.STUDENT]: 'Student'
};

const EVENT_FORM_INITIAL_STATE = {
  title: '',
  date: '',
  time: '',
  department: '',
  description: '',
  registrationLink: ''
};

const POST_FORM_INITIAL_STATE = {
  type: '',
  title: '',
  description: '',
  skills: '',
  contact: '',
  teamSize: ''
};

const PROFILE_FORM_INITIAL_STATE = {
  name: '',
  email: '',
  department: '',
  year: '',
  skills: '',
  interests: ''
};

function getAuthErrorMessage(error, mode) {
  if (!error) {
    return '';
  }

  const code = error?.code ?? '';

  if (code === 'network-error' || error?.name === 'TypeError') {
    return (
      error?.message ??
      `We couldn't reach the EventsHub API at ${API_BASE_URL}. Please make sure the backend server is running.`
    );
  }

  switch (code) {
    case 'auth/network-request-failed':
      return 'Network connection failed. Check your internet connection and try again.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Allow popups for this site or try again.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'The Google sign-in window was closed before completing.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is disabled for this project. Enable it in your Firebase console.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try logging in instead.';
    case 'auth/invalid-email':
      return 'That email address looks invalid. Please double-check and try again.';
    case 'auth/weak-password':
      return 'Passwords must be at least 6 characters long.';
    case 'auth/user-not-found':
      return 'No account matches that email. You may need to register first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a bit and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact an administrator for help.';
    default:
      return error?.message ?? `Unable to ${mode === 'register' ? 'register' : 'log in'}. Please try again.`;
  }
}

function normalizeAppData(data) {
  return {
    ...data,
    events: Array.isArray(data.events) ? data.events : [],
    hackfinderPosts: Array.isArray(data.hackfinderPosts) ? data.hackfinderPosts : [],
    pendingEvents: Array.isArray(data.pendingEvents) ? data.pendingEvents : [],
    pendingHackfinderPosts: Array.isArray(data.pendingHackfinderPosts)
      ? data.pendingHackfinderPosts
      : []
  };
}

export default function App() {
  const {
    user: authUser,
    profile,
    initializing: authInitializing,
    actionLoading: authLoading,
    error: authError,
    isAuthenticated,
    logout: logoutAccount,
    loginWithGoogle: loginWithGoogleAccount,
    updateProfile: updateProfileAccount,
    getToken
  } = useAuth();
  const [appData, setAppData] = useState(() =>
    normalizeAppData({
      ...initialData,
      events: [],
      hackfinderPosts: [],
      pendingEvents: [],
      pendingHackfinderPosts: []
    })
  );

  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [eventSearch, setEventSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [hackfinderTab, setHackfinderTab] = useState('teams');
  const [eventForm, setEventForm] = useState(EVENT_FORM_INITIAL_STATE);
  const [postForm, setPostForm] = useState(POST_FORM_INITIAL_STATE);
  const [profileForm, setProfileForm] = useState(PROFILE_FORM_INITIAL_STATE);
  const [authMessage, setAuthMessage] = useState('');
  const [eventsLoading, setEventsLoading] = useState(true);
  const [hackfinderLoading, setHackfinderLoading] = useState(true);
  const [queuesLoading, setQueuesLoading] = useState(false);
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [moderationLoading, setModerationLoading] = useState(false);
  const [dataError, setDataError] = useState(null);

  const userRole = authUser?.role ?? null;
  const isAdmin = userRole === ROLES.ADMIN;
  const isEventHead = userRole === ROLES.EVENT_HEAD;
  const isStudent = userRole === ROLES.STUDENT;

  const refreshEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const data = await fetchEvents();
      setAppData((prev) => ({
        ...prev,
        events: Array.isArray(data?.events) ? data.events : []
      }));
      setDataError((prev) => (prev?.context === 'events' ? null : prev));
    } catch (error) {
      console.error('Failed to load events', error);
      setDataError({ context: 'events', error });
    } finally {
      setEventsLoading(false);
    }
  }, []);

  const refreshHackfinderPosts = useCallback(async () => {
    setHackfinderLoading(true);
    try {
      const data = await fetchHackFinderPosts();
      setAppData((prev) => ({
        ...prev,
        hackfinderPosts: Array.isArray(data?.posts) ? data.posts : []
      }));
      setDataError((prev) => (prev?.context === 'hackfinder' ? null : prev));
    } catch (error) {
      console.error('Failed to load hackfinder posts', error);
      setDataError({ context: 'hackfinder', error });
    } finally {
      setHackfinderLoading(false);
    }
  }, []);

  const refreshAdminQueues = useCallback(async () => {
    if (!isAdmin) {
      setAppData((prev) => ({
        ...prev,
        pendingEvents: [],
        pendingHackfinderPosts: []
      }));
      setDataError((prev) => (prev?.context === 'queues' ? null : prev));
      return;
    }

    setQueuesLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required to manage pending submissions.');
      }
      const data = await fetchAdminQueues({ token });
      setAppData((prev) => ({
        ...prev,
        pendingEvents: Array.isArray(data?.events) ? data.events : [],
        pendingHackfinderPosts: Array.isArray(data?.hackfinderPosts) ? data.hackfinderPosts : []
      }));
      setDataError((prev) => (prev?.context === 'queues' ? null : prev));
    } catch (error) {
      console.error('Failed to load admin queues', error);
      setDataError({ context: 'queues', error });
    } finally {
      setQueuesLoading(false);
    }
  }, [getToken, isAdmin]);

  const canSubmitEvent = isAdmin || isEventHead;
  const canSubmitPost = isAdmin || isEventHead || isStudent;

  const currentProfile = useMemo(() => {
    const base = appData.currentUser ?? {};
    return {
      ...base,
      name: profile?.name ?? base.name ?? '',
      email: profile?.contactEmail ?? profile?.email ?? base.email ?? '',
      contactEmail: profile?.contactEmail ?? base.contactEmail ?? base.email ?? '',
      department: profile?.department ?? base.department ?? '',
      year: profile?.year ?? base.year ?? '',
      skills: profile?.skills ?? base.skills ?? [],
      interests: profile?.interests ?? base.interests ?? []
    };
  }, [appData.currentUser, profile]);

  useEffect(() => {
    setProfileForm(mapProfileToForm(profile));
  }, [profile]);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  useEffect(() => {
    refreshHackfinderPosts();
  }, [refreshHackfinderPosts]);

  useEffect(() => {
    refreshAdminQueues();
  }, [refreshAdminQueues]);

  const featuredEvents = useMemo(
    () => appData.events.filter((event) => event.featured),
    [appData.events]
  );

  const filteredEvents = useMemo(() => {
    const searchValue = eventSearch.trim().toLowerCase();

    return appData.events.filter((event) => {
      const matchesSearch =
        !searchValue ||
        event.title.toLowerCase().includes(searchValue) ||
        event.description.toLowerCase().includes(searchValue) ||
        event.department.toLowerCase().includes(searchValue);

      const matchesDepartment = !departmentFilter || event.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [appData.events, departmentFilter, eventSearch]);

  const teamsPosts = useMemo(
    () => appData.hackfinderPosts.filter((post) => post.type === 'team'),
    [appData.hackfinderPosts]
  );

  const individualPosts = useMemo(
    () => appData.hackfinderPosts.filter((post) => post.type === 'individual'),
    [appData.hackfinderPosts]
  );

  const registeredEvents = useMemo(() => {
    const registeredIds = new Set((currentProfile.eventsRegistered ?? []).map((id) => id?.toString()));
    return appData.events.filter((event) => registeredIds.has(event.id?.toString()));
  }, [currentProfile.eventsRegistered, appData.events]);

  const pendingEvents = appData.pendingEvents ?? [];
  const pendingHackfinderPosts = appData.pendingHackfinderPosts ?? [];

  const sortedPendingEvents = useMemo(() => {
    return [...pendingEvents].sort((a, b) => {
      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [pendingEvents]);

  const sortedPendingPosts = useMemo(() => {
    return [...pendingHackfinderPosts].sort((a, b) => {
      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [pendingHackfinderPosts]);

  function mapProfileToForm(profile) {
    if (!profile) {
      return { ...PROFILE_FORM_INITIAL_STATE };
    }

    return {
      ...PROFILE_FORM_INITIAL_STATE,
      name: profile.name ?? '',
      email: profile.contactEmail ?? profile.email ?? '',
      department: profile.department ?? '',
      year: profile.year ?? '',
      skills: (profile.skills ?? []).join(', '),
      interests: (profile.interests ?? []).join(', ')
    };
  }

  function formatDateTime(timestamp) {
    if (!timestamp) {
      return 'Unknown';
    }

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return 'Unknown';
    }

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  function handleNavigate(page) {
    setCurrentPage(page);
    setIsMobileNavOpen(false);
  }

  function openModal(modalName) {
    if (modalName === 'event') {
      if (!canSubmitEvent) {
        window.alert('Please log in as an Admin or Event Head to create events.');
        return;
      }
      setEventForm(EVENT_FORM_INITIAL_STATE);
    }

    if (modalName === 'post') {
      if (!canSubmitPost) {
        window.alert('Please log in to create HackFinder posts.');
        return;
      }
      setPostForm(POST_FORM_INITIAL_STATE);
    }

    if (modalName === 'profile') {
      setProfileForm(mapProfileToForm(profile));
    }

    if (modalName === 'login') {
      setAuthMessage('');
    }

    setActiveModal(modalName);
  }

  function closeModal() {
    setActiveModal(null);
  }

  const handleEventFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handlePostFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setPostForm((prev) => {
      const next = {
        ...prev,
        [name]: value
      };

      if (name === 'type' && value !== 'team') {
        next.teamSize = '';
      }

      return next;
    });
  }, []);

  const handleProfileFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  async function handleGoogleSignIn() {
    try {
      setAuthMessage('');
      await loginWithGoogleAccount();
      closeModal();
    } catch (error) {
      console.error('Google sign-in failed', error);
      setAuthMessage(getAuthErrorMessage(error, 'login'));
    }
  }

  async function handleEventSubmission(event) {
    event.preventDefault();
    if (!canSubmitEvent) {
      window.alert('Only Admin or Event Head accounts can submit events.');
      return;
    }

    const requiredFields = ['title', 'date', 'time', 'department', 'description', 'registrationLink'];
    const missingField = requiredFields.find((field) => !eventForm[field]?.trim());
    if (missingField) {
      window.alert('Please complete all event fields before submitting.');
      return;
    }

    setEventSubmitting(true);
    try {
      const token = await getToken(true);
      if (!token) {
        throw new Error('Authentication required to submit events.');
      }

      const payload = {
        title: eventForm.title.trim(),
        date: eventForm.date.trim(),
        time: eventForm.time.trim(),
        department: eventForm.department.trim(),
        description: eventForm.description.trim(),
        registrationLink: eventForm.registrationLink.trim(),
        featured: false
      };

      const { event: createdEvent } = await createEventApi({ token, data: payload });

      if (createdEvent?.status === 'published') {
        await refreshEvents();
        window.alert('Event published successfully!');
      } else {
        await refreshAdminQueues();
        if (!isAdmin) {
          window.alert('Event submitted for admin approval.');
        }
      }

      closeModal();
      setEventForm(EVENT_FORM_INITIAL_STATE);
    } catch (error) {
      console.error('Failed to submit event', error);
      window.alert(error?.message ?? 'Failed to submit event. Please try again.');
    } finally {
      setEventSubmitting(false);
    }
  }

  async function handlePostSubmission(event) {
    event.preventDefault();

    if (!canSubmitPost) {
      window.alert('Please log in to submit HackFinder posts.');
      return;
    }

    if (!postForm.type) {
      window.alert('Please select whether you are a team or an individual.');
      return;
    }

    if (!postForm.title.trim() || !postForm.description.trim() || !postForm.contact.trim()) {
      window.alert('Please provide a title, description, and contact info for your post.');
      return;
    }

    setPostSubmitting(true);

    try {
      const token = await getToken(true);
      if (!token) {
        throw new Error('Authentication required to submit HackFinder posts.');
      }

      const skills = postForm.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      const payload = {
        type: postForm.type.trim(),
        title: postForm.title.trim(),
        description: postForm.description.trim(),
        skills,
        contact: postForm.contact.trim(),
        teamSize:
          postForm.type === 'team' && postForm.teamSize ? postForm.teamSize.trim() : undefined,
        author: profile?.name || currentProfile.name || 'Anonymous Member',
        department: profile?.department || currentProfile.department || 'General'
      };

      const { post } = await createHackFinderPostApi({ token, data: payload });

      if (post?.status === 'published') {
        await refreshHackfinderPosts();
        window.alert('Post published successfully!');
      } else {
        await refreshAdminQueues();
        if (!isAdmin) {
          window.alert('Post submitted for admin approval.');
        }
      }

      closeModal();
      setPostForm(POST_FORM_INITIAL_STATE);
    } catch (error) {
      console.error('Failed to submit HackFinder post', error);
      window.alert(error?.message ?? 'Failed to submit HackFinder post. Please try again.');
    } finally {
      setPostSubmitting(false);
    }
  }

  async function handleProfileSubmission(event) {
    event.preventDefault();

    const skills = profileForm.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    const interests = profileForm.interests
      .split(',')
      .map((interest) => interest.trim())
      .filter(Boolean);

    try {
      await updateProfileAccount({
        name: profileForm.name,
        department: profileForm.department,
        year: profileForm.year,
        skills,
        interests,
        contactEmail: profileForm.email
      });

      closeModal();
      window.alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      window.alert(error?.message ?? 'Failed to update profile. Please try again.');
    }
  }

  async function handleLogout() {
    try {
      await logoutAccount();
      if (currentPage === 'admin') {
        setCurrentPage('home');
      }
    } catch (error) {
      console.error('Logout failed', error);
      window.alert(error?.message ?? 'Logout failed. Please try again.');
    }
  }

  async function withModeration(action, successMessage) {
    setModerationLoading(true);
    try {
      await action();
      if (successMessage) {
        window.alert(successMessage);
      }
    } catch (error) {
      console.error('Moderation action failed', error);
      window.alert(error?.message ?? 'Action failed. Please try again.');
    } finally {
      setModerationLoading(false);
    }
  }

  async function handleApproveEvent(eventId) {
    await withModeration(async () => {
      const token = await getToken(true);
      if (!token) {
        throw new Error('Authentication expired. Please sign in again.');
      }
      await approveEventApi({ token, eventId });
      await Promise.all([refreshEvents(), refreshAdminQueues()]);
    }, 'Event approved and published.');
  }

  async function handleRejectEvent(eventId) {
    await withModeration(async () => {
      const token = await getToken(true);
      if (!token) {
        throw new Error('Authentication expired. Please sign in again.');
      }
      await rejectEventApi({ token, eventId });
      await refreshAdminQueues();
    }, 'Event request rejected.');
  }

  async function handleDeleteEvent(eventId) {
    await withModeration(async () => {
      const token = await getToken(true);
      if (!token) {
        throw new Error('Authentication expired. Please sign in again.');
      }
      await deleteEventApi({ token, eventId });
      await Promise.all([refreshEvents(), refreshAdminQueues()]);
    }, 'Event deleted permanently.');
  }

  async function handleApprovePost(postId) {
    await withModeration(async () => {
      const token = await getToken(true);
      if (!token) {
        throw new Error('Authentication expired. Please sign in again.');
      }
      await approveHackFinderPostApi({ token, postId });
      await Promise.all([refreshHackfinderPosts(), refreshAdminQueues()]);
    }, 'HackFinder post approved and published.');
  }

  async function handleRejectPost(postId) {
    await withModeration(async () => {
      const token = await getToken(true);
      if (!token) {
        throw new Error('Authentication expired. Please sign in again.');
      }
      await rejectHackFinderPostApi({ token, postId });
      await refreshAdminQueues();
    }, 'HackFinder post rejected.');
  }

  async function handleDeletePost(postId) {
    await withModeration(async () => {
      const token = await getToken(true);
      if (!token) {
        throw new Error('Authentication expired. Please sign in again.');
      }
      await deleteHackFinderPostApi({ token, postId });
      await Promise.all([refreshHackfinderPosts(), refreshAdminQueues()]);
    }, 'HackFinder post deleted permanently.');
  }

  const roleBadgeLabel = userRole
    ? `${ROLE_LABELS[userRole] ?? 'Member'}${currentProfile.name ? ` • ${currentProfile.name}` : ''}`
    : '';

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h2>EventsHub</h2>
          </div>
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
          <ul className={`nav-links ${isMobileNavOpen ? 'active' : ''}`}>
            <li>
              <button
                type="button"
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavigate('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link ${currentPage === 'events' ? 'active' : ''}`}
                onClick={() => handleNavigate('events')}
              >
                Events
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link ${currentPage === 'hackfinder' ? 'active' : ''}`}
                onClick={() => handleNavigate('hackfinder')}
              >
                HackFinder
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
                onClick={() => handleNavigate('profile')}
              >
                Profile
              </button>
            </li>
            {isAdmin && (
              <li>
                <button
                  type="button"
                  className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
                  onClick={() => handleNavigate('admin')}
                >
                  Admin
                </button>
              </li>
            )}
            <li className="nav-auth">
              {isAuthenticated ? (
                <>
                  <span className="nav-role-badge">{roleBadgeLabel}</span>
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={handleLogout}
                    disabled={authLoading}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => openModal('login')}
                  disabled={authInitializing || authLoading}
                >
                  {authInitializing ? 'Loading…' : 'Login'}
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {dataError?.error && (
        <div className="global-error-banner">
          <strong>Heads up:</strong>
          <span>
            {dataError.error?.code === 'network-error' || dataError.error?.name === 'TypeError'
              ? `We couldn't reach the EventsHub API at ${API_BASE_URL}. Please make sure the backend server is running and refresh the page.`
              : dataError.error?.message ??
                `We couldn't load ${dataError.context ?? 'the latest data'}. Please check that the EventsHub API at ${API_BASE_URL} is running and try again.`}
          </span>
        </div>
      )}

      <div id="home-page" className={`page ${currentPage === 'home' ? 'active' : ''}`}>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>Connect, Create, Collaborate</h1>
              <p>
                Your one-stop platform for college events, hackathon team formation, and academic
                networking.
              </p>
              <div className="hero-buttons">
                <button
                  type="button"
                  className="btn btn--primary btn--lg"
                  onClick={() => handleNavigate('events')}
                >
                  Browse Events
                </button>
                <button
                  type="button"
                  className="btn btn--outline btn--lg"
                  onClick={() => handleNavigate('hackfinder')}
                >
                  Find Teams
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">8</div>
                <div className="stat-label">Upcoming Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">12</div>
                <div className="stat-label">Active Teams</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">247</div>
                <div className="stat-label">Registered Students</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">45</div>
                <div className="stat-label">Successful Connections</div>
              </div>
            </div>
          </div>
        </section>

        <section className="featured-events">
          <div className="container">
            <h2>Featured Events</h2>
            <div className="events-grid" id="featuredEventsGrid">
              {eventsLoading ? (
                <p className="empty-state">Loading featured events…</p>
              ) : featuredEvents.length === 0 ? (
                <p className="empty-state">No featured events yet. Check back soon!</p>
              ) : (
                featuredEvents.map((event) => (
                  <div className="event-card" key={event.id}>
                    <div className="event-card-header">
                      <h3 className="event-card-title">{event.title}</h3>
                      <div className="event-card-meta">
                        <span>📅 {formatDate(event.date)}</span>
                        <span>⏰ {event.time}</span>
                      </div>
                      <span className="event-card-department">{event.department}</span>
                    </div>
                    <div className="event-card-body">
                      <p className="event-card-description">{event.description}</p>
                      <div className="event-card-actions">
                        <a href={event.registrationLink} target="_blank" rel="noreferrer" className="btn btn--primary">
                          Register
                        </a>
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn btn--outline"
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={moderationLoading}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      <div id="events-page" className={`page ${currentPage === 'events' ? 'active' : ''}`}>
        <div className="container">
          <div className="page-header">
            <h1>Events</h1>
            {canSubmitEvent ? (
              <button type="button" className="btn btn--primary" onClick={() => openModal('event')}>
                Create Event
              </button>
            ) : isAuthenticated ? (
              <span className="page-note">Event creation is limited to Admin or Event Head accounts.</span>
            ) : (
              <button type="button" className="btn btn--outline" onClick={() => openModal('login')}>
                Log in to submit an event
              </button>
            )}
          </div>

          <div className="filters">
            <input
              type="text"
              className="form-control"
              placeholder="Search events..."
              value={eventSearch}
              onChange={(event) => setEventSearch(event.target.value)}
            />
            <select
              className="form-control"
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
            >
              <option value="">All Departments</option>
              {appData.departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div className="events-grid" id="eventsGrid">
            {eventsLoading ? (
              <p className="empty-state">Loading events…</p>
            ) : filteredEvents.length === 0 ? (
              <p className="empty-state">No events match your filters yet.</p>
            ) : (
              filteredEvents.map((event) => (
                <div className="event-card" key={event.id}>
                  <div className="event-card-header">
                    <h3 className="event-card-title">{event.title}</h3>
                    <div className="event-card-meta">
                      <span>📅 {formatDate(event.date)}</span>
                      <span>⏰ {event.time}</span>
                    </div>
                    <span className="event-card-department">{event.department}</span>
                  </div>
                  <div className="event-card-body">
                    <p className="event-card-description">{event.description}</p>
                    <div className="event-card-actions">
                      <a href={event.registrationLink} target="_blank" rel="noreferrer" className="btn btn--primary">
                        Register
                      </a>
                      {isAdmin && (
                        <button
                          type="button"
                          className="btn btn--outline"
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={moderationLoading}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div id="hackfinder-page" className={`page ${currentPage === 'hackfinder' ? 'active' : ''}`}>
        <div className="container">
          <div className="page-header">
            <h1>HackFinder</h1>
            {canSubmitPost ? (
              <button type="button" className="btn btn--primary" onClick={() => openModal('post')}>
                Create Post
              </button>
            ) : (
              <button type="button" className="btn btn--outline" onClick={() => openModal('login')}>
                Log in to create a post
              </button>
            )}
          </div>

          <div className="hackfinder-tabs">
            <button
              type="button"
              className={`tab-btn ${hackfinderTab === 'teams' ? 'active' : ''}`}
              onClick={() => setHackfinderTab('teams')}
            >
              Looking for Members
            </button>
            <button
              type="button"
              className={`tab-btn ${hackfinderTab === 'individuals' ? 'active' : ''}`}
              onClick={() => setHackfinderTab('individuals')}
            >
              Looking for Teams
            </button>
          </div>

          <div className="tab-content">
            <div id="teams-tab" className={`tab-pane ${hackfinderTab === 'teams' ? 'active' : ''}`}>
              <div className="posts-grid" id="teamsGrid">
                {hackfinderLoading ? (
                  <p className="empty-state">Loading posts…</p>
                ) : teamsPosts.length === 0 ? (
                  <p className="empty-state">No teams are recruiting right now.</p>
                ) : (
                  teamsPosts.map((post) => (
                    <div className="post-card" key={post.id}>
                      <div className="post-card-header">
                        <div>
                          <h3 className="post-card-title">{post.title}</h3>
                          <span className="post-card-type">Team</span>
                        </div>
                      </div>
                      <p className="post-card-description">{post.description}</p>
                      <div className="post-card-skills">
                        {(post.skills ?? []).map((skill) => (
                          <span key={skill} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="post-card-footer">
                        <div className="post-card-author">
                          <strong>{post.author}</strong>
                          <br />
                          {post.department}
                          {post.teamSize ? (
                            <>
                              <br />
                              Team: {post.teamSize}
                            </>
                          ) : null}
                        </div>
                        <div className="post-card-actions">
                          <a href={`mailto:${post.contact}`} className="post-card-contact">
                            {post.contact}
                          </a>
                          {isAdmin && (
                            <button
                              type="button"
                              className="btn btn--outline btn--sm"
                              onClick={() => handleDeletePost(post.id)}
                              disabled={moderationLoading}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div id="individuals-tab" className={`tab-pane ${hackfinderTab === 'individuals' ? 'active' : ''}`}>
              <div className="posts-grid" id="individualsGrid">
                {hackfinderLoading ? (
                  <p className="empty-state">Loading posts…</p>
                ) : individualPosts.length === 0 ? (
                  <p className="empty-state">No individual posts available yet.</p>
                ) : (
                  individualPosts.map((post) => (
                    <div className="post-card" key={post.id}>
                      <div className="post-card-header">
                        <div>
                          <h3 className="post-card-title">{post.title}</h3>
                          <span className="post-card-type">Individual</span>
                        </div>
                      </div>
                      <p className="post-card-description">{post.description}</p>
                      <div className="post-card-skills">
                        {(post.skills ?? []).map((skill) => (
                          <span key={skill} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="post-card-footer">
                        <div className="post-card-author">
                          <strong>{post.author}</strong>
                          <br />
                          {post.department}
                        </div>
                        <div className="post-card-actions">
                          <a href={`mailto:${post.contact}`} className="post-card-contact">
                            {post.contact}
                          </a>
                          {isAdmin && (
                            <button
                              type="button"
                              className="btn btn--outline btn--sm"
                              onClick={() => handleDeletePost(post.id)}
                              disabled={moderationLoading}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

        {isAdmin && (
          <div id="admin-page" className={`page ${currentPage === 'admin' ? 'active' : ''}`}>
            <div className="container">
              <div className="page-header">
                <h1>Admin Dashboard</h1>
                <span className="page-note">Review pending submissions and manage approvals.</span>
              </div>

              <section className="admin-section">
                <div className="admin-section-header">
                  <h2>Pending Events</h2>
                  <span className="admin-count">{sortedPendingEvents.length}</span>
                </div>
                {queuesLoading ? (
                  <p className="empty-state">Loading pending event submissions…</p>
                ) : sortedPendingEvents.length === 0 ? (
                  <p className="empty-state">No pending event submissions at the moment.</p>
                ) : (
                  <div className="admin-grid">
                    {sortedPendingEvents.map((pendingEvent) => (
                      <div className="admin-card" key={pendingEvent.id}>
                        <div className="admin-card-body">
                          <div className="admin-card-header">
                            <div>
                              <h3>{pendingEvent.title}</h3>
                              <p className="admin-card-meta">
                                📅 {formatDate(pendingEvent.date)} • ⏰ {pendingEvent.time}
                              </p>
                            </div>
                            <span className="admin-badge">{pendingEvent.department}</span>
                          </div>
                          <p className="admin-card-description">{pendingEvent.description}</p>
                          <dl className="admin-details">
                            <div>
                              <dt>Submitted by</dt>
                              <dd>
                                {pendingEvent.submittedBy?.name || 'Unknown'}
                                {pendingEvent.submittedBy?.role
                                  ? ` (${ROLE_LABELS[pendingEvent.submittedBy.role] ?? pendingEvent.submittedBy.role})`
                                  : ''}
                              </dd>
                            </div>
                            <div>
                              <dt>Submitted on</dt>
                              <dd>{formatDateTime(pendingEvent.submittedAt)}</dd>
                            </div>
                            <div>
                              <dt>Contact</dt>
                              <dd>{pendingEvent.submittedBy?.email || 'Not provided'}</dd>
                            </div>
                          </dl>
                          <div className="admin-card-actions">
                            <button
                              type="button"
                              className="btn btn--primary btn--sm"
                              onClick={() => handleApproveEvent(pendingEvent.id)}
                              disabled={moderationLoading}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn--outline btn--sm"
                              onClick={() => handleRejectEvent(pendingEvent.id)}
                              disabled={moderationLoading}
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              className="btn btn--outline btn--sm"
                              onClick={() => handleDeleteEvent(pendingEvent.id)}
                              disabled={moderationLoading}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="admin-section">
                <div className="admin-section-header">
                  <h2>Pending HackFinder Posts</h2>
                  <span className="admin-count">{sortedPendingPosts.length}</span>
                </div>
                {queuesLoading ? (
                  <p className="empty-state">Loading pending HackFinder submissions…</p>
                ) : sortedPendingPosts.length === 0 ? (
                  <p className="empty-state">No pending HackFinder submissions right now.</p>
                ) : (
                  <div className="admin-grid">
                    {sortedPendingPosts.map((pendingPost) => (
                      <div className="admin-card" key={pendingPost.id}>
                        <div className="admin-card-body">
                          <div className="admin-card-header">
                            <div>
                              <h3>{pendingPost.title}</h3>
                              <span className="admin-card-meta">
                                {pendingPost.type === 'team' ? 'Team looking for members' : 'Individual seeking team'}
                              </span>
                            </div>
                            <span className="admin-badge">{pendingPost.department}</span>
                          </div>
                          <p className="admin-card-description">{pendingPost.description}</p>
                          {pendingPost.skills?.length ? (
                            <div className="admin-skills">
                              {pendingPost.skills.map((skill) => (
                                <span key={skill} className="skill-tag">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : null}
                          <dl className="admin-details">
                            <div>
                              <dt>Submitted by</dt>
                              <dd>
                                {pendingPost.submittedBy?.name || 'Unknown'}
                                {pendingPost.submittedBy?.role
                                  ? ` (${ROLE_LABELS[pendingPost.submittedBy.role] ?? pendingPost.submittedBy.role})`
                                  : ''}
                              </dd>
                            </div>
                            <div>
                              <dt>Submitted on</dt>
                              <dd>{formatDateTime(pendingPost.submittedAt)}</dd>
                            </div>
                            <div>
                              <dt>Contact</dt>
                              <dd>{pendingPost.contact}</dd>
                            </div>
                          </dl>
                          <div className="admin-card-actions">
                            <button
                              type="button"
                              className="btn btn--primary btn--sm"
                              onClick={() => handleApprovePost(pendingPost.id)}
                              disabled={moderationLoading}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn--outline btn--sm"
                              onClick={() => handleRejectPost(pendingPost.id)}
                              disabled={moderationLoading}
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              className="btn btn--outline btn--sm"
                              onClick={() => handleDeletePost(pendingPost.id)}
                              disabled={moderationLoading}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

      <div id="profile-page" className={`page ${currentPage === 'profile' ? 'active' : ''}`}>
        <div className="container">
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-avatar">
                <div className="avatar-placeholder">👤</div>
              </div>
              <div className="profile-info">
                <h1 id="profileName">{currentProfile.name || 'Your Name'}</h1>
                <p id="profileDepartment">
                  {currentProfile.department || 'Department not set'}
                  {currentProfile.year ? ` • ${currentProfile.year}` : ''}
                </p>
                <button type="button" className="btn btn--outline" onClick={() => openModal('profile')}>
                  {isAuthenticated ? 'Edit Profile' : 'Log in to edit'}
                </button>
              </div>
            </div>

            <div className="profile-sections">
              <div className="profile-section">
                <h3>Skills</h3>
                <div className="skills-list" id="profileSkills">
                  {currentProfile.skills?.length ? (
                    currentProfile.skills.map((skill) => (
                      <span key={skill} className="skill-badge">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="empty-state">Add your skills to let others know your strengths.</p>
                  )}
                </div>
              </div>

              <div className="profile-section">
                <h3>Interests</h3>
                <div className="interests-list" id="profileInterests">
                  {currentProfile.interests?.length ? (
                    currentProfile.interests.map((interest) => (
                      <span key={interest} className="interest-badge">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="empty-state">Share what you’re curious about.</p>
                  )}
                </div>
              </div>

              <div className="profile-section">
                <h3>Registered Events</h3>
                <div className="registered-events" id="profileEvents">
                  {registeredEvents.length ? (
                    registeredEvents.map((event) => (
                      <div key={event.id} className="registered-event">
                        <div className="registered-event-title">{event.title}</div>
                        <div className="registered-event-date">
                          {formatDate(event.date)} • {event.time}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="empty-state">No event registrations yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal title="Create Event" isOpen={activeModal === 'event'} onClose={closeModal}>
        <form onSubmit={handleEventSubmission}>
          <div className="form-group">
            <label className="form-label" htmlFor="eventTitle">
              Event Title
            </label>
            <input
              id="eventTitle"
              type="text"
              className="form-control"
              name="title"
              value={eventForm.title}
              onChange={handleEventFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="eventDate">
              Date
            </label>
            <input
              id="eventDate"
              type="date"
              className="form-control"
              name="date"
              value={eventForm.date}
              onChange={handleEventFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="eventTime">
              Time
            </label>
            <input
              id="eventTime"
              type="time"
              className="form-control"
              name="time"
              value={eventForm.time}
              onChange={handleEventFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="eventDepartment">
              Department/Club
            </label>
            <select
              id="eventDepartment"
              className="form-control"
              name="department"
              value={eventForm.department}
              onChange={handleEventFormChange}
              required
            >
              <option value="">Select Department</option>
              {appData.departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="eventDescription">
              Description
            </label>
            <textarea
              id="eventDescription"
              className="form-control"
              name="description"
              rows={4}
              value={eventForm.description}
              onChange={handleEventFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="eventLink">
              Registration Link
            </label>
            <input
              id="eventLink"
              type="url"
              className="form-control"
              name="registrationLink"
              value={eventForm.registrationLink}
              onChange={handleEventFormChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn--outline" onClick={closeModal}>
              Cancel
            </button>
                       <button type="submit" className="btn btn--primary" disabled={eventSubmitting}>
                         {eventSubmitting ? 'Submitting…' : 'Create Event'}
                       </button>
          </div>
        </form>
      </Modal>

      <Modal title="Create Post" isOpen={activeModal === 'post'} onClose={closeModal}>
        <form onSubmit={handlePostSubmission}>
          <div className="form-group">
            <label className="form-label" htmlFor="postType">
              Post Type
            </label>
            <select
              id="postType"
              className="form-control"
              name="type"
              value={postForm.type}
              onChange={handlePostFormChange}
              required
            >
              <option value="">Select Type</option>
              <option value="team">Looking for Team Members</option>
              <option value="individual">Looking for a Team</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="postTitle">
              Title
            </label>
            <input
              id="postTitle"
              type="text"
              className="form-control"
              name="title"
              value={postForm.title}
              onChange={handlePostFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="postDescription">
              Description
            </label>
            <textarea
              id="postDescription"
              className="form-control"
              name="description"
              rows={4}
              value={postForm.description}
              onChange={handlePostFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="postSkills">
              Skills
            </label>
            <input
              id="postSkills"
              type="text"
              className="form-control"
              name="skills"
              placeholder="React, Python, UI/UX (comma separated)"
              value={postForm.skills}
              onChange={handlePostFormChange}
              required
            />
          </div>
          {postForm.type === 'team' && (
            <div className="form-group">
              <label className="form-label" htmlFor="postTeamSize">
                Current Team Size
              </label>
              <input
                id="postTeamSize"
                type="text"
                className="form-control"
                name="teamSize"
                placeholder="e.g., 3/6"
                value={postForm.teamSize}
                onChange={handlePostFormChange}
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="postContact">
              Contact Email
            </label>
            <input
              id="postContact"
              type="email"
              className="form-control"
              name="contact"
              value={postForm.contact}
              onChange={handlePostFormChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn--outline" onClick={closeModal}>
              Cancel
            </button>
                       <button type="submit" className="btn btn--primary" disabled={postSubmitting}>
                         {postSubmitting ? 'Submitting…' : 'Create Post'}
                       </button>
          </div>
        </form>
      </Modal>

      <Modal title="Edit Profile" isOpen={activeModal === 'profile'} onClose={closeModal}>
        <form onSubmit={handleProfileSubmission}>
          <div className="form-group">
            <label className="form-label" htmlFor="profileNameInput">
              Name
            </label>
            <input
              id="profileNameInput"
              type="text"
              className="form-control"
              name="name"
              value={profileForm.name}
              onChange={handleProfileFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profileEmailInput">
              Email
            </label>
            <input
              id="profileEmailInput"
              type="email"
              className="form-control"
              name="email"
              value={profileForm.email}
              onChange={handleProfileFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profileDepartmentInput">
              Department
            </label>
            <select
              id="profileDepartmentInput"
              className="form-control"
              name="department"
              value={profileForm.department}
              onChange={handleProfileFormChange}
              required
            >
              <option value="">Select Department</option>
              {appData.departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profileYearInput">
              Year
            </label>
            <select
              id="profileYearInput"
              className="form-control"
              name="year"
              value={profileForm.year}
              onChange={handleProfileFormChange}
              required
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profileSkillsInput">
              Skills
            </label>
            <input
              id="profileSkillsInput"
              type="text"
              className="form-control"
              name="skills"
              placeholder="Python, React, UI/UX (comma separated)"
              value={profileForm.skills}
              onChange={handleProfileFormChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profileInterestsInput">
              Interests
            </label>
            <input
              id="profileInterestsInput"
              type="text"
              className="form-control"
              name="interests"
              placeholder="AI, Web Development (comma separated)"
              value={profileForm.interests}
              onChange={handleProfileFormChange}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn--outline" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Save Profile
            </button>
          </div>
        </form>
      </Modal>

      <Modal title="Sign in to EventsHub" isOpen={activeModal === 'login'} onClose={closeModal}>
        <div className="auth-provider-buttons">
          <button
            type="button"
            className="btn btn--google btn--full-width"
            onClick={handleGoogleSignIn}
            disabled={authLoading || authInitializing}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                fill="#EA4335"
                d="M17.64 9.2045c0-.638-.0573-1.2527-.1636-1.8427H9v3.4818h4.8436c-.2091 1.125-.8436 2.0795-1.8 2.7177v2.2582h2.9082c1.7018-1.5664 2.6882-3.8746 2.6882-6.6149z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.4673-.8064 5.9564-2.1805l-2.9082-2.2582c-.8064.54-1.8437.8573-3.0482.8573-2.3445 0-4.3309-1.5823-5.0373-3.716h-3.01v2.331c1.4773 2.9418 4.5027 4.9664 8.0473 4.9664z"
              />
              <path
                fill="#FBBC05"
                d="M3.9627 10.7027c-.1827-.54-.2864-1.1164-.2864-1.7027 0-.5864.1037-1.1627.2864-1.7027v-2.331h-3.01C.3291 6.4227 0 7.6736 0 9s.3291 2.5773.9527 3.7345l3.01-2.3318z"
              />
              <path
                fill="#4285F4"
                d="M9 3.5795c1.3209 0 2.5073.4545 3.4405 1.3455l2.5818-2.5818C13.4646.8918 11.4273 0 9 0 5.4555 0 2.4309 2.0245.9527 4.9655l3.01 2.331c.7064-2.1336 2.6928-3.717 5.0373-3.717z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {(authMessage || authError) && (
          <p className="form-error">{authMessage || getAuthErrorMessage(authError, 'login')}</p>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn--outline btn--full-width" onClick={closeModal}>
            Cancel
          </button>
        </div>

        <p className="form-note">
          Continue with Google to create or access your EventsHub profile. Make sure pop-ups are
          allowed and that the EventsHub API at {API_BASE_URL} is running.
        </p>
      </Modal>
    </div>
  );
}
