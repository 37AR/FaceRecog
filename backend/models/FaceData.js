const mongoose =  require('mongoose');
const { Schema } = mongoose;

const FaceDataSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    faceEncoding: {
        type: [Number],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    label: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('FaceData', FaceDataSchema);