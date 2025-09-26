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

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true,
      trim: true
    },
    time: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    registrationLink: {
      type: String,
      required: true,
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
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

eventSchema.index({ status: 1, date: 1, createdAt: -1 });

eventSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
