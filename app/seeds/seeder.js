
const { default: mongoose } = require("mongoose");
const { Roles } = require("../models/roles");
const { Users } = require("../models/users");
const bcrypt = require('bcryptjs');
require('dotenv').config()
const Db=process.env.DATABASE
mongoose.connect(Db,{
    useNewUrlParser: true,
    useUnifiedTopology : true
}).then(() => {
    console.log("Connection Successful")
}).catch(( error) => {
    console.trace('Inside Catch => ', error);
})

// User seeder
const userSeeder = async () => {
try {
    let user= new Users({
        _id:'62f2363bd3a1eeac22430d02',
        email:'admin@mangotechsolutions.com',
        password:'123456',
        name:'admin',
        role:'62baa24f00406999b9dec2dd'
    })
    let encryptedPassword =await bcrypt.hash(user.password, 10);
    user.password = encryptedPassword;
    user.save((err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log("User Created")
    
        }
    }
    )
} catch (error) {
    console.log(error)
}
}
const roleSeeder=()=>{
    var role=[
        new Roles({
            _id:'62baa24f00406999b9dec2dd',
            role:'admin'
        }),
        new Roles({
            _id:'62baa26700406999b9dec2de',
            role:'user'
        })
    ]
    var done=0
    role.map((r,i)=>r.save((err,result)=>{
        done++
        if(done==role.length){
            console.log("Roles Created")
            mongoose.disconnect()
        }
    }))
}

userSeeder()
roleSeeder();




