// models/associate.js

import mongoose from 'mongoose';

const AssociateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Company', 'Natural Person'],
    required: true,
  },
  urlImage: {
    type: String,
    required: function () {
      return this.type === 'Company';
    },
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

const AssociateModel = mongoose.model('associate', AssociateSchema, 'associates');
export default AssociateModel;
