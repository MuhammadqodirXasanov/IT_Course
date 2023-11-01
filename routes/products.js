import { Router } from 'express';
import authMid from '../middleware/auth.js';
import userMid from '../middleware/user.js';
import Product from '../models/Product.js';

const router = Router();

router.get('/', async (req, res) => {
	const products = await Product.find().lean();

	res.render('index', {
		title: "Home || M. Xasanov's",
		products: products.reverse(),
		userId: req.userId ? req.userId.toString() : null,
	});
});

router.get('/products', async (req, res) => {
	const user = req.userId ? req.userId.toString() : null;

	const myProducts = await Product.find({ user }).populate('user').lean();

	res.render('products', {
		title: "Products || M. Xasanov's",
		isOnProducts: true,
		myProducts,
	});
});

router.get('/add', authMid, (req, res) => {
	if (!req.cookies.token) {
		res.redirect('/login');
		return;
	}

	res.render('add', {
		title: "Add Product || M. Xasanov's",
		isAdd: true,
		addError: req.flash('addError'),
	});
});
router.get('/products/:id', async (req, res) => {
	const id = req.params.id;
	const product = await Product.findById(id).populate('user').lean();

	const title = product.title + ' || ' + "M. Xasanov's";

	res.render('product', { product, title });
});
router.get('/edit-product/:id', async (req, res) => {
	const id = req.params.id;
	const product = await Product.findById(id).populate('user').lean();

	const title = 'Edit: ' + product.title + ' || ' + "M. Xasanov's";

	res.render('edit', {
		product,
		title,
		editError: req.flash('editError'),
	});
});

router.post('/edit-product/:id', async (req, res) => {
	const { title, description, image, price } = req.body;

	const id = req.params.id;

	if (!title || !description || !image || !price) {
		req.flash('editError', 'All fields is required!');

		res.redirect(`/edit-product/${id}`);
		return;
	}

	await Product.findByIdAndUpdate(id, req.body, {
		new: true,
	});

	res.redirect('/products');
});

router.post('/add-product', userMid, async (req, res) => {
	const { title, description, image, price } = req.body;

	if (!title || !description || !image || !price) {
		req.flash('addError', 'All fields is required!');

		res.redirect('/add');
		return;
	}

	await Product.create({ ...req.body, user: req.userId });

	res.redirect('/');
});

router.post('/delete-product/:id', async (req, res) => {
	const id = req.params.id;

	await Product.findByIdAndRemove(id);

	res.redirect('/');
});

export default router;
