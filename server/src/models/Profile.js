import mongoose from 'mongoose';

const { Schema } = mongoose;

const linkSchema = new Schema(
  {
    label: { type: String, trim: true },
    url: { type: String, trim: true }
  },
  { _id: false }
);

const profileSchema = new Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      trim: true
    },
    studentId: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    department: {
      type: String,
      trim: true
    },
    year: {
      type: String,
      trim: true
    },
    skills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: []
    },
    bio: {
      type: String,
      trim: true
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    links: {
      type: [linkSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

profileSchema.index({ firebaseUid: 1 }, { unique: true });
profileSchema.index({ studentId: 1 }, { sparse: true, unique: true });

profileSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema);
