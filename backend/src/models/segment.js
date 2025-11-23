import mongoose from "mongoose";

const SegmentSchema = new mongoose.Schema({
  segmentId: { 
    type: Number, 
    required: true
 },
  customerCount: {
     type: Number, 
     required: true 
    },
  avgSpend: {
     type: Number, 
     required: true
     },
  frequency: { 
    type: Number,
     required: true 
    },
  recency: { 
    type: Number, 
    required: true
 }
});

export default mongoose.model("Segment", SegmentSchema);