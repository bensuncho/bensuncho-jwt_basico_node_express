const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("./configs/config");

app = express();

app.set("llave", config.llave);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(3000, () => console.log("servidor iniciado en el puerto 3000"));

app.get("/", function (req, res) {
  res.send("ok");
});

app.post("/autenticar", (req, res) => {
  if (req.body.user === "bensuncho" && req.body.password == "qwerty") {
    const payload = {
      check: true,
    };
    const token = jwt.sign(payload, app.get("llave"), { expiresIn: 1440 });
    res.json({
      mensaje: "Autenticacion correcta",
      token: token,
    });
  } else {
    res.json({ mensaje: "Usuario o contraseña incorrectos" });
  }
});

const rutasPortegidas = express.Router();

rutasPortegidas.use((req, res, next) => {
  const token = req.headers["access-token"];
  if (token) {
    jwt.verify(token, app.get("llave"), (err, decoded) => {
      if (err) {
        return res.json({ mensaje: "Token Invalida" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.send({
      mensaje: "token no entregado",
    });
  }
});

app.get("/datos", rutasPortegidas, (req, res) => {
  const datos = [
    { nombre: "Armando", correo: "aa@gmail.com" },
    { nombre: "Milena", correo: "mm@gmail.com" },
    { nombre: "Patricia", correo: "p@gmail.com" },
  ];
  res.json(datos);
});
