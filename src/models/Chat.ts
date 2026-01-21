import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IChatMessage[];
  context?: {
    jobId?: mongoose.Types.ObjectId;
    applicationId?: mongoose.Types.ObjectId;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: 'New Chat',
      trim: true,
    },
    messages: [
      {
        role: {
          type: String,
          required: true,
          enum: ['user', 'assistant'],
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    context: {
      jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
      },
      applicationId: {
        type: Schema.Types.ObjectId,
        ref: 'Application',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for fetching user's chats
ChatSchema.index({ userId: 1, updatedAt: -1 });

const Chat: Model<IChat> =
  mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
