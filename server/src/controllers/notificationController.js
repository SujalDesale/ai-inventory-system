import Notification from '../models/Notification.js'
export async function list(req,res){
  const items = await Notification.find({ owner:req.user.id }).sort('-createdAt')
  res.json(items)
}
export async function create(req,res){
  const n = await Notification.create({ ...req.body, owner:req.user.id })
  res.status(201).json(n)
}
