import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IExample {
    _id: string;
    input: string;
    output: string;
    explanation: string;
}

export interface IQuestion {
    _id: string;
    id: number;
    title: string;
    difficulty: string;
    task: string;
    input_format: string;
    constraints: string;
    output_format: string;
    time: number;
    examples: IExample[];
}

interface IOptions {
    level: string;
    language: string;
    questionAllocated?: IQuestion;
}

export interface IAvailableUsers extends Document {
    userId: string;
    socketId: string;
    optionsSelected: IOptions;
}

interface IOnlineUser extends Document {
    userId: string;
    socketId: string;
}

interface IRooms extends Document {
    room_id: string;
    user1: IOnlineUser;
    user2: IOnlineUser;
    optionsSelected: IOptions;
    question: IQuestion;
}

// Define the Question schema
const QuestionSchema: Schema<IQuestion> = new Schema({
    _id: { type: String, required: true },
    id: { type: Number, required: true },
    title: { type: String, required: true },
    difficulty: { type: String, required: true },
    task: { type: String, required: true },
    input_format: { type: String, required: true },
    constraints: { type: String, required: true },
    output_format: { type: String, required: true },
    time: { type: Number, required: true },
    examples: [{ type: Schema.Types.Mixed }],
});

// Define the OnlineUser schema
const OnlineUserSchema: Schema = new Schema({
    userId: { type: String, required: true },
    socketId: { type: String, required: true }
});

// Define the Rooms schema
const RoomsSchema: Schema<IRooms> = new Schema(
    {
        room_id: { type: String, required: true, unique: true },
        user1: { type: OnlineUserSchema, required: true },
        user2: { type: OnlineUserSchema, required: true },
        optionsSelected: {
            level: { type: String, required: true },
            language: { type: String, required: true },
        },
        question: { type: QuestionSchema, required: true }
    },
    { collection: 'rooms' }
);

// Define the AvailableUsers schema
const AvailableUsersSchema: Schema<IAvailableUsers> = new Schema(
    {
        userId: { type: String, required: true, unique: true },
        socketId: { type: String, required: true },
        optionsSelected: {
            level: { type: String, required: true },
            language: { type: String, required: true },
        }
    },
    { collection: 'availableUsers' }
);

// Create the models
export const AvailableUsers: Model<IAvailableUsers> = mongoose.model<IAvailableUsers>('AvailableUsers', AvailableUsersSchema);
export const Rooms: Model<IRooms> = mongoose.model<IRooms>('Rooms', RoomsSchema);
