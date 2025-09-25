// Application Data
const initialData = {
  events: [
    {
      id: 1,
      title: "Annual Tech Symposium 2025",
      date: "2025-10-15",
      time: "09:00 AM",
      department: "Computer Science",
      description: "A comprehensive technical symposium featuring latest trends in AI, blockchain, and cloud computing with industry experts.",
      registrationLink: "https://forms.google.com/techsymp2025",
      featured: true
    },
    {
      id: 2,
      title: "Cultural Fest - Rangmanch",
      date: "2025-11-05",
      time: "04:00 PM",
      department: "Cultural Club",
      description: "Three-day cultural extravaganza with dance, music, drama, and art competitions from colleges across the region.",
      registrationLink: "https://forms.google.com/rangmanch2025",
      featured: true
    },
    {
      id: 3,
      title: "Machine Learning Workshop",
      date: "2025-10-28",
      time: "02:00 PM",
      department: "AI Society",
      description: "Hands-on workshop covering neural networks, deep learning frameworks, and practical implementation projects.",
      registrationLink: "https://forms.google.com/mlworkshop",
      featured: false
    },
    {
      id: 4,
      title: "Entrepreneurship Summit",
      date: "2025-11-12",
      time: "10:00 AM",
      department: "Business Club",
      description: "Meet successful entrepreneurs, pitch your startup ideas, and learn about funding opportunities and business strategies.",
      registrationLink: "https://forms.google.com/entrepreneur2025",
      featured: false
    },
    {
      id: 5,
      title: "Robotics Competition",
      date: "2025-10-30",
      time: "11:00 AM",
      department: "Robotics Club",
      description: "Inter-college robotics challenge with line-following, obstacle course, and autonomous navigation categories.",
      registrationLink: "https://forms.google.com/robotics2025",
      featured: false
    },
    {
      id: 6,
      title: "Photography Exhibition",
      date: "2025-11-08",
      time: "12:00 PM",
      department: "Photography Club",
      description: "Annual photography showcase featuring student works across various themes - nature, portrait, street, and abstract photography.",
      registrationLink: "https://forms.google.com/photoexhibit",
      featured: false
    },
    {
      id: 7,
      title: "Debate Championship",
      date: "2025-11-20",
      time: "03:00 PM",
      department: "Literary Society",
      description: "Inter-collegiate debate championship covering contemporary topics in politics, technology, and social issues.",
      registrationLink: "https://forms.google.com/debate2025",
      featured: false
    },
    {
      id: 8,
      title: "Hackathon 2025",
      date: "2025-12-01",
      time: "09:00 AM",
      department: "Computer Science",
      description: "48-hour coding marathon focusing on sustainable technology solutions with prizes worth â‚¹50,000.",
      registrationLink: "https://forms.google.com/hackathon2025",
      featured: true
    }
  ],
  hackfinderPosts: [
    {
      id: 1,
      type: "team",
      title: "AI-Powered Healthcare App",
      description: "Building an AI diagnostic tool for rural healthcare. Looking for 2 developers with React/Python experience and 1 UI/UX designer.",
      skills: ["React", "Python", "Machine Learning", "UI/UX"],
      teamSize: "4/6",
      contact: "healthcare.team@email.com",
      author: "Priya Sharma",
      department: "Computer Science",
      posted: "2025-09-20"
    },
    {
      id: 2,
      type: "individual",
      title: "Full-Stack Developer Seeking Team",
      description: "Experienced in MERN stack, looking to join a team working on fintech or edtech solutions. Available for hackathons and competitions.",
      skills: ["MongoDB", "Express", "React", "Node.js", "AWS"],
      contact: "rohit.dev@email.com",
      author: "Rohit Kumar",
      department: "Information Technology",
      posted: "2025-09-18"
    },
    {
      id: 3,
      type: "team",
      title: "Sustainable Tech Solutions",
      description: "Environmental impact tracking app team needs mobile developer and data scientist to complete our green-tech project.",
      skills: ["Flutter", "Data Science", "Environmental Science"],
      teamSize: "3/5",
      contact: "greentech.team@email.com",
      author: "Ananya Gupta",
      department: "Environmental Engineering",
      posted: "2025-09-22"
    },
    {
      id: 4,
      type: "individual",
      title: "UI/UX Designer Available",
      description: "Passionate about user-centered design with 2 years experience. Looking for innovative projects in social impact or education technology.",
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
      contact: "design.portfolio@email.com",
      author: "Sneha Patel",
      department: "Design",
      posted: "2025-09-19"
    },
    {
      id: 5,
      type: "team",
      title: "Blockchain Voting System",
      description: "Developing secure digital voting platform using blockchain. Need blockchain developer and cybersecurity expert.",
      skills: ["Blockchain", "Solidity", "Cybersecurity", "Web3"],
      teamSize: "4/6",
      contact: "blockchain.vote@email.com",
      author: "Arjun Singh",
      department: "Computer Science",
      posted: "2025-09-21"
    },
    {
      id: 6,
      type: "individual",
      title: "Data Scientist Looking for Team",
      description: "Machine learning enthusiast with experience in predictive analytics. Interested in healthcare, finance, or sports analytics projects.",
      skills: ["Python", "TensorFlow", "Pandas", "SQL", "Statistical Analysis"],
      contact: "data.scientist@email.com",
      author: "Kavya Reddy",
      department: "Data Science",
      posted: "2025-09-17"
    },
    {
      id: 7,
      type: "team",
      title: "AR/VR Educational Platform",
      description: "Creating immersive learning experiences for K-12 students. Looking for Unity developer and educational content creator.",
      skills: ["Unity", "C#", "AR/VR", "Educational Technology"],
      teamSize: "2/4",
      contact: "arvr.edu@email.com",
      author: "Dev Patel",
      department: "Game Development",
      posted: "2025-09-23"
    },
    {
      id: 8,
      type: "individual",
      title: "Marketing & Strategy Specialist",
      description: "Business strategy background with digital marketing expertise. Looking to join tech startup or social impact project teams.",
      skills: ["Digital Marketing", "Business Strategy", "Market Research", "Analytics"],
      contact: "marketing.expert@email.com",
      author: "Riya Agarwal",
      department: "Business Administration",
      posted: "2025-09-16"
    }
  ],
  departments: [
    "Computer Science",
    "Information Technology",
    "Environmental Engineering",
    "Business Administration",
    "Design",
    "Data Science",
    "Game Development",
    "Cultural Club",
    "AI Society",
    "Business Club",
    "Robotics Club",
    "Photography Club",
    "Literary Society"
  ],
  currentUser: {
    id: 1,
    name: "John Student",
    email: "john.student@college.edu",
    department: "Computer Science",
    year: "3rd Year",
    skills: ["JavaScript", "React", "Python", "Node.js"],
    interests: ["Web Development", "AI", "Open Source"],
    eventsRegistered: [1, 3, 8]
  }
};

// Application State
let appData = JSON.parse(JSON.stringify(initialData));
let currentPage = 'home';
let isLoggedIn = true; // Simulating logged in state

// Utility Functions
function generateId() {
  return Math.max(...appData.events.map(e => e.id), ...appData.hackfinderPosts.map(p => p.id)) + 1;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function saveToLocalStorage() {
  localStorage.setItem('collegeEventsData', JSON.stringify(appData));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('collegeEventsData');
  if (saved) {
    appData = JSON.parse(saved);
  }
}

// DOM Manipulation Functions
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  document.getElementById(`${pageId}-page`).classList.add('active');
  
  // Update navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
  currentPage = pageId;
  
  // Update page content
  switch(pageId) {
    case 'home':
      renderFeaturedEvents();
      break;
    case 'events':
      renderEvents();
      populateDepartmentFilters();
      break;
    case 'hackfinder':
      renderHackfinderPosts();
      break;
    case 'profile':
      renderProfile();
      break;
  }
}

function renderFeaturedEvents() {
  const container = document.getElementById('featuredEventsGrid');
  const featuredEvents = appData.events.filter(event => event.featured);
  
  container.innerHTML = featuredEvents.map(event => `
    <div class="event-card">
      <div class="event-card-header">
        <h3 class="event-card-title">${event.title}</h3>
        <div class="event-card-meta">
          <span>ðŸ“… ${formatDate(event.date)}</span>
          <span>â° ${event.time}</span>
        </div>
        <span class="event-card-department">${event.department}</span>
      </div>
      <div class="event-card-body">
        <p class="event-card-description">${event.description}</p>
        <div class="event-card-actions">
          <a href="${event.registrationLink}" target="_blank" class="btn btn--primary">Register</a>
        </div>
      </div>
    </div>
  `).join('');
}

function renderEvents() {
  const container = document.getElementById('eventsGrid');
  const searchTerm = document.getElementById('eventSearch')?.value.toLowerCase() || '';
  const selectedDepartment = document.getElementById('departmentFilter')?.value || '';
  
  let filteredEvents = appData.events;
  
  if (searchTerm) {
    filteredEvents = filteredEvents.filter(event => 
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.department.toLowerCase().includes(searchTerm)
    );
  }
  
  if (selectedDepartment) {
    filteredEvents = filteredEvents.filter(event => event.department === selectedDepartment);
  }
  
  container.innerHTML = filteredEvents.map(event => `
    <div class="event-card">
      <div class="event-card-header">
        <h3 class="event-card-title">${event.title}</h3>
        <div class="event-card-meta">
          <span>ðŸ“… ${formatDate(event.date)}</span>
          <span>â° ${event.time}</span>
        </div>
        <span class="event-card-department">${event.department}</span>
      </div>
      <div class="event-card-body">
        <p class="event-card-description">${event.description}</p>
        <div class="event-card-actions">
          <a href="${event.registrationLink}" target="_blank" class="btn btn--primary">Register</a>
        </div>
      </div>
    </div>
  `).join('');
}

function renderHackfinderPosts() {
  const teamsContainer = document.getElementById('teamsGrid');
  const individualsContainer = document.getElementById('individualsGrid');
  
  const teamPosts = appData.hackfinderPosts.filter(post => post.type === 'team');
  const individualPosts = appData.hackfinderPosts.filter(post => post.type === 'individual');
  
  teamsContainer.innerHTML = teamPosts.map(post => `
    <div class="post-card">
      <div class="post-card-header">
        <div>
          <h3 class="post-card-title">${post.title}</h3>
          <span class="post-card-type">Team</span>
        </div>
      </div>
      <p class="post-card-description">${post.description}</p>
      <div class="post-card-skills">
        ${post.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
      <div class="post-card-footer">
        <div class="post-card-author">
          <strong>${post.author}</strong><br>
          ${post.department}
          ${post.teamSize ? `<br>Team: ${post.teamSize}` : ''}
        </div>
        <a href="mailto:${post.contact}" class="post-card-contact">${post.contact}</a>
      </div>
    </div>
  `).join('');
  
  individualsContainer.innerHTML = individualPosts.map(post => `
    <div class="post-card">
      <div class="post-card-header">
        <div>
          <h3 class="post-card-title">${post.title}</h3>
          <span class="post-card-type">Individual</span>
        </div>
      </div>
      <p class="post-card-description">${post.description}</p>
      <div class="post-card-skills">
        ${post.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
      <div class="post-card-footer">
        <div class="post-card-author">
          <strong>${post.author}</strong><br>
          ${post.department}
        </div>
        <a href="mailto:${post.contact}" class="post-card-contact">${post.contact}</a>
      </div>
    </div>
  `).join('');
}

function renderProfile() {
  const user = appData.currentUser;
  
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileDepartment').textContent = `${user.department} â€¢ ${user.year}`;
  
  const skillsContainer = document.getElementById('profileSkills');
  skillsContainer.innerHTML = user.skills.map(skill => 
    `<span class="skill-badge">${skill}</span>`
  ).join('');
  
  const interestsContainer = document.getElementById('profileInterests');
  interestsContainer.innerHTML = user.interests.map(interest => 
    `<span class="interest-badge">${interest}</span>`
  ).join('');
  
  const eventsContainer = document.getElementById('profileEvents');
  const registeredEvents = appData.events.filter(event => 
    user.eventsRegistered.includes(event.id)
  );
  
  eventsContainer.innerHTML = registeredEvents.map(event => `
    <div class="registered-event">
      <div class="registered-event-title">${event.title}</div>
      <div class="registered-event-date">${formatDate(event.date)} â€¢ ${event.time}</div>
    </div>
  `).join('');
}

function populateDepartmentFilters() {
  const select = document.getElementById('departmentFilter');
  if (select) {
    select.innerHTML = '<option value="">All Departments</option>' +
      appData.departments.map(dept => `<option value="${dept}">${dept}</option>`).join('');
  }
}

function populateDepartmentSelects() {
  const selects = ['eventDepartment', 'profileDepartmentInput'];
  selects.forEach(selectId => {
    const select = document.getElementById(selectId);
    if (select) {
      select.innerHTML = '<option value="">Select Department</option>' +
        appData.departments.map(dept => `<option value="${dept}">${dept}</option>`).join('');
    }
  });
}

// Modal Functions
function showModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

function hideAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.add('hidden');
  });
}

// Event Handlers
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('[data-page]').forEach(element => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      const page = element.getAttribute('data-page');
      showPage(page);
    });
  });
  
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
  
  // Login button
  document.getElementById('loginBtn').addEventListener('click', () => {
    showModal('loginModal');
  });
  
  // Modal close buttons
  document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      hideModal(modal.id);
    });
  });
  
  // Close modal when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal(modal.id);
      }
    });
  });
  
  // Create Event button
  document.getElementById('createEventBtn').addEventListener('click', () => {
    populateDepartmentSelects();
    showModal('eventModal');
  });
  
  // Create Post button
  document.getElementById('createPostBtn').addEventListener('click', () => {
    showModal('postModal');
  });
  
  // Edit Profile button
  document.getElementById('editProfileBtn').addEventListener('click', () => {
    populateDepartmentSelects();
    populateProfileForm();
    showModal('profileModal');
  });
  
  // HackFinder tabs
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      
      // Update tab buttons
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update tab content
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });
  
  // Search and filter events
  const eventSearch = document.getElementById('eventSearch');
  const departmentFilter = document.getElementById('departmentFilter');
  
  if (eventSearch) {
    eventSearch.addEventListener('input', renderEvents);
  }
  
  if (departmentFilter) {
    departmentFilter.addEventListener('change', renderEvents);
  }
  
  // Post type change handler
  document.getElementById('postType').addEventListener('change', (e) => {
    const teamSizeGroup = document.getElementById('teamSizeGroup');
    if (e.target.value === 'team') {
      teamSizeGroup.style.display = 'block';
    } else {
      teamSizeGroup.style.display = 'none';
    }
  });
  
  // Form submissions
  document.getElementById('eventForm').addEventListener('submit', handleEventSubmission);
  document.getElementById('postForm').addEventListener('submit', handlePostSubmission);
  document.getElementById('profileForm').addEventListener('submit', handleProfileSubmission);
  document.getElementById('loginForm').addEventListener('submit', handleLoginSubmission);
}

function handleEventSubmission(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const event = {
    id: generateId(),
    title: document.getElementById('eventTitle').value,
    date: document.getElementById('eventDate').value,
    time: document.getElementById('eventTime').value,
    department: document.getElementById('eventDepartment').value,
    description: document.getElementById('eventDescription').value,
    registrationLink: document.getElementById('eventLink').value,
    featured: false
  };
  
  appData.events.push(event);
  saveToLocalStorage();
  
  // Reset form and close modal
  e.target.reset();
  hideModal('eventModal');
  
  // Refresh events display
  if (currentPage === 'events') {
    renderEvents();
  }
  
  alert('Event created successfully!');
}

function handlePostSubmission(e) {
  e.preventDefault();
  
  const skills = document.getElementById('postSkills').value
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill);
    
  const post = {
    id: generateId(),
    type: document.getElementById('postType').value,
    title: document.getElementById('postTitle').value,
    description: document.getElementById('postDescription').value,
    skills: skills,
    contact: document.getElementById('postContact').value,
    author: appData.currentUser.name,
    department: appData.currentUser.department,
    posted: new Date().toISOString().split('T')[0]
  };
  
  if (post.type === 'team') {
    post.teamSize = document.getElementById('postTeamSize').value;
  }
  
  appData.hackfinderPosts.push(post);
  saveToLocalStorage();
  
  // Reset form and close modal
  e.target.reset();
  hideModal('postModal');
  
  // Refresh posts display
  if (currentPage === 'hackfinder') {
    renderHackfinderPosts();
  }
  
  alert('Post created successfully!');
}

function handleProfileSubmission(e) {
  e.preventDefault();
  
  const skills = document.getElementById('profileSkillsInput').value
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill);
    
  const interests = document.getElementById('profileInterestsInput').value
    .split(',')
    .map(interest => interest.trim())
    .filter(interest => interest);
  
  appData.currentUser = {
    ...appData.currentUser,
    name: document.getElementById('profileNameInput').value,
    email: document.getElementById('profileEmailInput').value,
    department: document.getElementById('profileDepartmentInput').value,
    year: document.getElementById('profileYearInput').value,
    skills: skills,
    interests: interests
  };
  
  saveToLocalStorage();
  
  // Close modal and refresh profile
  hideModal('profileModal');
  renderProfile();
  
  alert('Profile updated successfully!');
}

function handleLoginSubmission(e) {
  e.preventDefault();
  
  // Simulate login (in a real app, this would validate credentials)
  isLoggedIn = true;
  hideModal('loginModal');
  
  // Update login button to show user name
  document.getElementById('loginBtn').textContent = appData.currentUser.name;
  
  alert('Login successful!');
}

function populateProfileForm() {
  const user = appData.currentUser;
  
  document.getElementById('profileNameInput').value = user.name;
  document.getElementById('profileEmailInput').value = user.email;
  document.getElementById('profileDepartmentInput').value = user.department;
  document.getElementById('profileYearInput').value = user.year;
  document.getElementById('profileSkillsInput').value = user.skills.join(', ');
  document.getElementById('profileInterestsInput').value = user.interests.join(', ');
}

// Initialize Application
function initializeApp() {
  loadFromLocalStorage();
  setupEventListeners();
  populateDepartmentSelects();
  showPage('home');
  
  // Update login button if user is logged in
  if (isLoggedIn) {
    document.getElementById('loginBtn').textContent = appData.currentUser.name;
  }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);