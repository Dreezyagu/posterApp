import jwt from 'jsonwebtoken';

const { verify } = jwt;

export default (req, res, next) => {
    const header = req.get('Authorization')
    if (!header) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        throw error;
    }
    const token = header.split(' ')[1]
    let decodedToken;

    try {
        decodedToken = verify(token, 'somesupersecretsecret')
    } catch (_) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        throw error;
    }

    if (!decodedToken) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        throw error;
    }
    req._id = decodedToken._id
    next()
}