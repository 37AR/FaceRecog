const mongoose =  require('mongoose');
const { Schema } = mongoose;

const PTM_FaceDataSchema = new Schema({
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


const PTM_FaceData = mongoose.model('PTM_FaceData', PTM_FaceDataSchema);

module.exports = PTM_FaceData;