import { Request, Response } from 'express';
import Profile, { IProfile } from '../models/Profile'; // Import your Profile type

// Get all User Infos
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch all profiles from the database
        const profiles: IProfile[] = await Profile.find();
        res.json(profiles);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching users:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
        res.status(500).send('Error fetching users');
    }
};


// Get a specific User Info by ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract user ID from request parameters
        const userId = req.params.id;
        
        // Find the profile based on the user ID
        const profile: IProfile | null = await Profile.findOne({ user: userId });
        if (!profile) {
            res.status(404).send('User not found');
            return;
        }
        
        res.json(profile);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching user:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
        res.status(500).send('Error fetching user');
    }
};

