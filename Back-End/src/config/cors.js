const configCors = {
  origin: ['http://localhost:5173', 'http://localhost:3000'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,  
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',  
    'X-Access-Token',
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400, // 24 giờ
  preflightContinue: false,
  optionsSuccessStatus: 204,
}

export default configCors;  