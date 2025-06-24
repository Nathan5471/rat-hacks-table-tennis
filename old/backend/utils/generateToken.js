import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const generateToken = (userId) => {
    dotenv.config();
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '14d',
    });
    return token;
}

export default generateToken;