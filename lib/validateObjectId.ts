import { ObjectId } from "bson";

//helper to validate object id 
export default function isValidObjectId(id: string) {
    return ObjectId.isValid(id);
}
