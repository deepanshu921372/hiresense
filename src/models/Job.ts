import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
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
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  postedAt: Date;
  expiresAt?: Date;
  sourceUrl?: string;
  source: string;
  isActive: boolean;
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: 'text',
    },
    company: {
      type: String,
      required: true,
      trim: true,
      index: 'text',
    },
    companyLogo: {
      type: String,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    benefits: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ['entry', 'mid', 'senior', 'lead'],
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
    sourceUrl: {
      type: String,
    },
    source: {
      type: String,
      required: true,
      default: 'manual',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
JobSchema.index({ type: 1, experienceLevel: 1 });
JobSchema.index({ location: 1, type: 1 });
JobSchema.index({ postedAt: -1 });
JobSchema.index({ isActive: 1, postedAt: -1 });
JobSchema.index({ 'salary.min': 1, 'salary.max': 1 });

// Text search index
JobSchema.index(
  { title: 'text', company: 'text', description: 'text' },
  { weights: { title: 10, company: 5, description: 1 } }
);

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;
