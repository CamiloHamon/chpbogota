import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  urlImage: {
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

const LinkModel = mongoose.model('link', LinkSchema, 'links');
export default LinkModel;
