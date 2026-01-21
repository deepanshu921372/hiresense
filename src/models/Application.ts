import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmbeddedJob {
  externalId: string; // JSearch job_id or other source ID
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  skills: string[];
  description?: string;
  applyLink?: string;
  postedAt: string;
}

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  job: IEmbeddedJob;
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
  matchScore: number;
  appliedAt?: Date;
  notes?: string;
  timeline: {
    action: string;
    date: Date;
    note?: string;
  }[];
  interviewDates?: Date[];
  offerDetails?: {
    salary: number;
    startDate?: Date;
    benefits?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const EmbeddedJobSchema = new Schema({
  externalId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  companyLogo: String,
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    default: 'full-time',
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD',
    },
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead'],
    default: 'entry',
  },
  skills: {
    type: [String],
    default: [],
  },
  description: String,
  applyLink: String,
  postedAt: String,
}, { _id: false });

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    job: {
      type: EmbeddedJobSchema,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['saved', 'applied', 'interviewing', 'offered', 'rejected', 'withdrawn'],
      default: 'saved',
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    appliedAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
    timeline: [
      {
        action: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
    interviewDates: {
      type: [Date],
      default: [],
    },
    offerDetails: {
      salary: Number,
      startDate: Date,
      benefits: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure user can only have one application per job (using external ID)
ApplicationSchema.index({ userId: 1, 'job.externalId': 1 }, { unique: true });

// Index for filtering by status
ApplicationSchema.index({ userId: 1, status: 1 });
ApplicationSchema.index({ userId: 1, appliedAt: -1 });
ApplicationSchema.index({ userId: 1, matchScore: -1 });
ApplicationSchema.index({ userId: 1, createdAt: -1 });

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;
