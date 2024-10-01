import LinkModel from '../models/link.model.js';

// Obtener todos los enlaces de interés activos
export const getLinksActive = async (req, res) => {
  try {
    const links = await LinkModel.find({ active: true });
    res.json({
      success: true,
      data: links
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los enlaces de interés'
    });
  }
};

// Obtener todos los enlaces de interés (incluyendo inactivos)
export const getLinks = async (req, res) => {
  try {
    const links = await LinkModel.find();
    // Añadir el prefijo a cada imagen antes de enviar la respuesta
    const updatedLinks = links.map(link => ({
      ...link._doc, // Si estás usando Mongoose, extrae los datos del documento
      urlImage: `/images/links/${link.urlImage}`
    }));

    res.json({
      success: true,
      data: updatedLinks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los enlaces de interés'
    });
  }
};

// Alternar el estado activo de un enlace de interés
export const toggleLinkStatus = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const link = await LinkModel.findByIdAndUpdate(id, { active }, { new: true });
    if (!link) {
      return res.status(404).json({ success: false, error: 'Enlace de interés no encontrado' });
    }

    res.json({ success: true, data: link });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estado del enlace de interés'
    });
  }
};

// Agregar un nuevo enlace de interés
export const addLink = async (req, res) => {
  try {
    // Asegúrate de que los campos se reciben correctamente
    const { name, url, urlImage } = req.body;
    // Verificar si todos los campos requeridos están presentes
    if (!name || !url || !urlImage) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const date = new Date();
    // Crear una nueva instancia del modelo
    const newLink = new LinkModel({
      name,
      url,
      urlImage,
      active: true,
      insert: date,
      update: date
    });

    // Guardar en la base de datos
    await newLink.save();

    return res.status(201).json({
      success: true,
      message: 'Enlace de interés creado exitosamente',
      link: newLink
    });
  } catch (error) {
    console.error('Error al crear el enlace de interés:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener un enlace de interés por ID
export const getLink = async (req, res) => {
  try {
    const link = await LinkModel.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ success: false, message: 'Enlace de interés no encontrado' });
    }
    res.json({ success: true, link });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Actualizar un enlace de interés por ID
export const updateLink = async (req, res) => {
  const { id } = req.params;
  const { name, url, urlImage } = req.body;

  try {
    // Buscar y actualizar el enlace de interés por ID
    const date = new Date();
    const updatedLink = await LinkModel.findByIdAndUpdate(
      id, // ID del enlace de interés que vamos a actualizar
      {
        name,
        url,
        urlImage,
        update: date
      },
      { new: true } // Retornar el documento actualizado
    );

    // Si no se encuentra el documento, retornar un error 404
    if (!updatedLink) {
      return res.status(404).json({
        success: false,
        message: 'Enlace de interés no encontrado'
      });
    }

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: 'Enlace de interés actualizado con éxito',
      link: updatedLink
    });
  } catch (error) {
    console.error('Error al actualizar el enlace de interés:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
