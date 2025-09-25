import User from '../models/User.js';
import Profile from '../models/Profile.js';

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

  let user = req.dbUser;

  if (!user) {
    user = new User({
      firebaseUid: uid,
      email,
      displayName: name,
      photoURL: picture ?? undefined,
      lastLoginAt: now
    });
  } else {
    user.email = email.toLowerCase();
    user.displayName = name;
    user.photoURL = picture ?? user.photoURL;
    user.lastLoginAt = now;
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
