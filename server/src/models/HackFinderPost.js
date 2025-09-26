import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSnapshotSchema = new Schema(
  {
    firebaseUid: { type: String, trim: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    role: { type: String, trim: true }
  },
  { _id: false }
);

const hackFinderPostSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['team', 'individual'],
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    skills: {
      type: [String],
      default: []
    },
    teamSize: {
      type: String,
      trim: true
    },
    contact: {
      type: String,
      trim: true
    },
    author: {
      type: String,
      trim: true
    },
    department: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'published', 'rejected'],
      default: 'pending'
    },
    submittedBy: userSnapshotSchema,
    approvedBy: userSnapshotSchema,
    submittedAt: {
      type: Date,
      default: Date.now
    },
    approvedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

hackFinderPostSchema.index({ status: 1, createdAt: -1 });

hackFinderPostSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.HackFinderPost ||
  mongoose.model('HackFinderPost', hackFinderPostSchema);
