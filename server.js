const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("./database.json");
const userdb = JSON.parse(fs.readFileSync("./users.json", "UTF-8"));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());

const SECRET_KEY = "123456789";

const expiresIn = "24h";

// cors
server.use(
    cors({
        origin: true,
        credentials: true,
        preflightContinue: false,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
);
server.options("*", cors());

// Create a token from a payload
function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify the token
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) =>
        decode !== undefined ? decode : err
    );
}

// Check if the user exists in database
function isAuthenticated({ name, password }) {
    return (
        userdb.findIndex(
            (user) => user.name === name && user.password === password
        ) !== -1
    );
}

// Register New User
server.post("/auth/register", (req, res) => {
    console.log("register endpoint called; request body:");
    const { name, password, address, phone_number } = req.body;
    const join_date = new Date();

    if (
        req.headers.authorization === undefined ||
        req.headers.authorization.split(" ")[0] !== "Bearer"
    ) {
        const status = 401;
        const message = "Error in authorization format";
        res.status(status).json({ status, message });
        return;
    }

    if (isAuthenticated({ name, password }) === true) {
        const status = 401;
        const message = "Account already exist";
        res.status(status).json({ status, message });
        return;
    }

    fs.readFile("./users.json", (err, data) => {
        if (err) {
            const status = 401;
            const message = err;
            res.status(status).json({ status, message });
            return;
        }

        // Get current users data
        var data = JSON.parse(data.toString());

        // Get the id of last user
        var last_item_id = data[data.length - 1].id;

        //Add new user
        data.push({
            id: last_item_id + 1,
            name: name,
            password: password,
            address: address,
            join_date: join_date,
            phone_number: phone_number,
        }); //add some data
        var writeData = fs.writeFile(
            "./users.json",
            JSON.stringify(data),
            (err, result) => {
                // WRITE
                if (err) {
                    const status = 401;
                    const message = err;
                    res.status(status).json({ status, message });
                    return;
                }
            }
        );
    });

    // Create token for new user
    const access_token = createToken({
        name,
        password,
        address,
        join_date,
        phone_number,
    });
    const message = "Register success!";
    console.log(message);
    res.status(200).json({ message });
});

// Login to one of the users from ./users.json
server.post("/auth/login", (req, res) => {
    console.log("login endpoint called; request body:");
    const { name, password } = req.body;
    const rewriteUserdb = JSON.parse(fs.readFileSync("./users.json", "UTF-8"));
    const findUser = rewriteUserdb.find(
        (x) => x.name === name && x.password === password
    );
    const isAuth =
        rewriteUserdb.findIndex(
            (user) => user.name === name && user.password === password
        ) !== -1;
    if (isAuth === false) {
        const status = 401;
        const message = "Incorrect name or password";
        res.status(status).json({ status, message });
        return;
    }
    const { name: username, address, join_date, phone_number } = findUser;
    const access_token = createToken({
        name: username,
        address,
        join_date,
        phone_number,
    });
    console.log("Access Token:" + access_token);
    res.status(200).json({ access_token });
});

// add product
server.post("/products", (req, res, next) => {
    console.log(req.headers);
    if (
        req.headers.authorization === undefined ||
        req.headers.authorization.split(" ")[0] !== "Bearer"
    ) {
        const status = 401;
        const message = "Error in authorization format";
        res.status(status).json({ status, message });
        return;
    }
    try {
        let verifyTokenResult;
        verifyTokenResult = verifyToken(
            req.headers.authorization.split(" ")[1]
        );

        if (verifyTokenResult instanceof Error) {
            const status = 401;
            const message = "Access token not provided";
            res.status(status).json({ status, message });
            return;
        }
        next();
    } catch (err) {
        const status = 401;
        const message = "Error access_token is revoked";
        res.status(status).json({ status, message });
    }
});

// delete product
server.delete("/products/:id", (req, res, next) => {
    if (
        req.headers.authorization === undefined ||
        req.headers.authorization.split(" ")[0] !== "Bearer"
    ) {
        const status = 401;
        const message = "Error in authorization format";
        res.status(status).json({ status, message });
        return;
    }
    try {
        let verifyTokenResult;
        verifyTokenResult = verifyToken(
            req.headers.authorization.split(" ")[1]
        );

        if (verifyTokenResult instanceof Error) {
            const status = 401;
            const message = "Access token not provided";
            res.status(status).json({ status, message });
            return;
        }
        next();
    } catch (err) {
        const status = 401;
        const message = "Error access_token is revoked";
        res.status(status).json({ status, message });
    }
});

// update product
server.put("/products/:id", (req, res, next) => {
    if (
        req.headers.authorization === undefined ||
        req.headers.authorization.split(" ")[0] !== "Bearer"
    ) {
        const status = 401;
        const message = "Error in authorization format";
        res.status(status).json({ status, message });
        return;
    }
    try {
        let verifyTokenResult;
        verifyTokenResult = verifyToken(
            req.headers.authorization.split(" ")[1]
        );

        if (verifyTokenResult instanceof Error) {
            const status = 401;
            const message = "Access token not provided";
            res.status(status).json({ status, message });
            return;
        }
        next();
    } catch (err) {
        const status = 401;
        const message = "Error access_token is revoked";
        res.status(status).json({ status, message });
    }
});

// server.use(/^(?!\/auth).*$/,  (req, res, next) => {
//   if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
//     const status = 401
//     const message = 'Error in authorization format'
//     res.status(status).json({status, message})
//     return
//   }
//   try {
//     let verifyTokenResult;
//      verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

//      if (verifyTokenResult instanceof Error) {
//        const status = 401
//        const message = 'Access token not provided'
//        res.status(status).json({status, message})
//        return
//      }
//      next()
//   } catch (err) {
//     const status = 401
//     const message = 'Error access_token is revoked'
//     res.status(status).json({status, message})
//   }
// })

server.use(router);
const port = 8000;
server.listen(port, () => {
    console.log("Server listening on port " + port);
});
