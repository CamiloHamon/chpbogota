import express from 'express';

import AssociateModel from '../../models/associate.mode.js'

const router = express.Router();

// Página de asociados
router.get('/', async (req, res) => {
    try {
        // Obtener empresas activas
        const companies = await AssociateModel.find({ type: 'Company', active: true });
        
        const finalCompanies = companies.map(company => ({
            ...company._doc,
            urlImage: `/images/associates/${company.urlImage}`
          }))

        // Obtener personas naturales activas
        const naturalPersons = await AssociateModel.find({ type: 'Natural Person', active: true }).lean();

        res.render('public/associates', {
            layout: 'main',
            title: 'Asociados',
            companies: finalCompanies,
            activePage: 'associates',
            naturalPersons
        });
    } catch (error) {
        console.error('Error al obtener los asociados:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;