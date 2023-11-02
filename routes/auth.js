import { Router } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import loginMid from '../middleware/login.js';
import generateJWT from '../service/token.js';

const router = Router();

router.get('/login', loginMid, (req, res) => {
	res.render('login', {
		title: 'Login || My Shop',
		isOnLogin: true,
		loginError: req.flash('loginError'),
	});
});
router.get('/logout', (req, res) => {
	res.clearCookie('token');
	res.redirect('/');
});
router.get('/register', loginMid, (req, res) => {
	res.render('register', {
		title: 'Register || My Shop',
		isOnRegister: true,
		registerError: req.flash('registerError'),
	});
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		req.flash('loginError', 'All fields is required!');
		res.redirect('/login');
		return;
	}

	const existUser = await User.findOne({ email });

	if (!existUser) {
		req.flash('loginError', 'User not found!');
		res.redirect('/login');
		return;
	}

	const isPassEqual = await bcrypt.compare(password, existUser.password);

	if (!isPassEqual) {
		req.flash('loginError', 'Password wrong!');
		res.redirect('/login');
		return;
	}

	const token = generateJWT(existUser._id);

	res.cookie('token', token, { secure: true });

	res.redirect('/');
});
router.post('/register', async (req, res) => {
	const { firstname, lastname, email, password } = req.body;

	if (!email || !password || !lastname || !firstname) {
		req.flash('registerError', 'All fields is required!');
		res.redirect('/register');
		return;
	}

	const candidate = await User.findOne({ email });

	if (candidate) {
		req.flash('registerError', 'User already exist!');
		res.redirect('/register');
		return;
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const userData = {
		firstName: firstname,
		lastName: lastname,
		email: email,
		password: hashedPassword,
	};

	const user = await User.create(userData);

	const token = generateJWT(user._id);

	res.cookie('token', token, { secure: true });

	res.redirect('/');
});

export default router;
