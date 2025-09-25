export const initialData = {
  events: [
    {
      id: 1,
      title: "Annual Tech Symposium 2025",
      date: "2025-10-15",
      time: "09:00 AM",
      department: "Computer Science",
      description:
        "A comprehensive technical symposium featuring latest trends in AI, blockchain, and cloud computing with industry experts.",
      registrationLink: "https://forms.google.com/techsymp2025",
      featured: true
    },
    {
      id: 2,
      title: "Cultural Fest - Rangmanch",
      date: "2025-11-05",
      time: "04:00 PM",
      department: "Cultural Club",
      description:
        "Three-day cultural extravaganza with dance, music, drama, and art competitions from colleges across the region.",
      registrationLink: "https://forms.google.com/rangmanch2025",
      featured: true
    },
    {
      id: 3,
      title: "Machine Learning Workshop",
      date: "2025-10-28",
      time: "02:00 PM",
      department: "AI Society",
      description:
        "Hands-on workshop covering neural networks, deep learning frameworks, and practical implementation projects.",
      registrationLink: "https://forms.google.com/mlworkshop",
      featured: false
    },
    {
      id: 4,
      title: "Entrepreneurship Summit",
      date: "2025-11-12",
      time: "10:00 AM",
      department: "Business Club",
      description:
        "Meet successful entrepreneurs, pitch your startup ideas, and learn about funding opportunities and business strategies.",
      registrationLink: "https://forms.google.com/entrepreneur2025",
      featured: false
    },
    {
      id: 5,
      title: "Robotics Competition",
      date: "2025-10-30",
      time: "11:00 AM",
      department: "Robotics Club",
      description:
        "Inter-college robotics challenge with line-following, obstacle course, and autonomous navigation categories.",
      registrationLink: "https://forms.google.com/robotics2025",
      featured: false
    },
    {
      id: 6,
      title: "Photography Exhibition",
      date: "2025-11-08",
      time: "12:00 PM",
      department: "Photography Club",
      description:
        "Annual photography showcase featuring student works across various themes - nature, portrait, street, and abstract photography.",
      registrationLink: "https://forms.google.com/photoexhibit",
      featured: false
    },
    {
      id: 7,
      title: "Debate Championship",
      date: "2025-11-20",
      time: "03:00 PM",
      department: "Literary Society",
      description:
        "Inter-collegiate debate championship covering contemporary topics in politics, technology, and social issues.",
      registrationLink: "https://forms.google.com/debate2025",
      featured: false
    },
    {
      id: 8,
      title: "Hackathon 2025",
      date: "2025-12-01",
      time: "09:00 AM",
      department: "Computer Science",
      description:
        "48-hour coding marathon focusing on sustainable technology solutions with prizes worth ₹50,000.",
      registrationLink: "https://forms.google.com/hackathon2025",
      featured: true
    }
  ],
  hackfinderPosts: [
    {
      id: 1,
      type: "team",
      title: "AI-Powered Healthcare App",
      description:
        "Building an AI diagnostic tool for rural healthcare. Looking for 2 developers with React/Python experience and 1 UI/UX designer.",
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
      description:
        "Experienced in MERN stack, looking to join a team working on fintech or edtech solutions. Available for hackathons and competitions.",
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
      description:
        "Environmental impact tracking app team needs mobile developer and data scientist to complete our green-tech project.",
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
      description:
        "Passionate about user-centered design with 2 years experience. Looking for innovative projects in social impact or education technology.",
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
      description:
        "Developing secure digital voting platform using blockchain. Need blockchain developer and cybersecurity expert.",
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
      description:
        "Machine learning enthusiast with experience in predictive analytics. Interested in healthcare, finance, or sports analytics projects.",
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
      description:
        "Creating immersive learning experiences for K-12 students. Looking for Unity developer and educational content creator.",
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
      description:
        "Business strategy background with digital marketing expertise. Looking to join tech startup or social impact project teams.",
      skills: ["Digital Marketing", "Business Strategy", "Market Research", "Analytics"],
      contact: "marketing.expert@email.com",
      author: "Riya Agarwal",
      department: "Business Administration",
      posted: "2025-09-16"
    }
  ],
  pendingEvents: [],
  pendingHackfinderPosts: [],
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
