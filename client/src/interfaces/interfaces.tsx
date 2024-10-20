export interface IUser {
    _id: string;
    user: string;
    firstName: string;
    lastName: string;
    birthDate: string; // Alternatively, use Date for Date objects
    phoneNumber: number;
    university: string;
    bio: string;
    rating:number;
    __v: number;
}

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
  
