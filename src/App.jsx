import { useEffect, useMemo, useState } from 'react';
import { initialData } from './data';
import { formatDate, generateId } from './utils';
import Modal from './components/Modal';

const LOCAL_STORAGE_KEY = 'collegeEventsData';
const AUTH_STORAGE_KEY = 'collegeEventsAuth';
const ADMIN_PASSWORD = 'ThisAppleIsMajor';
const ROLES = {
  ADMIN: 'admin',
  EVENT_HEAD: 'eventHead',
  USER: 'user'
};

const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.EVENT_HEAD]: 'Event Head',
  [ROLES.USER]: 'Student'
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

const LOGIN_FORM_INITIAL_STATE = {
  role: '',
  name: '',
  email: '',
  password: ''
};

const AUTH_STATE_INITIAL = {
  role: null,
  name: '',
  email: ''
};

function normalizeAppData(data) {
  return {
    ...data,
    pendingEvents: Array.isArray(data.pendingEvents) ? data.pendingEvents : [],
    pendingHackfinderPosts: Array.isArray(data.pendingHackfinderPosts)
      ? data.pendingHackfinderPosts
      : []
  };
}

export default function App() {
  const [appData, setAppData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return normalizeAppData({
            ...initialData,
            ...parsed,
            currentUser: {
              ...initialData.currentUser,
              ...(parsed.currentUser ?? {})
            }
          });
        } catch (error) {
          console.error('Failed to parse saved app data:', error);
        }
      }
    }
    return normalizeAppData(initialData);
  });

  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [eventSearch, setEventSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [hackfinderTab, setHackfinderTab] = useState('teams');
  const [eventForm, setEventForm] = useState(EVENT_FORM_INITIAL_STATE);
  const [postForm, setPostForm] = useState(POST_FORM_INITIAL_STATE);
  const [profileForm, setProfileForm] = useState(PROFILE_FORM_INITIAL_STATE);
  const [loginForm, setLoginForm] = useState(LOGIN_FORM_INITIAL_STATE);
  const [authState, setAuthState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...AUTH_STATE_INITIAL,
            ...parsed
          };
        } catch (error) {
          console.error('Failed to parse auth state:', error);
        }
      }
    }
    return AUTH_STATE_INITIAL;
  });
  const [loginError, setLoginError] = useState('');

  const isAdmin = authState.role === ROLES.ADMIN;
  const isEventHead = authState.role === ROLES.EVENT_HEAD;
  const isUserRole = authState.role === ROLES.USER;

  const canSubmitEvent = isAdmin || isEventHead;
  const canSubmitPost = isAdmin || isEventHead || isUserRole;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
    }
  }, [appData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    }
  }, [authState]);

  useEffect(() => {
    setProfileForm(mapProfileToForm(appData.currentUser));
  }, [appData.currentUser]);

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
    const registeredIds = new Set(appData.currentUser.eventsRegistered);
    return appData.events.filter((event) => registeredIds.has(event.id));
  }, [appData.currentUser.eventsRegistered, appData.events]);

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
    return {
      name: profile.name ?? '',
      email: profile.email ?? '',
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
      setProfileForm(mapProfileToForm(appData.currentUser));
    }

    if (modalName === 'login') {
      setLoginForm(LOGIN_FORM_INITIAL_STATE);
      setLoginError('');
    }

    setActiveModal(modalName);
  }

  function closeModal() {
    setActiveModal(null);
  }

  function handleEventFormChange(event) {
    const { name, value } = event.target;
    setEventForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePostFormChange(event) {
    const { name, value } = event.target;
    setPostForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleProfileFormChange(event) {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleLoginFormChange(event) {
    const { name, value } = event.target;
    setLoginForm((prev) => {
      if (name === 'role') {
        return {
          ...LOGIN_FORM_INITIAL_STATE,
          role: value
        };
      }

      return { ...prev, [name]: value };
    });
    setLoginError('');
  }

  function handleEventSubmission(event) {
    event.preventDefault();
    if (!canSubmitEvent) {
      window.alert('Only Admin or Event Head accounts can submit events.');
      return;
    }

    const eventId = generateId(
      appData.events,
      appData.hackfinderPosts,
      appData.pendingEvents,
      appData.pendingHackfinderPosts
    );

    const baseEvent = {
      id: eventId,
      title: eventForm.title,
      date: eventForm.date,
      time: eventForm.time,
      department: eventForm.department,
      description: eventForm.description,
      registrationLink: eventForm.registrationLink,
      featured: false
    };

    if (isAdmin) {
      setAppData((prev) => ({
        ...prev,
        events: [...prev.events, baseEvent]
      }));

      closeModal();
      window.alert('Event published successfully!');
      return;
    }

    const pendingEvent = {
      ...baseEvent,
      submittedAt: new Date().toISOString(),
      submittedByRole: authState.role,
      submittedByName: authState.name || appData.currentUser.name,
      submittedByEmail: authState.email || appData.currentUser.email
    };

    setAppData((prev) => ({
      ...prev,
      pendingEvents: [...prev.pendingEvents, pendingEvent]
    }));

    closeModal();
    window.alert('Event submitted for admin approval.');
  }

  function handlePostSubmission(event) {
    event.preventDefault();

    const skills = postForm.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
    if (!canSubmitPost) {
      window.alert('Please log in to submit HackFinder posts.');
      return;
    }

    const postId = generateId(
      appData.events,
      appData.hackfinderPosts,
      appData.pendingEvents,
      appData.pendingHackfinderPosts
    );

    const basePost = {
      id: postId,
      type: postForm.type,
      title: postForm.title,
      description: postForm.description,
      skills,
      contact: postForm.contact,
      author: appData.currentUser.name,
      department: appData.currentUser.department
    };

    if (postForm.type === 'team' && postForm.teamSize) {
      basePost.teamSize = postForm.teamSize;
    }

    if (isAdmin) {
      const publishedPost = {
        ...basePost,
        posted: new Date().toISOString().split('T')[0]
      };

      setAppData((prev) => ({
        ...prev,
        hackfinderPosts: [...prev.hackfinderPosts, publishedPost]
      }));

      closeModal();
      window.alert('Post published successfully!');
      return;
    }

    const pendingPost = {
      ...basePost,
      submittedAt: new Date().toISOString(),
      submittedByRole: authState.role,
      submittedByName: authState.name || appData.currentUser.name,
      submittedByEmail: authState.email || appData.currentUser.email
    };

    setAppData((prev) => ({
      ...prev,
      pendingHackfinderPosts: [...prev.pendingHackfinderPosts, pendingPost]
    }));

    closeModal();
    window.alert('Post submitted for admin approval.');
  }

  function handleProfileSubmission(event) {
    event.preventDefault();

    const skills = profileForm.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    const interests = profileForm.interests
      .split(',')
      .map((interest) => interest.trim())
      .filter(Boolean);

    setAppData((prev) => ({
      ...prev,
      currentUser: {
        ...prev.currentUser,
        name: profileForm.name,
        email: profileForm.email,
        department: profileForm.department,
        year: profileForm.year,
        skills,
        interests
      }
    }));

    closeModal();
    window.alert('Profile updated successfully!');
  }

  function handleLoginSubmission(event) {
    event.preventDefault();
    if (!loginForm.role) {
      setLoginError('Please select a role to continue.');
      return;
    }

    if (loginForm.role === ROLES.ADMIN) {
      if (loginForm.password !== ADMIN_PASSWORD) {
        setLoginError('Incorrect admin password.');
        return;
      }

      setAuthState({
        role: ROLES.ADMIN,
        name: 'Admin',
        email: ''
      });

      setLoginForm(LOGIN_FORM_INITIAL_STATE);
      closeModal();
      window.alert('Logged in as Admin.');
      return;
    }

    if (!loginForm.name.trim()) {
      setLoginError('Please enter your name.');
      return;
    }

    setAuthState({
      role: loginForm.role,
      name: loginForm.name.trim(),
      email: loginForm.email.trim()
    });

    setLoginForm(LOGIN_FORM_INITIAL_STATE);
    closeModal();
    window.alert('Login successful!');
  }

  function handleLogout() {
    setAuthState(AUTH_STATE_INITIAL);
    if (currentPage === 'admin') {
      setCurrentPage('home');
    }
    window.alert('Logged out successfully.');
  }

  function sanitizePendingItem(item) {
    const cleaned = { ...item };
    delete cleaned.submittedAt;
    delete cleaned.submittedByRole;
    delete cleaned.submittedByName;
    delete cleaned.submittedByEmail;
    return cleaned;
  }

  function handleApproveEvent(eventId) {
    let approved = false;
    setAppData((prev) => {
      const pendingEvent = prev.pendingEvents.find((item) => item.id === eventId);
      if (!pendingEvent) {
        return prev;
      }

      approved = true;
      const nextPending = prev.pendingEvents.filter((item) => item.id !== eventId);
      const publishedEvent = sanitizePendingItem(pendingEvent);

      return {
        ...prev,
        events: [...prev.events, publishedEvent],
        pendingEvents: nextPending
      };
    });

    if (approved) {
      window.alert('Event approved and published.');
    }
  }

  function handleRejectEvent(eventId) {
    let removed = false;
    setAppData((prev) => {
      if (!prev.pendingEvents.some((item) => item.id === eventId)) {
        return prev;
      }

      removed = true;
      return {
        ...prev,
        pendingEvents: prev.pendingEvents.filter((item) => item.id !== eventId)
      };
    });

    if (removed) {
      window.alert('Event request rejected.');
    }
  }

  function handleApprovePost(postId) {
    let approved = false;
    setAppData((prev) => {
      const pendingPost = prev.pendingHackfinderPosts.find((item) => item.id === postId);
      if (!pendingPost) {
        return prev;
      }

      approved = true;
      const nextPending = prev.pendingHackfinderPosts.filter((item) => item.id !== postId);
      const publishedPost = {
        ...sanitizePendingItem(pendingPost),
        posted: new Date().toISOString().split('T')[0]
      };

      return {
        ...prev,
        hackfinderPosts: [...prev.hackfinderPosts, publishedPost],
        pendingHackfinderPosts: nextPending
      };
    });

    if (approved) {
      window.alert('HackFinder post approved and published.');
    }
  }

  function handleRejectPost(postId) {
    let removed = false;
    setAppData((prev) => {
      if (!prev.pendingHackfinderPosts.some((item) => item.id === postId)) {
        return prev;
      }

      removed = true;
      return {
        ...prev,
        pendingHackfinderPosts: prev.pendingHackfinderPosts.filter((item) => item.id !== postId)
      };
    });

    if (removed) {
      window.alert('HackFinder post rejected.');
    }
  }

  const roleBadgeLabel = authState.role
    ? `${ROLE_LABELS[authState.role]}${authState.name ? ` • ${authState.name}` : ''}`
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
              {authState.role ? (
                <>
                  <span className="nav-role-badge">{roleBadgeLabel}</span>
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => openModal('login')}
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>

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
              {featuredEvents.map((event) => (
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
                    </div>
                  </div>
                </div>
              ))}
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
            ) : authState.role ? (
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
            {filteredEvents.map((event) => (
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
                  </div>
                </div>
              </div>
            ))}
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
                {teamsPosts.map((post) => (
                  <div className="post-card" key={post.id}>
                    <div className="post-card-header">
                      <div>
                        <h3 className="post-card-title">{post.title}</h3>
                        <span className="post-card-type">Team</span>
                      </div>
                    </div>
                    <p className="post-card-description">{post.description}</p>
                    <div className="post-card-skills">
                      {post.skills.map((skill) => (
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
                      <a href={`mailto:${post.contact}`} className="post-card-contact">
                        {post.contact}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="individuals-tab" className={`tab-pane ${hackfinderTab === 'individuals' ? 'active' : ''}`}>
              <div className="posts-grid" id="individualsGrid">
                {individualPosts.map((post) => (
                  <div className="post-card" key={post.id}>
                    <div className="post-card-header">
                      <div>
                        <h3 className="post-card-title">{post.title}</h3>
                        <span className="post-card-type">Individual</span>
                      </div>
                    </div>
                    <p className="post-card-description">{post.description}</p>
                    <div className="post-card-skills">
                      {post.skills.map((skill) => (
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
                      <a href={`mailto:${post.contact}`} className="post-card-contact">
                        {post.contact}
                      </a>
                    </div>
                  </div>
                ))}
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
                {sortedPendingEvents.length === 0 ? (
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
                                {pendingEvent.submittedByName || 'Unknown'}
                                {pendingEvent.submittedByRole
                                  ? ` (${ROLE_LABELS[pendingEvent.submittedByRole] ?? pendingEvent.submittedByRole})`
                                  : ''}
                              </dd>
                            </div>
                            <div>
                              <dt>Submitted on</dt>
                              <dd>{formatDateTime(pendingEvent.submittedAt)}</dd>
                            </div>
                            <div>
                              <dt>Contact</dt>
                              <dd>{pendingEvent.submittedByEmail || 'Not provided'}</dd>
                            </div>
                          </dl>
                          <div className="admin-card-actions">
                            <button
                              type="button"
                              className="btn btn--primary btn--sm"
                              onClick={() => handleApproveEvent(pendingEvent.id)}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn--outline btn--sm"
                              onClick={() => handleRejectEvent(pendingEvent.id)}
                            >
                              Reject
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
                {sortedPendingPosts.length === 0 ? (
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
                                {pendingPost.submittedByName || 'Unknown'}
                                {pendingPost.submittedByRole
                                  ? ` (${ROLE_LABELS[pendingPost.submittedByRole] ?? pendingPost.submittedByRole})`
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
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn--outline btn--sm"
                              onClick={() => handleRejectPost(pendingPost.id)}
                            >
                              Reject
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
                <h1 id="profileName">{appData.currentUser.name}</h1>
                <p id="profileDepartment">
                  {appData.currentUser.department} • {appData.currentUser.year}
                </p>
                <button type="button" className="btn btn--outline" onClick={() => openModal('profile')}>
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="profile-sections">
              <div className="profile-section">
                <h3>Skills</h3>
                <div className="skills-list" id="profileSkills">
                  {appData.currentUser.skills.map((skill) => (
                    <span key={skill} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="profile-section">
                <h3>Interests</h3>
                <div className="interests-list" id="profileInterests">
                  {appData.currentUser.interests.map((interest) => (
                    <span key={interest} className="interest-badge">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="profile-section">
                <h3>Registered Events</h3>
                <div className="registered-events" id="profileEvents">
                  {registeredEvents.map((event) => (
                    <div key={event.id} className="registered-event">
                      <div className="registered-event-title">{event.title}</div>
                      <div className="registered-event-date">
                        {formatDate(event.date)} • {event.time}
                      </div>
                    </div>
                  ))}
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
            <button type="submit" className="btn btn--primary">
              Create Event
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
            <button type="submit" className="btn btn--primary">
              Create Post
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

      <Modal title="Account Login" isOpen={activeModal === 'login'} onClose={closeModal}>
        <form onSubmit={handleLoginSubmission}>
          <div className="form-group">
            <label className="form-label" htmlFor="loginRole">
              Role
            </label>
            <select
              id="loginRole"
              className="form-control"
              name="role"
              value={loginForm.role}
              onChange={handleLoginFormChange}
              required
            >
              <option value="">Select role</option>
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.EVENT_HEAD}>Event Head</option>
              <option value={ROLES.USER}>Student</option>
            </select>
          </div>

          {loginForm.role && loginForm.role !== ROLES.ADMIN && (
            <div className="form-group">
              <label className="form-label" htmlFor="loginName">
                Name
              </label>
              <input
                id="loginName"
                type="text"
                className="form-control"
                name="name"
                value={loginForm.name}
                onChange={handleLoginFormChange}
                required
              />
            </div>
          )}

          {loginForm.role && loginForm.role !== ROLES.ADMIN && (
            <div className="form-group">
              <label className="form-label" htmlFor="loginEmail">
                Email (optional)
              </label>
              <input
                id="loginEmail"
                type="email"
                className="form-control"
                name="email"
                value={loginForm.email}
                onChange={handleLoginFormChange}
                placeholder="you@example.com"
              />
            </div>
          )}

          {loginForm.role === ROLES.ADMIN && (
            <div className="form-group">
              <label className="form-label" htmlFor="loginPassword">
                Admin Password
              </label>
              <input
                id="loginPassword"
                type="password"
                className="form-control"
                name="password"
                value={loginForm.password}
                onChange={handleLoginFormChange}
                required
              />
            </div>
          )}

          {loginError && <p className="form-error">{loginError}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn--outline" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Login
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
