import mongoose from 'mongoose';

const CommonAreaSchema = new mongoose.Schema({
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
  edition: {
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

const CommonArea = mongoose.model('common-area', CommonAreaSchema, 'common-area');
export default CommonArea;
