const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path');
const { RSA_NO_PADDING } = require('constants');

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

app.post("/login", async (req, res) => {
    const { userLogin } = req.body;
    let user;

    readTheFile("./data/users.json")
        .then(result => {
            user = result.filter(profile => {
                return profile.email == userLogin.email && profile.password === userLogin.password
            })
            console.log(result);

            if (user.length == 0) {
                return res.send([]);
            }
            return res.send(user);
        })
        .catch(erro => res.status(500).json({ message: erro.message }))
});

app.post("/login/signup", async (req, res) => {
    const { userSignUp } = req.body;
    console.log("--------------------tentativa de cadastro--------------------");
    console.log(userSignUp);

    let user;
    readTheFile("./data/users.json")
        .then(result => {
            user = result.filter(profile => {
                return profile.email === userSignUp.email
            });

            if (user.length !== 0) {
                console.log("o e-mail já consta");
                return res.send([]);
            }
            return result;
        })
        .then(result => {
            let data = result;

            let newList = data.concat(userSignUp);
            fs.writeFile("./data/users.json", `${JSON.stringify(newList)}`, () => {
            });

            return res.send("Cadastro feito com sucesso.");
        })
        .catch(erro => res.status(500).json({ message: erro.message }))
});



// -----------------------------------------------------------------------------------------------------//
app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});
