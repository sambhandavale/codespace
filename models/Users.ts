import mongoose, { Document, Schema, Model } from 'mongoose';

// Define TypeScript interface for User
export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
}

// Create the User schema
const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }
}, { collection: 'users' });

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
