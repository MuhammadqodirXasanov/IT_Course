import { model, Schema } from 'mongoose';

const productSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		extraDesc: String,
		image: { type: String, required: true, unique: true },
		price: { type: Number, required: true },
		user: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{
		timestamps: true,
	}
);

const Product = model('Product', productSchema);

export default Product;