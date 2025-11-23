const SegmentationResultSchema = new mongoose.Schema({
  segments: {
    type: [SegmentSchema],  // Array of segment objects
    required: true
  },
  topSegment: {
    type: Number,
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("SegmentationResult", SegmentationResultSchema);