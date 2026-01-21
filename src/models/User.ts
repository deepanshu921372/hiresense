import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  resume?: {
    fileUrl: string;
    fileName: string;
    uploadedAt: Date;
    parsedData?: {
      skills: string[];
      experience: string[];
      education: string[];
      summary?: string;
    };
  };
  preferences: {
    jobTypes: string[];
    locations: string[];
    salaryRange: {
      min: number;
      max: number;
    };
    remoteOnly: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    photoURL: {
      type: String,
    },
    resume: {
      fileUrl: String,
      fileName: String,
      uploadedAt: Date,
      parsedData: {
        skills: [String],
        experience: [String],
        education: [String],
        summary: String,
      },
    },
    preferences: {
      jobTypes: {
        type: [String],
        default: [],
      },
      locations: {
        type: [String],
        default: [],
      },
      salaryRange: {
        min: {
          type: Number,
          default: 0,
        },
        max: {
          type: Number,
          default: 500000,
        },
      },
      remoteOnly: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
UserSchema.index({ createdAt: -1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
