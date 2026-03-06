const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();

//midlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());      

const PORT = process.env.PORT || 3000;

//service targets
const USER_SERVICE='http://localhost:3001';
const PRODUCT_SERVICE='http://localhost:3002';

app.get('/health', (req,res) => {
     res.json({
          service: 'API Gateway',
          status: 'API Gateway is running',
          route: {
               "/api/users": USER_SERVICE,
               "/api/products": PRODUCT_SERVICE
          },
          timestamp: new Date().toISOString()
     });
});

//proxy routes
app.use('/api/users', createProxyMiddleware({
     target: USER_SERVICE,
     changeOrigin: true,
     pathRewrite: {
          '^/api/users': ''
     }
}));

app.use('/api/products', createProxyMiddleware({
     target: PRODUCT_SERVICE,
     changeOrigin: true, 
     pathRewrite: {
          '^/api/products': ''
     }
})); 


//handle 404
app.use((req,res) => {
     res.status(404).json({message: "Route not found"});
});

//start server
app.listen (PORT, () => {
     console.log(`API Gateway running on PORT ${PORT} at http://localhost:${PORT}/`);
});