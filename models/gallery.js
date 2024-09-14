import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  urlImage: {
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
  insert: {
    type: Date,
    default: Date.now,
  }
});

const GalleryModel = mongoose.model('gallery', GallerySchema, 'gallery');
export default GalleryModel;
