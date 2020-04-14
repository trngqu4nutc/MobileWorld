const db = require('../models');
const CatalogBrands = db.catalogbrands;

exports.save = async (req, res) => {
    //brand
    let brand = req.body.brand;
    try {
        let data;
        if (req.body.id) {
            data = await CatalogBrands.update({ brand: brand }, { where: { id: req.body.id } });
            if (data == 1) {
                res.json({
                    message: "CatalogBrands was update successfully!"
                });
            } else {
                res.json({
                    message: `Cannot update with id=${req.body.id}!`
                });
            }
        }else{
            let data = CatalogBrands.findAll({ where: { brand: brand } });
            if(data.length >= 1){
                res.json({
                    message: "Brand was exists!"
                });
            }else{
                res.json(await CatalogBrands.create({ brand: brand }))
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
        let data = CatalogBrands.destroy({ where: { id: id } });
        if(data == 1){
            res.json({
                message: "Brand was deleted successfully!"
            });
        }else{
            res.json({
                message: `Can not delete Brand with id = ${id}`
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Could not delete Brand with id=" + id
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        res.json(await CatalogBrands.findAll({
            attributes: ['brand']
        }));
    } catch (error) {
        res.status(500).json({
            message:
                error.message || "Some error occurred while retrieving brand."
        });
    }
}