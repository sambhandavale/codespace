import mongoose, { Document, Schema } from 'mongoose';

// Define the Profile interface
export interface IProfile extends Document {
    user: mongoose.Schema.Types.ObjectId;
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    phoneNumber?: number;
    university?: string;
    bio?: string;
    rating: number;
}

// Create the Profile schema
const ProfileSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    birthDate: { type: Date },
    phoneNumber: { type: Number },
    university: { type: String },
    bio: { type: String },
    rating: {type: Number}
}, { collection: 'userInfo' });

// Create the Profile model
const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;
