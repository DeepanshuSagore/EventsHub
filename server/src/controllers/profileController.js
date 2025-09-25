import Profile from '../models/Profile.js';

const ARRAY_FIELDS = ['skills', 'interests'];
const ALLOWED_FIELDS = [
  'name',
  'studentId',
  'department',
  'year',
  'skills',
  'interests',
  'bio',
  'contactEmail',
  'phone',
  'links'
];

function normalizeArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeLinks(links) {
  if (!Array.isArray(links)) return [];
  return links
    .map((link) => ({
      label: link?.label?.trim() ?? '',
      url: link?.url?.trim() ?? ''
    }))
    .filter((link) => link.label && link.url);
}

export async function getMyProfile(req, res) {
  const firebaseUid = req.firebaseUser?.uid;

  if (!firebaseUid) {
    return res.status(400).json({ message: 'Invalid Firebase user payload' });
  }

  const profile = await Profile.findOne({ firebaseUid });

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  res.json({ profile: profile.toJSON() });
}

export async function updateMyProfile(req, res) {
  const firebaseUid = req.firebaseUser?.uid;

  if (!firebaseUid) {
    return res.status(400).json({ message: 'Invalid Firebase user payload' });
  }

  const update = {};

  for (const key of ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      update[key] = req.body[key];
    }
  }

  for (const key of ARRAY_FIELDS) {
    if (update[key] !== undefined) {
      update[key] = normalizeArrayField(update[key]);
    }
  }

  if (update.links !== undefined) {
    update.links = normalizeLinks(update.links);
  }

  if (update.contactEmail) {
    update.contactEmail = String(update.contactEmail).toLowerCase();
  }

  const profile = await Profile.findOneAndUpdate(
    { firebaseUid },
    { $set: update },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({ profile: profile.toJSON() });
}
