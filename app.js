require('dotenv').config();  // Đọc các biến môi trường từ file .env
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');
const configViewEngine = require('./src/config/viewEngine');
const initWebRoutes = require('./src/routers/web');

const app = express();
const PORT = process.env.PORT || 3000;

// engine
configViewEngine(app);

// routers
initWebRoutes(app)

// Middleware bảo mật và cấu hình CORS
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, () => {
    console.log(`App is running at http://localhost:${PORT}`);
});