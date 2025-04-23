import mongoose from "mongoose";
const { Schema } = mongoose;

const leadsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    emails: {
      type: String,
      required: true, 
    }, 
    messages: {
      type: String,
      required: true,
    },  
  },
  { timestamps: true }
);

const leadsModel = mongoose.model("leads", leadsSchema);
export default leadsModel;
