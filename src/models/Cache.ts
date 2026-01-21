import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICache extends Document {
  key: string;
  value: unknown;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CacheSchema = new Schema<ICache>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

CacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Cache: Model<ICache> =
  mongoose.models.Cache || mongoose.model<ICache>('Cache', CacheSchema);

export default Cache;
