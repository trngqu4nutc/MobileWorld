const express = require("express");
const bodyParser = require("body-parser");
// const cors = require("cors");

//Import route
const signRoute = require("./app/routes/auth.route");
const userRoute = require("./app/routes/user.route");
const catalogtypes = require("./app/routes/catalogtypes.route");
const catalog = require("./app/routes/catalog.route");
const catalogbrands = require("./app/routes/catalogbrands.route");
const login = require("./app/routes/login.route");
const basket = require("./app/routes/basket.route");
const bill = require("./app/routes/bill.route");
const history = require("./app/routes/history.route");

const app = express();

// var corsOptions = {
//     origin: "http://localhost:3000"
// };

// app.use(cors(corsOptions));

app.use(express.static("app/public"))

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// const db = require("./app/models");
// const Role = db.role;
// const Catalogtypes = db.catalogtypes;
// const CatalogBrands = db.catalogbrands;
// db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
//     initial();
// });


app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, id, Content-Type, Accept"
    );
    next();
});

// app.use(function (req, res, next) {
//     res.header(
//         "Access-Control-Allow-Headers",
//         "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
// });

app.use("/api/login", signRoute);

app.use("/api", userRoute);

app.use("/api/catalogtypes", catalogtypes);

app.use("/api/catalog", catalog);

app.use("/api/catalogbrands", catalogbrands);

app.use("/api/login", login);

app.use("/api/basket", basket);

app.use("/api/bill", bill);

app.use("/api/history", history);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}.`);
});

// function initial() {
//     Role.create({ id: 1, name: "user" });
//     Role.create({ id: 2, name: "admin" });
//     Catalogtypes.create({ type: "Điện thoại" });
//     Catalogtypes.create({ type: "Laptop" });
//     CatalogBrands.create({ brand: "OPPO" });
//     CatalogBrands.create({ brand: "LENOVO" });
// };


