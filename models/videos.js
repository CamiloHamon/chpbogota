import mongoose from 'mongoose';

const VideosSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  urlImage: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  update: {
    type: Date,
    default: Date.now,
  },
  showInHome: {
    type: Boolean,
    default: false
  },
  insert: {
    type: Date,
    default: Date.now,
  }
});

const VideosModel = mongoose.model('videos', VideosSchema, 'videos');
export default VideosModel;
