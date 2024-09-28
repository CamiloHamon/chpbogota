// utils/generateUniqueSlug.js
import slugify from 'slugify';
import NewsModel from '../models/news.model.js';

const generateUniqueSlug = async (title) => {
  // Generar el slug básico
  let slug = slugify(title, {
    lower: true,
    strict: true, // Eliminar caracteres especiales
  });

  // Verificar si el slug ya existe
  let slugExists = await NewsModel.findOne({ slug });

  let suffix = 2;

  // Si existe, agregar un sufijo numérico hasta que sea único
  while (slugExists) {
    const newSlug = `${slug}-${suffix}`;
    slugExists = await NewsModel.findOne({ slug: newSlug });
    if (!slugExists) {
      slug = newSlug;
      break;
    }
    suffix++;
  }

  return slug;
};

export default generateUniqueSlug;
