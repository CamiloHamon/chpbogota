import mongoose from 'mongoose';

const ContactUsSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  insert: {
    type: Date,
    default: Date.now,
  },
});

const ContactUs = mongoose.model('contact-us', ContactUsSchema, 'contact-us');
export default ContactUs;
