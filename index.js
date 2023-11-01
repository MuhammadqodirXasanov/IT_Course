import tokenChecker from './middleware/tokenChecker.js';
import express from 'express';
import { create } from 'express-handlebars';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import session from 'express-session';
import flash from 'connect-flash';
import hbsHelper from './utils/index.js';
// Routes
import auth from './routes/auth.js';
import products from './routes/products.js';
import userMid from './middleware/user.js';

const app = express();
// Get access to .env file's value
dotenv.config();
// Get access to shotrcut type (hbs)
const hbs = create({
	defaultLayout: 'main',
	extname: 'hbs',
	helpers: hbsHelper,
});
// handlebars settings
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
// extra things
app.use(flash());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	session({ secret: 'khasanov', resave: false, saveUninitialized: false })
);
app.use(tokenChecker);
app.use(userMid);
// Get access to routes
app.use(auth);
app.use(products);

const startApp = () => {
	try {
		// Connect to MongoDB
		mongoose
			.connect(process.env.MONGO_URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then(() => {
				console.log('MongoDB connected!..');
			})
			.catch((err) => {
				console.log('There are some errors in MongoDB..', err);
			});
		// Create and listen PORT
		const PORT = process.env.PORT || 5500;
		app.listen(PORT, () => {
			console.log(`${PORT}-port is run`);
		});
	} catch (err) {
		console.log(err);
	}
};

startApp();
