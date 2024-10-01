import mongoose from 'mongoose';

const WhatsAppSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    urlImage: {
        type: String,
        default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADKklEQVR4nO2aTWxNQRTHfxQtKUoUC6HxsSA2EgtrQYOKRoTSjZ34qNKljaQrXwuNRImkCwsaYuH5ShcICxGxsdHPSCkRaSMRi6piZJIjeXmZuW/m3tt5N03/yUle8u793/N/c+bMOec+mMLkxQKgHrgAPAR6gG/AmJj+3C3f6Wt2A1VkBOVAI9AF/AaUp+l7HgMHhSs4ZgMtwOcYztvsE3ASqAglYjswkKKAQusHaidSgF76tgkUUGg3ZOVTxRLgTUARSuw1sDgtETWy3KpE1ic+JEK1pFFVYhsAlsYVUVGicFIRYRYrRbdnwHlVYJfjpFiVUdvmKkIvX28GHFYW63c9NFscCX8BJ4A5wHRgK/AnkJhml9VwLTsOG+7PBRIyVGzjNzoSPbfcXxswxA5ECelyJNlvuX9awP31KKqfcC3FV0f8GM2BhIwD80wO1HuQRMVnlSSCEGJ2mRy46EGgSxcbVgF/Awk5b3LggQfBTouImcDTQCIUcN/kRJ8Hwe2MlDU9JidGPAj0Hlhu4HgWWMiwSciYJ0mngWMtMBpQyE+TkDgO7DHwHC21kC8xiPSsaoWBq62UofUuJtlbYK7hhC+WzgcTzMOUmB74JUq/haanh2WW2u2H4XqdWFbmnTvtMUM7ZxLSmnCZO6ScL8Qy4GZeia9Li82G63RPfhb47vHMc0lLlKhZlD4UTVgjJ/Fey/f517k+r85EMF+yQFIxT4CFxMcij7PMWDSm2RgNWsLHBTscn6H3dOLGysV04Xhd9ogP7jnyN0SR6Pj+kKIYJeF6BdhYRIBuDa46cn4EZhX7RY6lLCTf9Fl1GtggQ4tKGYceAd578DS5LG3NBApJq+ItdxFyKAPOqoh9twVH3MqAw8pil1xFlHn2JSHtlcsG/49NGXBYWV4r6JdNzjiTAadVgfVaWoVIvMxgOFX7ivAZ0IWwa3Ff7OzLgPNKzgnnFGtCh2NreVdeJ5yS4jAtAbrsaErjHxBDBvKvwB3gOLBeWth8zJCpeC5mhzcuVWyDT2othhcygOiU2medwfEoVEpz1ioVbLfwjcqoaURqrZx0dnWGXn8KTBb8A31C/2cT3/wMAAAAAElFTkSuQmCC'
    },
    message: {
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

const WhatsAppModel = mongoose.model('whatsapp', WhatsAppSchema, 'whatsapps');
export default WhatsAppModel;
