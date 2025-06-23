import express from "express";
import userController from "../controllers/testController.js";
import paymentController from "../controllers/paymentController";

let router = express.Router();

let initWebRoutes = (app) => {
  // router.get("/", (req, res) => {
  //   return res.send("Hello World with quyen");
  // })

  router.post('/api/login', userController.handleLogin);
  
  // Route xử lý callback từ VNPay
  router.get('/vnpay-return', paymentController.vnpayReturn);
  
  // Route xử lý favicon.ico để tránh lỗi 404
  router.get('/favicon.ico', (req, res) => {
    res.status(204).end();
  });

  return app.use("/", router);
}

module.exports = initWebRoutes;