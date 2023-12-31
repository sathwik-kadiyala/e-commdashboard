const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require("./db/config");
const User = require('./db/User');
const Product = require("./db/Product")
// const Jwt = require('jsonwebtoken');
// const jwtKey = 'e-com';
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
    resp.send("use routes to GET")
})

app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    // Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    //     if (err) {
    //         resp.send("Something went wrong")
    //     }

        resp.send(result)
   // })
})

app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            // Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
            //     if (err) {
            //         resp.send("Something went wrong")
            //     }
                resp.send(user)
           //})
        } else {
            resp.send({ result: "No User found" })
        }
    } else {
        resp.send({ result: "Enter Details." })
    }
});

app.post("/add-product", async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
});

app.get("/products",  async (req, resp) => {
    const products = await Product.find();
    if (products.length > 0) {
        resp.send(products)
    } else {
        resp.send({ result: "No Product found" })
    }
});

app.delete("/product/:id",  async (req, resp) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result)
}),

app.get("/product/:id", async (req, resp) => {
        let result = await Product.findOne({ _id: req.params.id })
        if (result) {
            resp.send(result)
        } else {
            resp.send({ "result": "No Record Found." })
        }
 })



app.put("/product/:id",async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    resp.send(result)
});

app.get("/search/:key", async (req, resp) => {
    let result = await Product.find({
        "$or": [
            {
                name: { $regex: req.params.key }
            },
            {
                price: { $regex: req.params.key }
            },
            {
                category: { $regex: req.params.key }
            }
        ]
    });
    resp.send(result);
})
// function verifyToken(req, res, next) {
//     let token = req.header['authorization'];
//     if (token) {
//         token = token.split(' ')[1];
//         Jwt.verify(token, jwtKey, (err, valid) => {
//             if (err) {
//                 res.status(401).send({ result: "Please provide valid token." });
//             }
//             else {
//                 next();
//             }
//         })
//     }
//     else {
//         res.status(403).send({ result: "Please add token with header." });
//     }
// }

app.listen(5000);