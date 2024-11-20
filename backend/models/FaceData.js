const mongoose =  require('mongoose');
const { Schema } = mongoose;

const FaceDataSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    label: {
        type: String,
        required: true
    },
    faceEncoding: {
        type: [Number],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('FaceData', FaceDataSchema);