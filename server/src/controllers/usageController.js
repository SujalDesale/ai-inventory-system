import Product from '../models/Product.js'
export async function deduct(req,res){
  const { productId, amount } = req.body
  await Product.updateOne({ _id: productId, owner: req.user.id }, { $inc: { quantity: -Math.abs(amount || 0) } })
  res.json({ ok:true })
}
