import mongoose from "mongoose"

const forecastSchema=new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    predicted_sales:{
        type:Number,
        required:true
    },
    generated_at:{
        type:Date,
        default:Date.now
    }
});

export default mongoose.model('Forecast',forecastSchema);   