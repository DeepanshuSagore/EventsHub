import mongoose from 'mongoose';
import HackFinderPost from '../models/HackFinderPost.js';
import { buildUserSnapshot } from './helpers.js';

function normalizeHackFinderPayload(payload = {}) {
  const requiredFields = ['type', 'title', 'description', 'contact'];

  for (const field of requiredFields) {
    if (!payload[field] || typeof payload[field] !== 'string' || !payload[field].trim()) {
      const error = new Error(`Missing required field: ${field}`);
      error.status = 400;
      throw error;
    }
  }

  const type = payload.type.trim().toLowerCase();
  if (!['team', 'individual'].includes(type)) {
    const error = new Error('HackFinder post type must be either "team" or "individual"');
    error.status = 400;
    throw error;
  }

  const skills = Array.isArray(payload.skills)
    ? payload.skills
    : typeof payload.skills === 'string'
      ? payload.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  return {
    type,
    title: payload.title.trim(),
    description: payload.description.trim(),
    skills,
    teamSize: typeof payload.teamSize === 'string' ? payload.teamSize.trim() : undefined,
    contact: payload.contact.trim(),
    author: typeof payload.author === 'string' ? payload.author.trim() : undefined,
    department: typeof payload.department === 'string' ? payload.department.trim() : undefined
  };
}

export async function listPublishedHackFinderPosts(_req, res) {
  const posts = await HackFinderPost.find({ status: 'published' }).sort({ createdAt: -1 }).lean();
  const formatted = posts.map(({ _id, __v, ...rest }) => ({
    ...rest,
    id: _id.toString()
  }));

  res.json({ posts: formatted });
}

export async function createHackFinderPost(req, res) {
  const payload = normalizeHackFinderPayload(req.body ?? {});

  const userRole = req.dbUser?.role;
  const snapshot = buildUserSnapshot(req.firebaseUser, req.dbUser);
  const hasPublishingPrivileges = ['admin', 'eventHead'].includes(userRole);

  const post = await HackFinderPost.create({
    ...payload,
    status: hasPublishingPrivileges ? 'published' : 'pending',
    submittedBy: snapshot,
    approvedBy: hasPublishingPrivileges ? snapshot : undefined,
    submittedAt: new Date(),
    approvedAt: hasPublishingPrivileges ? new Date() : undefined
  });

  res.status(201).json({ post: post.toJSON() });
}

export async function getHackFinderPostById(postId) {
  if (!mongoose.isValidObjectId(postId)) {
    const error = new Error('HackFinder post not found');
    error.status = 404;
    throw error;
  }

  const post = await HackFinderPost.findById(postId);
  if (!post) {
    const error = new Error('HackFinder post not found');
    error.status = 404;
    throw error;
  }

  return post;
}

export async function deleteHackFinderPostById(postId) {
  if (!mongoose.isValidObjectId(postId)) {
    const error = new Error('HackFinder post not found');
    error.status = 404;
    throw error;
  }

  const post = await HackFinderPost.findByIdAndDelete(postId);
  if (!post) {
    const error = new Error('HackFinder post not found');
    error.status = 404;
    throw error;
  }

  return post;
}
