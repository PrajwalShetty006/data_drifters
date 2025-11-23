import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
    topSegment: {
        type: Number,   
        required: true
    },
    suggestedOffer:{
        type:String
,
required:true
    },
    generatedAt:{
        type:Date,
        default:Date.now
    }
}); 

export default mongoose.model('Offer', offerSchema);    