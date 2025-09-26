import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database.js';
import Event from '../src/models/Event.js';
import HackFinderPost from '../src/models/HackFinderPost.js';

const seedAdminSnapshot = {
  firebaseUid: 'seed-admin-uid',
  name: 'EventsHub Admin Bot',
  email: 'admin@eventshub.edu',
  role: 'admin'
};

const seedModeratorSnapshot = {
  firebaseUid: 'seed-moderator-uid',
  name: 'Priya Sharma',
  email: 'priya.sharma@eventshub.edu',
  role: 'admin'
};

const seedEvents = [
  {
    title: 'AI Innovation Summit 2025',
    date: '2025-10-12',
    time: '10:00 AM',
    department: 'Computer Science',
    description:
      'Join researchers, industry leaders, and students to explore the latest breakthroughs in artificial intelligence, robotics, and responsible innovation.',
    registrationLink: 'https://events.eventshub.edu/register/ai-innovation-summit',
    featured: true,
    status: 'published',
    submittedBy: seedAdminSnapshot,
    approvedBy: seedModeratorSnapshot,
    submittedAt: new Date('2025-09-12T10:15:00.000Z'),
    approvedAt: new Date('2025-09-13T14:00:00.000Z')
  },
  {
    title: 'Green Tech Expo',
    date: '2025-09-30',
    time: '02:00 PM',
    department: 'Electrical Engineering',
    description:
      'A showcase of sustainable hardware prototypes, IoT solutions for campuses, and student-led climate tech ventures.',
    registrationLink: 'https://events.eventshub.edu/register/green-tech-expo',
    featured: false,
    status: 'published',
    submittedBy: seedAdminSnapshot,
    approvedBy: seedModeratorSnapshot,
    submittedAt: new Date('2025-09-08T16:45:00.000Z'),
    approvedAt: new Date('2025-09-09T09:30:00.000Z')
  },
  {
    title: 'Design Thinking Bootcamp',
    date: '2025-10-05',
    time: '09:30 AM',
    department: 'Design and Innovation',
    description:
      'A hands-on workshop guiding participants through empathy mapping, rapid prototyping, and user testing for social impact ideas.',
    registrationLink: 'https://events.eventshub.edu/register/design-thinking-bootcamp',
    featured: false,
    status: 'published',
    submittedBy: seedAdminSnapshot,
    approvedBy: seedModeratorSnapshot,
    submittedAt: new Date('2025-09-10T12:00:00.000Z'),
    approvedAt: new Date('2025-09-11T08:15:00.000Z')
  },
  {
    title: 'FinTech Futures Forum',
    date: '2025-10-18',
    time: '11:00 AM',
    department: 'Management Studies',
    description:
      'Panel discussions on decentralized finance, regulatory sandboxes, and careers in the evolving world of fintech.',
    registrationLink: 'https://events.eventshub.edu/register/fintech-futures-forum',
    featured: true,
    status: 'published',
    submittedBy: seedAdminSnapshot,
    approvedBy: seedModeratorSnapshot,
    submittedAt: new Date('2025-09-14T11:20:00.000Z'),
    approvedAt: new Date('2025-09-15T13:10:00.000Z')
  },
  {
    title: 'Campus Culture Fest',
    date: '2025-11-01',
    time: '05:00 PM',
    department: 'Student Affairs',
    description:
      'An evening of performances, food stalls, and community showcases celebrating the diversity of our campus.',
    registrationLink: 'https://events.eventshub.edu/register/culture-fest',
    featured: false,
    status: 'published',
    submittedBy: seedAdminSnapshot,
    approvedBy: seedModeratorSnapshot,
    submittedAt: new Date('2025-09-18T18:00:00.000Z'),
    approvedAt: new Date('2025-09-19T09:45:00.000Z')
  }
];

const seedHackFinderPosts = [
  {
    type: 'team',
    title: 'QuantumQuants Needs UX Lead',
    description:
      'We are building an analytics dashboard for the SmartCity hackathon and need a designer comfortable with user interviews and prototyping.',
    skills: ['Figma', 'User Research', 'Design Systems'],
    teamSize: '3 of 5 filled',
    contact: 'quantumquants@eventshub.edu',
    author: 'QuantumQuants Team',
    department: 'Computer Science',
    status: 'published',
    submittedBy: seedAdminSnapshot,
    approvedBy: seedModeratorSnapshot,
    submittedAt: new Date('2025-09-16T07:40:00.000Z'),
    approvedAt: new Date('2025-09-16T10:00:00.000Z')
  },
  {
    type: 'individual',
    title: 'ML Engineer Seeking Robotics Team',
    description:
      'Final-year student with experience in ROS 2 and computer vision is looking to join a robotics team for RoboFest. Happy to help with perception and navigation.',
    skills: ['ROS 2', 'Computer Vision', 'Python'],
    contact: 'isha.mehta@eventshub.edu',
    author: 'Isha Mehta',
    department: 'Robotics',
    status: 'published',
    submittedBy: seedAdminSnapshot,
    approvedBy: seedModeratorSnapshot,
    submittedAt: new Date('2025-09-17T09:15:00.000Z'),
    approvedAt: new Date('2025-09-17T11:45:00.000Z')
  },
  {
    type: 'team',
    title: 'BioHack Collective Looking for Frontend Dev',
    description:
      'We are prototyping an app that visualises lab test results for rural clinics. Need someone comfortable building dashboards and data visualisations.',
    skills: ['React', 'Tailwind CSS', 'Data Visualisation'],
    teamSize: '4 of 6 filled',
    contact: 'biohack.collective@eventshub.edu',
    author: 'BioHack Collective',
    department: 'Biotechnology',
    status: 'published',
    submittedBy: seedAdminSnapshot,
    approvedBy: seedModeratorSnapshot,
    submittedAt: new Date('2025-09-18T08:05:00.000Z'),
    approvedAt: new Date('2025-09-18T12:25:00.000Z')
  },
  {
    type: 'individual',
    title: 'Cloud Engineer Available for DevOps Duties',
    description:
      'AWS certified associate comfortable with CI/CD pipelines and observability stacks. Looking to join a team for the Build4Good hackathon.',
    skills: ['AWS', 'Docker', 'CI/CD', 'Grafana'],
    contact: 'dev.ops@eventshub.edu',
    author: 'Rahul Varma',
    department: 'Information Technology',
    status: 'published',
    submittedBy: seedAdminSnapshot,
    approvedBy: seedModeratorSnapshot,
    submittedAt: new Date('2025-09-19T13:50:00.000Z'),
    approvedAt: new Date('2025-09-19T16:20:00.000Z')
  }
];

async function upsertMany(Model, documents, uniqueKeys, label) {
  for (const document of documents) {
    const filter = uniqueKeys.reduce((acc, key) => {
      acc[key] = document[key];
      return acc;
    }, {});

    const result = await Model.updateOne(filter, { $set: document }, { upsert: true });

    if (result.upsertedCount > 0) {
      console.log(`Created ${label}: ${document.title}`);
    } else if (result.modifiedCount > 0) {
      console.log(`Updated ${label}: ${document.title}`);
    } else {
      console.log(`No changes for ${label}: ${document.title}`);
    }
  }
}

async function seed() {
  try {
    await connectDatabase();
    console.log('Seeding sample events and HackFinder posts...');

    await upsertMany(Event, seedEvents, ['title', 'date'], 'event');
    await upsertMany(HackFinderPost, seedHackFinderPosts, ['title', 'type'], 'hackfinder post');

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Failed to seed sample content:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
