const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path');
const { RSA_NO_PADDING, DH_CHECK_P_NOT_SAFE_PRIME } = require('constants');

const PORT = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

fs.open('./data/users.json', "r", (err, data) => {
});

function readTheFile(_filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(`${_filePath}`, 'utf-8', (err, data) => {
            if (err) throw err
            resolve(JSON.parse(data));
            reject(err);
        })
    })
}

// ------------------------------------ LOGIN - USER ------------------------------------

app.post("/login", async (req, res) => {
    const { userLogin } = req.body;

    let user_login;
    let data_USER = {
        user: 0,
        cart: [],
        wishlist: [],
        history: []
    }
    readTheFile("./data/users.json")
        .then(result => {
            user = result.filter(profile => {
                return profile.email == userLogin.email && profile.password === userLogin.password
            })

            data_USER.user = user[0].id

            if (user.length == 0) {
                return reject([]);
            }
            return result
        })
        .then(result => {
            readTheFile("./data/cart.json")
                .then(result => {
                    data = result.filter((element) => element.delete === false && (element.id === user[0].id));

                    data_USER = {
                        ...data_USER,
                        cart: data
                    }
                });
            return data_USER
            // fs.readFile("./data/cart.json", 'utf-8', (err, data) => {
            //     if (err) throw err
            //     data_USER.cart = JSON.parse(data).filter((element) => element.delete === false && (element.id === user[0].id))
            //     console.log("CART")
            //     console.log(data_USER)
            //     return data_USER
            // })
        })
        .then(result => {
            readTheFile("./data/wishlist.json")
                .then(result => {
                    data = result.filter((element) => element.delete === false && (element.id === user[0].id));

                    data_USER = {
                        ...data_USER,
                        wishlist: data
                    }
                });
            return data_USER
            // fs.readFile("./data/wishlist.json", 'utf-8', (err, data) => {
            //     if (err) throw err
            //     data_USER.wishlist = JSON.parse(data).filter((element) => element.delete === false && (element.id === user[0].id))
            //     console.log("WISHLIST")
            //     console.log(data_USER)
            //     return data_USER
            // })
        })
        .then(result => {
            readTheFile("./data/history.json")
                .then(result => {
                    data = result.filter((element) => element.delete === false && (element.id === user[0].id));
                    data_USER = {
                        ...data_USER,
                        history: data
                    }
                });
            return data_USER
            // fs.readFile("./data/history.json", 'utf-8', (err, data) => {
            //     if (err) throw err
            //     data_USER.history = JSON.parse(data).filter((element) => element.delete === false && (element.id === user[0].id))
            //     console.log("HISTORY")
            //     console.log(data_USER)
            //     return data_USER
            // })
            // return data_USER
        })
        .then(result => {
            console.log(data_USER)
            res.send(data_USER)
        })
        .catch(erro => res.status(500).json({ message: erro.message }))
});

// ------------------------------------ REGISTER - USER ------------------------------------
app.post("/login/signup", async (req, res) => {
    const { userSignUp } = req.body;
    userSignUp.delete = false;

    let user;
    readTheFile("./data/users.json")
        .then(result => {
            user = result.filter(profile => {
                return profile.email === userSignUp.email
            });

            if (user.length !== 0) {
                return res.send([]);
            }
            return result;
        })
        .then(result => {
            let data = result;
            userSignUp.id = data.length;
            let newList = data.concat(userSignUp);

            fs.writeFile("./data/users.json", `${JSON.stringify(newList)}`, () => {

            });

            return res.send("Cadastro feito com sucesso.");
        })
        .catch(erro => res.status(500).json({ message: erro.message }))
});

// ------------------------------------ CART - ADD ------------------------------------
app.post("/cart", async (req, res) => {
    const { CartMovie } = req.body;
    const { user } = req.body;

    const data_USER = [{
        id: user,
        data: CartMovie,
        delete: false
    }]

    readTheFile("./data/cart.json")
        .then(result => result.concat(data_USER))
        .then(result => {
            fs.writeFile("./data/cart.json", `${JSON.stringify(result)}`, () => {
            });
            return res.send("Carrinho atualizado");
        })
        .catch(erro => res.status(500).json({ message: erro.message }))
});

// ------------------------------------ CART - DELETE  ------------------------------------
app.post("/cart/remove", async (req, res) => {
    const { CartMovie } = req.body;
    const { user } = req.body;

    const data_USER = {
        id: user,
        data: CartMovie,
        delete: true
    }

    readTheFile("./data/cart.json")
        .then(result => {
            const data = result.filter((element) => {
                return element.id !== data_USER.id
            })
            return data.concat(data_USER)
        })
        .then(result => {
            fs.writeFile("./data/cart.json", `${JSON.stringify(result)}`, () => {

            });
            return res.send("Carrinho atualizado");
        })
        .catch(erro => res.status(500).json({ message: erro.message }))
});

// ------------------------------------ WISHLIST - ADD  ------------------------------------
app.post("/wishList", async (req, res) => {
    const { wishList } = req.body;
    const { user } = req.body;

    const data_USER = {
        id: user,
        data: wishList,
        delete: false
    }

    readTheFile("./data/wishlist.json")
        .then(result => result.concat(data_USER))
        .then(result => {
            fs.writeFile("./data/wishlist.json", `${JSON.stringify(result)}`, () => {

            });
            return res.send("wishList atualizada");
        })
        .catch(erro => res.status(500).json({ message: erro.message }))
});


// ------------------------------------ WISHLIST - REMOVE  ------------------------------------
app.post("/wishList/remove", async (req, res) => {
    const { wishList } = req.body;
    const { user } = req.body;

    const data_USER = {
        id: user,
        data: wishList,
        delete: true
    }

    readTheFile("./data/wishlist.json")
        .then(result => {
            const data = result.filter((element) => {
                return element.id !== data_USER.id
            })
            return data.concat(data_USER)
        })
        .then(result => {
            fs.writeFile("./data/wishlist.json", `${JSON.stringify(result)}`, () => {

            });
            return res.send("wishlist atualizado");
        })
        .catch(erro => res.status(500).json({ message: erro.message }))
});


// ------------------------------------ HISTORY - ADD  ------------------------------------
app.post("/history", async (req, res) => {
    const { moviesOnHistory } = req.body;
    const { user } = req.body;

    const data_USER = {
        id: user,
        data: moviesOnHistory,
        delete: false
    }

    readTheFile("./data/history.json")
        .then(result => result.concat(data_USER))
        .then(result => {
            fs.writeFile("./data/history.json", `${JSON.stringify(result)}`, () => {
            });
            return res.send("history atualizada");
        })
        .catch(erro => res.status(500).json({ message: erro.message }))
});

// ------------------------------------ HISTORY - REMOVE  ------------------------------------
app.post("/history/remove", async (req, res) => {
    const { moviesOnHistory } = req.body;
    const { user } = req.body;

    const data_USER = {
        id: user,
        data: moviesOnHistory,
        delete: true
    }

    readTheFile("./data/history.json")
        .then(result => {
            const data = result.filter((element) => {
                return element.id !== data_USER.id
            })
            return data.concat(data_USER)
        })
        .then(result => {
            fs.writeFile("./data/history.json", `${JSON.stringify(result)}`, () => {
            });
            return res.send("history atualizado");
        })
        .catch(erro => res.status(500).json({ message: erro.message }))
});



// -----------------------------------------------------------------------------------------------------//
app.listen(process.env.PORT || PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});
