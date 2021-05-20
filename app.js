const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const config = require('config');
const createServer = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const port = config.get('port') || 7000;
const mongoUri = config.get("mongoUri");

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for JSONPlaceholder',
        version: '1.0.0',
        description:
            'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
        license: {
            name: 'Licensed Under MIT',
            url: 'https://spdx.org/licenses/MIT.html',
        },
        contact: {
            name: 'JSONPlaceholder',
            url: 'https://jsonplaceholder.typicode.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,

    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();
    app.use(cors())
app.use(express.json());
app.use('/api/auth', require('./routes/auth.route'))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const init = async () =>{
    try{
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        app.listen(port,()=>{
            console.log(`App start on port ${port}`)
        });
    } catch (e) {
        console.log(`Server error ${e.message}`);
        process.exit(1);

    }
}

init();

