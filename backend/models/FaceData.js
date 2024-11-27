const mongoose =  require('mongoose');
const { Schema } = mongoose;

const FaceDataSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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


const FaceData = mongoose.model('FaceData', FaceDataSchema);

module.exports = FaceData;