import Event from '../models/Event.js';
import HackFinderPost from '../models/HackFinderPost.js';
import { buildUserSnapshot } from './helpers.js';
import { deleteEventById, getEventById } from './eventController.js';
import { deleteHackFinderPostById, getHackFinderPostById } from './hackFinderController.js';

function mapDocument(doc) {
  const json = doc.toJSON();
  return {
    ...json,
    id: json.id || doc._id.toString()
  };
}

export async function getAdminQueues(_req, res) {
  const [events, posts] = await Promise.all([
    Event.find({ status: 'pending' }).sort({ submittedAt: -1 }),
    HackFinderPost.find({ status: 'pending' }).sort({ submittedAt: -1 })
  ]);

  res.json({
    events: events.map(mapDocument),
    hackfinderPosts: posts.map(mapDocument)
  });
}

export async function approveEvent(req, res) {
  const event = await getEventById(req.params.eventId);
  const snapshot = buildUserSnapshot(req.firebaseUser, req.dbUser);

  event.status = 'published';
  event.approvedBy = snapshot;
  event.approvedAt = new Date();

  await event.save();

  res.json({ event: mapDocument(event) });
}

export async function rejectEvent(req, res) {
  const event = await getEventById(req.params.eventId);

  event.status = 'rejected';
  event.approvedBy = undefined;
  event.approvedAt = undefined;

  await event.save();

  res.json({ event: mapDocument(event) });
}

export async function deleteEvent(req, res) {
  const deleted = await deleteEventById(req.params.eventId);
  res.json({ event: mapDocument(deleted) });
}

export async function approveHackFinderPost(req, res) {
  const post = await getHackFinderPostById(req.params.postId);
  const snapshot = buildUserSnapshot(req.firebaseUser, req.dbUser);

  post.status = 'published';
  post.approvedBy = snapshot;
  post.approvedAt = new Date();

  await post.save();

  res.json({ post: mapDocument(post) });
}

export async function rejectHackFinderPost(req, res) {
  const post = await getHackFinderPostById(req.params.postId);

  post.status = 'rejected';
  post.approvedBy = undefined;
  post.approvedAt = undefined;

  await post.save();

  res.json({ post: mapDocument(post) });
}

export async function deleteHackFinderPost(req, res) {
  const post = await deleteHackFinderPostById(req.params.postId);
  res.json({ post: mapDocument(post) });
}
