import User from '../models/User.js';
import Profile from '../models/Profile.js';

function buildEmailSet(rawEmails) {
  return new Set(
    (rawEmails ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

const adminEmailSet = buildEmailSet(process.env.ADMIN_EMAILS);
const eventHeadEmailSet = buildEmailSet(process.env.EVENT_HEAD_EMAILS);

function sanitizeFirebaseUser(firebaseUser) {
  if (!firebaseUser) return {};
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? null,
    name: firebaseUser.name ?? firebaseUser.displayName ?? '',
    picture: firebaseUser.picture ?? null
  };
}

export async function syncAccount(req, res) {
  const firebaseUser = req.firebaseUser;

  if (!firebaseUser) {
    return res.status(400).json({ message: 'Unable to read Firebase user information' });
  }

  const { uid, email, name, picture } = sanitizeFirebaseUser(firebaseUser);

  if (!email) {
    return res.status(400).json({ message: 'Firebase user record is missing an email address' });
  }

  const now = new Date();
  const normalizedEmail = email.toLowerCase();
  const shouldBeAdmin = adminEmailSet.has(normalizedEmail);
  const shouldBeEventHead = eventHeadEmailSet.has(normalizedEmail);
  const targetRole = shouldBeAdmin ? 'admin' : shouldBeEventHead ? 'eventHead' : 'student';

  let user = req.dbUser;

  if (!user) {
    user = new User({
      firebaseUid: uid,
      email: normalizedEmail,
      displayName: name,
      photoURL: picture ?? undefined,
      lastLoginAt: now,
      role: targetRole
    });
  } else {
    user.email = normalizedEmail;
    user.displayName = name;
    user.photoURL = picture ?? user.photoURL;
    user.lastLoginAt = now;
    if (user.role !== targetRole) {
      user.role = targetRole;
    }
  }

  if (!user.role) {
    user.role = 'student';
  }

  await user.save();

  let profile = await Profile.findOne({ firebaseUid: uid });

  if (!profile) {
    profile = await Profile.create({
      firebaseUid: uid,
      name: name || '',
      contactEmail: email.toLowerCase()
    });
  } else {
    if (!profile.name && name) {
      profile.name = name;
    }
    if (!profile.contactEmail && email) {
      profile.contactEmail = email.toLowerCase();
    }
    await profile.save();
  }

  res.json({
    user: user.toJSON(),
    profile: profile.toJSON()
  });
}
