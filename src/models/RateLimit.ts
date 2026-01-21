import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRateLimit extends Document {
  identifier: string;
  endpoint: string;
  count: number;
  windowStart: Date;
  expiresAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    identifier: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    windowStart: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

RateLimitSchema.index({ identifier: 1, endpoint: 1 }, { unique: true });
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RateLimit: Model<IRateLimit> =
  mongoose.models.RateLimit || mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);

export default RateLimit;
