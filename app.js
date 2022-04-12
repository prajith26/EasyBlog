const express = require('express');
// const bodyparser = require("body-parser");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 8080;

const path = require('path');
app.use(express.static('public'));


app.use(cors());
// app.use(bodyparser.json());
// app.use(express.urlencoded({extended:true}));
app.use(express.urlencoded({limit: '50mb'},{extended:true}));
app.use(express.json({limit: '50mb'}));

//Database Connection
const db_url="mongodb+srv://userone:userone@fsdfiles.jxcel.mongodb.net/BlogDb?retryWrites=true&w=majority";
mongoose.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (error)=>{
    if(!error)
    {
        console.log('Success - Database Connected.');
    }
    else{
        console.log('Error - Unable to connect Database.')
    }
});

const loginRouter = require('./src/routes/loginRoutes');
app.use('/api/login',loginRouter);

const registerRouter = require('./src/routes/registerRoutes');
app.use('/api/register',registerRouter);

const userRouter = require('./src/routes/userRoutes');
app.use('/api/user',userRouter);

const adminRouter = require('./src/routes/adminRoutes');
app.use('/api/admin',adminRouter);

const rootRouter = require('./src/routes/rootRoutes');
app.use('/api/root',rootRouter);

// app.get('/',(req,res)=>{
//     res.send('Invalid');
// });

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
})

app.listen(port,(error)=>{
    if(!error)
    {
        console.log("Server Ready at "+port);
    }
    else
    {
        console.log("Error Occured");
    }
});