const express = require('express');
const cors = require('cors');
var path = require('path');
const bodyParser = require('body-parser');
require('./config/connectDb');
const app = express();
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3000','https://photo-save-adminpanel.vercel.app']
}));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
}));
const port=process.env.PORT||8003
const user_router = require('./routes/user.route');
const tag_router = require('./routes/tag.route');
const project_route = require('./routes/project.route');
const picture_route = require('./routes/picture.route');
const role_route = require('./routes/role.route');

app.use("/api",[user_router,role_route,project_route,tag_router,picture_route ])
app.listen(port, () => {
    console.log(`server is start ${port}`)
})