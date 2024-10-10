import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
    title: string;
    difficulty: string;
    task: string;
    input_format: string;
    constraints: string;
    output_format: string;
    time:number;
    examples: Array<{
        input: string;
        output: string;
        explanation: string;
    }>;
}

const QuestionSchema: Schema = new Schema({
    title: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
    task: { type: String, required: true },
    input_format: { type: String, required: true },
    constraints: { type: String, required: true },
    output_format: { type: String, required: true },
    time: { type: Number, required: true },
    examples: [{
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String, required: true }
    }]
});

const Question = mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
