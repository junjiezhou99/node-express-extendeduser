import HttpError from "http-errors";
import userModel from '../models/usersModel.js'
import bcrypt from 'bcrypt';
import messagesapp from "../data/messages.js";
import messageuser from "../data/messagesusr.js"
import noticesModel from "../models/noticesModel.js";

const ocultarInfo = (info) => {
    console.log(`---> Middleware::ocultar informacion`);

    //Eliminar contraseña y active de la respuesta
    const result2 = JSON.parse(JSON.stringify(info));
    delete result2["password"];
    delete result2["active"];
    return result2;
}

const register = (req, res, next) => {
    console.log(`---> userController::register`);

    try {
        const body = req.body;
        let result;
        console.log(`---> userController::register ${body.password}`);
        const user = { username: body.username, password: body.password, timestamp: (body.timestamp || 0) , active: (body.avtive || 1)};

        result = userModel.getUser(user);
        if (result != undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            result = userModel.createUser(user);
            if (result < 0)
                next(HttpError(400, { message: messagesapp.user_error_register }))

            const result2 = ocultarInfo(result);
            res.status(200).json(result2);
        }

    } catch (error) {
        next(error);
    }

};

const login = (req, res, next) => {
    console.log(`---> userController::login`);

    try {
        const body = req.body;
        const user = { username: body.username, password: body.password };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            console.log(`---> userController::login ${result.password}`);
            console.log(`---> userController::login ${body.password}`);

            if (!result.active){
                next(HttpError(400, { message: messagesapp.user_error_active}));
            }else{

                if (!bcrypt.compareSync(body.password, result.password))
                    next(HttpError(400, { message: messagesapp.user_error_login }));
                else{
                    const result2 = ocultarInfo(result);

                    //Añadir mensaje de logueado correctamente
                    result2.message = messageuser.user_msg_login;
                    
                    //Comprobar si hay usuario con noticias
                    const userNotice = noticesModel.getNotice(result);

                    if (userNotice){
                        result2.notices = userNotice.notices;
                    }
                    res.status(200).json(result2);
                }   
            }
        }

    } catch (error) {
        next(error);
    }
};

const updatePassword = (req, res, next) => {
    console.log(`---> userController::updatePassword`);

    try {
        const body = req.body;
        const user = { username: body.username, password: body.password, newpassword: body.newpassword };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            if (!bcrypt.compareSync(body.password, result.password))
                next(HttpError(400, { message: messagesapp.user_error_login  }));
            else {
                const result_new = userModel.updatePassword(user);
                const result2 = ocultarInfo(result_new);
                res.status(200).json(result2);
            }

        }

    } catch (error) {
        next(error);
    }
};


const addGrantPrivileges = (req, res, next) => {
    console.log(`---> userController::addGrantPrivileges`);

    try {
        const body = req.body;
        const user = { username: body.username, grants: body.grants };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userModel.addGrantPrivileges(user);
            const result2 = ocultarInfo(result_new);
            res.status(200).json(result2);
        }
    } catch (error) {
        next(error);
    }
};


const insertGrantPrivileges = (req, res, next) => {
    console.log(`---> userController::insertGrantPrivileges`);

    try {
        const body = req.body;
        const user = { username: body.username, grants: body.grants };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userModel.insertGrantPrivileges(user);
            const result2 = ocultarInfo(result_new);
            res.status(200).json(result2);
        }
    } catch (error) {
        next(error);
    }
};



const deleteGrantPrivileges = (req, res, next) => {
    console.log(`---> userController::deleteGrantPrivileges`);

    try {
        const body = req.body;
        const user = { username: body.username, grants: body.grants };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userModel.deleteGrantPrivileges(user);
            const result2 = ocultarInfo(result_new);
            res.status(200).json(result2);
        }
    } catch (error) {
        next(error);
    }
};

const getUser = (req, res, next) => {
    console.log(`---> userController::getUser`);

    try {
        console.log(req.params.user)
        const user = req.params.user;
        const result = userModel.getUser({username:user});
        
        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result2 = ocultarInfo(result);
            res.status(200).json(result2);
        }
    } catch (error) {
        next(error);
    }
};

const deleteUser = (req, res, next) => {
    console.log(`---> userController::dropUser`);

    try {
        const body = req.body;
        const user = { username: body.username };
        const result = userModel.getUser(user);
       

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userModel.dropUser(user);
            const result2 = ocultarInfo(result_new);
            res.status(200).json(result2);
        }
    } catch (error) {
        next(error);
    }
};


const activeUser = (req, res, next) => {
    console.log(`---> userController::activeUser`);

    try {
        const body = req.body;
        const user = { username: body.username };
        const result = userModel.getUser(user);
       
        if (result === undefined) {
            next(HttpError(400, {message: messagesapp.user_error_username }));
        } else {
            const result_new = userModel.raiseUser(user);
            const result2 = ocultarInfo(result_new);
            res.status(200).json(result2);
        }
    } catch (error) {
        next(error);
    }
};

const getFullUser = (req, res, next) => {
    console.log(`---> userController::getFullUser`);

    try {
        const result = userModel.getUser(req.body);

        if (result === undefined) {
            next(HttpError(400, {message: messagesapp.user_error_username }));
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        next(error);
    }
}

const dataProfile = (req, res, next) => {
    console.log(`---> userController::dataProfile`);

    try {
        const result = userModel.dataProfile(req.body);

        if (result === undefined) {
            next(HttpError(400, {message: messagesapp.user_error_username }));
        } else {
            const result2 = ocultarInfo(result);
            result2.message = messageuser.user_msg_addprofiledata;
            res.status(200).json(result2);
        }
    } catch (error) {
        next(error);
    }
}


export default {
    register,
    login,
    updatePassword,
    addGrantPrivileges,
    deleteGrantPrivileges,
    insertGrantPrivileges,
    getUser,
    deleteUser,
    activeUser,
    getFullUser,
    dataProfile,
}