const db = require('../models');
const Catalogtypes = db.catalogtypes;
const Catalog = db.catalog;

const Op = db.Sequelize.Op;

exports.save = async (req, res) => {
    //name, code
    let catalogtypes = req.body;
    try {
        let data;
        if (catalogtypes.id) {
            data = await Catalogtypes.update(catalogtypes, { where: { id: catalogtypes.id } });
            if (dat === 1) {
                res.json({
                    message: "Category was update successfully!"
                });
            } else {
                res.json({
                    message: `Cannot update with id=${catalogtypes.id}!`
                });
            }
        } else {
            if (!await Catalogtypes.findAll({ where: { code: catalogtypes.code, name: catalogtypes.name } })) {
                res.json({
                    message: "Category was exists!"
                });
            } else {
                data = await Catalogtypes.create(catalogtypes);
                res.json(data);
            }
        }
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while saving the category."
        });
    }
}

exports.delete = async (req, res) => {
    let id = req.params.id;
    try {
        let data = await Catalogtypes.destroy({ where: { id: id } });
        if (data == 1) {
            res.json({
                message: "Category was deleted successfully!"
            });
        } else {
            res.json({
                message: `Cannot delete Tutorial with id=${id}!`
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Could not delete Category with id=" + id
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        res.json(await Catalogtypes.findAll({
            attributes: ['type'],
            include: Catalog
        }));
    } catch (error) {
        res.status(500).json({
            message:
                error.message || "Some error occurred while retrieving catalog type."
        });
    }
}