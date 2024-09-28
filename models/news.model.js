// models/NewsModel.js
import mongoose from 'mongoose';
import slugify from 'slugify';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  author: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  insert: { type: Date, default: Date.now },
  update: { type: Date, default: Date.now },
});

newsSchema.pre('validate', async function(next) {
  if (this.isNew || this.isModified('title')) {
    // Generar el slug básico
    let slug = slugify(this.title, { lower: true, strict: true });

    // Verificar si el slug ya existe
    let slugExists = await this.constructor.findOne({ slug });

    let suffix = 2;

    // Si existe, agregar un sufijo numérico hasta que sea único
    while (slugExists) {
      const newSlug = `${slug}-${suffix}`;
      slugExists = await this.constructor.findOne({ slug: newSlug });
      if (!slugExists) {
        slug = newSlug;
        break;
      }
      suffix++;
    }

    this.slug = slug;
  }
  next();
});

// Middleware pre-findOneAndUpdate para operaciones de actualización directa
newsSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  
  // Verificar si el campo 'title' está siendo actualizado
  if (update.title) {
    // Generar el slug básico
    let slug = slugify(update.title, { lower: true, strict: true });

    // Verificar si el slug ya existe, excluyendo el documento actual
    let slugExists = await this.model.findOne({ slug, _id: { $ne: this.getQuery()._id } });

    let suffix = 2;

    // Si existe, agregar un sufijo numérico hasta que sea único
    while (slugExists) {
      const newSlug = `${slug}-${suffix}`;
      slugExists = await this.model.findOne({ slug: newSlug, _id: { $ne: this.getQuery()._id } });
      if (!slugExists) {
        slug = newSlug;
        break;
      }
      suffix++;
    }

    // Asignar el slug generado al objeto de actualización
    this.setUpdate({ ...update, slug });
  }

  // Actualizar la fecha de modificación
  this.setUpdate({ ...this.getUpdate(), update: new Date() });

  next();
});

const NewsModel = mongoose.model('News', newsSchema);

export default NewsModel;
