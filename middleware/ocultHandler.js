const ocultarInfo = (req, res, next) => {
    console.log(`---> Middleware::ocultar informacion`);
    const result = res.body;

    //Eliminar contraseña y active de la respuesta
    const result2 = JSON.parse(JSON.stringify(result));
    delete result2["password"];
    delete result2["active"];
    res.status(200).json(result2);
}

export default {
    ocultarInfo,
}