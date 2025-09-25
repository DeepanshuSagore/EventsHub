import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    displayName: {
      type: String,
      trim: true
    },
    photoURL: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['student', 'eventHead', 'admin'],
      default: 'student'
    },
    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ firebaseUid: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
