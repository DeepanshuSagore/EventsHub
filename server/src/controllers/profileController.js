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
    const error = new Error('Invalid Firebase user payload');
    error.status = 400;
    throw error;
  }

  let profile = await Profile.findOne({ firebaseUid });

  if (!profile) {
    profile = await Profile.create({
      firebaseUid,
      name: req.dbUser?.displayName ?? req.firebaseUser?.name ?? undefined,
      contactEmail: req.dbUser?.email ?? req.firebaseUser?.email ?? undefined
    });
  }

  res.json({ profile: profile.toJSON() });
}

export async function updateMyProfile(req, res) {
  const firebaseUid = req.firebaseUser?.uid;

  if (!firebaseUid) {
    const error = new Error('Invalid Firebase user payload');
    error.status = 400;
    throw error;
  }

  const update = {};

  for (const key of ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(req.body ?? {}, key)) {
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
    { $set: update, $setOnInsert: { firebaseUid } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({ profile: profile.toJSON() });
}
