import mongoose from 'mongoose';
import Event from '../models/Event.js';
import { buildUserSnapshot } from './helpers.js';

function normalizeEventPayload(payload = {}) {
  const requiredFields = ['title', 'date', 'time', 'department', 'description', 'registrationLink'];

  for (const field of requiredFields) {
    if (!payload[field] || typeof payload[field] !== 'string' || !payload[field].trim()) {
      const error = new Error(`Missing required field: ${field}`);
      error.status = 400;
      throw error;
    }
  }

  return {
    title: payload.title.trim(),
    date: payload.date.trim(),
    time: payload.time.trim(),
    department: payload.department.trim(),
    description: payload.description.trim(),
    registrationLink: payload.registrationLink.trim(),
    featured: Boolean(payload.featured)
  };
}

export async function listPublishedEvents(_req, res) {
  const events = await Event.find({ status: 'published' }).sort({ date: 1, createdAt: -1 }).lean();
  const formatted = events.map(({ _id, __v, ...rest }) => ({
    ...rest,
    id: _id.toString()
  }));
  res.json({ events: formatted });
}

export async function createEvent(req, res) {
  const eventData = normalizeEventPayload(req.body ?? {});

  const hasPublishingPrivileges = ['admin', 'eventHead'].includes(req.dbUser?.role);
  const snapshot = buildUserSnapshot(req.firebaseUser, req.dbUser);

  const event = await Event.create({
    ...eventData,
    status: hasPublishingPrivileges ? 'published' : 'pending',
    submittedBy: snapshot,
    approvedBy: hasPublishingPrivileges ? snapshot : undefined,
    submittedAt: new Date(),
    approvedAt: hasPublishingPrivileges ? new Date() : undefined
  });

  res.status(201).json({ event: event.toJSON() });
}

export async function getEventById(eventId) {
  if (!mongoose.isValidObjectId(eventId)) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  const event = await Event.findById(eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  return event;
}

export async function deleteEventById(eventId) {
  if (!mongoose.isValidObjectId(eventId)) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  const event = await Event.findByIdAndDelete(eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  return event;
}
