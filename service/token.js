import jwt from 'jsonwebtoken';

const generateJWT = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.SECRET_CODE_JWT, {
		expiresIn: '30d',
	});

	return accessToken;
};

export default generateJWT;
