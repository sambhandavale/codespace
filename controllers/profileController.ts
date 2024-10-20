import { Request, Response } from 'express';
import Profile, { IProfile } from '../models/Profile'; // Import your Profile type

// Get User Profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        // Ensure req.user is correctly typed
        const userId = (req as any).user?.id; // Adjust if you have a specific type for req.user
        if (!userId) {
            res.status(401).send('Unauthorized1');
            return; 
        }

        // Find the profile based on the user ID
        const profile: IProfile | null = await Profile.findOne({ user: userId });
        if (!profile) {
            res.status(404).send('Profile not found');
            return;
        }
        
        res.json(profile);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching profile:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
        res.status(500).send('Error fetching profile');
    }
};

// Update User Profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, birthDate, phoneNumber, university, bio } = req.body;
    try {
        const initial_rating = 800;
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).send('Unauthorized');
            return; 
        }

        let profile: IProfile | null = await Profile.findOne({ user: userId });
        if (!profile) {
            profile = new Profile({ firstName, lastName, birthDate, phoneNumber, university, bio, user: userId, rating:initial_rating });
            await profile.save();
        } else {
            profile.firstName = firstName || profile.firstName;
            profile.lastName = lastName || profile.lastName;
            profile.birthDate = birthDate || profile.birthDate;
            profile.phoneNumber = phoneNumber || profile.phoneNumber;
            profile.university = university || profile.university;
            profile.bio = bio || profile.bio;
            await profile.save();
        }

        res.json(profile);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating profile:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
        res.status(500).send('Error updating profile');
    }
};
