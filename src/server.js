'use strict';

const express = require('express');
const app = express();

const errorHandler = require('./error-handles/500');
const notFound = require('./error-handles/404');
const authRouter = require('./Routes/auth.routes');
const taskRouter = require('./Routes/task.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routers
app.use(authRouter);
app.use(taskRouter);


//home routhe
app.get('/', (req,res)=>{
    res.send('Server is Up & Running!')
});

app.use('*', notFound);
app.use(errorHandler);


function start(port){
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })
}


module.exports = {
    server: app,
    start: start
}