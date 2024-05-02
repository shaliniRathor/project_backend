const mongoos = require('mongoose')

const productSchema= new mongoos.Schema({
   productName:String,
   price:String,
   quantity:String,
   category:String,
   product_id:String
} , {timestamps:true} )

module.exports= mongoos.model("products",productSchema)