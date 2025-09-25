import { getFirebaseAuth } from '../config/firebase.js';
import User from '../models/User.js';

const firebaseAuth = getFirebaseAuth();

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization ?? '';
    const tokenMatch = header.match(/^Bearer\s+(.*)$/i);

    if (!tokenMatch) {
      return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const idToken = tokenMatch[1];
    const decodedToken = await firebaseAuth.verifyIdToken(idToken, true);

    req.firebaseUser = decodedToken;
    req.dbUser = await User.findOne({ firebaseUid: decodedToken.uid });

    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired authentication token' });
  }
}
