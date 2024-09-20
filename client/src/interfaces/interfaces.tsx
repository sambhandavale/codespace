export interface IUser {
    _id: string;
    user: string;
    firstName: string;
    lastName: string;
    birthDate: string; // Alternatively, use Date if you prefer to work with Date objects
    phoneNumber: number;
    university: string;
    bio: string;
    __v: number;
}
