// controllers/associates.controller.js

import AssociateModel from '../models/associate.mode.js';

// Obtener todos los asociados activos
export const getAssociatesActive = async () => {
  try {
    const associates = await AssociateModel.find({ active: true });
    return associates;
  } catch (err) {
    console.error(err);
    throw new Error('Error al obtener los asociados');
  }
};

// Obtener todos los asociados (incluyendo inactivos)
export const getAssociates = async (req, res) => {
  try {
    const associates = await AssociateModel.find();
    // Añadir el prefijo a cada imagen antes de enviar la respuesta
    const updatedAssociates = associates.map(associate => ({
      ...associate._doc,
      urlImage: associate.urlImage ? `/images/associates/${associate.urlImage}` : null
    }));

    res.json({
      success: true,
      data: updatedAssociates,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los asociados'
    });
  }
};

// Alternar el estado activo de un asociado
export const toggleAssociateStatus = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const associate = await AssociateModel.findByIdAndUpdate(id, { active }, { new: true });
    if (!associate) {
      return res.status(404).json({ success: false, error: 'Asociado no encontrado' });
    }

    res.json({ success: true, data: associate });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estado del asociado'
    });
  }
};

// Agregar un nuevo asociado
export const addAssociate = async (req, res) => {
  try {
    const { name, type, urlImage } = req.body;
    if (!name || !type || (type === 'Company' && !urlImage)) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const date = new Date();
    const newAssociate = new AssociateModel({
      name,
      type,
      urlImage: type === 'Company' ? urlImage : null,
      active: true,
      insert: date,
      update: date
    });

    await newAssociate.save();

    return res.status(201).json({
      success: true,
      message: 'Associate created successfully',
      associate: newAssociate
    });
  } catch (error) {
    console.error('Error creating associate:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Obtener un asociado por ID
export const getAssociate = async (req, res) => {
  try {
    const associate = await AssociateModel.findById(req.params.id);
    if (!associate) {
      return res.status(404).json({ success: false, message: 'Associate not found' });
    }
    res.json({ success: true, associate });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Actualizar un asociado por ID
export const updateAssociate = async (req, res) => {
  const { id } = req.params;
  const { name, type, urlImage } = req.body;

  try {
    const date = new Date();
    const updateData = {
      name,
      type,
      update: date
    };

    if (type === 'Company') {
      updateData.urlImage = urlImage;
    } else {
      updateData.urlImage = null;
    }

    const updatedAssociate = await AssociateModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedAssociate) {
      return res.status(404).json({
        success: false,
        message: 'Associate not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Associate updated successfully',
      associate: updatedAssociate
    });
  } catch (error) {
    console.error('Error updating associate:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
