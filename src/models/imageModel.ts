import mongoose, {Schema, Document} from "mongoose";

export interface Iimage extends Document{
    filename: string;
    s3Url: string;
    description?: string;
};

const imageSchema = new Schema<Iimage>({
    filename: {type: String, required: true},
    s3Url: {type: String, required: true},
    description: {type: String, default: "image with no description :("}
},{timestamps: true});

export default mongoose.model("imageModel" , imageSchema);