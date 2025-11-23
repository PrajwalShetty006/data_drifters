import express from "express";
import { signup, login } from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import axios from "axios";

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
// Temporarily removed protectRoute since MongoDB/auth is not running
router.get("/forecast", async (req, res) => {
  try {
      const mlUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
      const response=await axios.get(`${mlUrl}/forecast`, {
        timeout: 30000,
      });
      res.json(response.data);
  
  } catch (error) {
      console.error('❌ Error fetching forecast:', error.message);
      if (error.code === 'ECONNREFUSED') {
        res.status(503).json({ message: "ML server is not running. Please start the ML server on port 8000." });
      } else {
        res.status(500).json({ message: "Error fetching forecast data", error: error.message });
      }
  }
});

router.get("/rfm", async (req, res) => {
  try {
      const mlUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
      const response=await axios.get(`${mlUrl}/rfm`, {
        timeout: 30000,
      });
      res.json(response.data);
  
  } catch (error) {
      console.error('❌ Error fetching RFM:', error.message);
      if (error.code === 'ECONNREFUSED') {
        res.status(503).json({ message: "ML server is not running. Please start the ML server on port 8000." });
      } else {
        res.status(500).json({ message: "Error fetching RFM data", error: error.message });
      }
  }
});

router.get("/discounts",async (req, res) => {
  try {
      const mlUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
      const response=await axios.get(`${mlUrl}/discounts`, {
        timeout: 30000,
      });
      res.json(response.data);
  
  } catch (error) {
      console.error('❌ Error fetching discounts:', error.message);
      if (error.code === 'ECONNREFUSED') {
        res.status(503).json({ message: "ML server is not running. Please start the ML server on port 8000." });
      } else {
        res.status(500).json({ message: "Error fetching discounts data", error: error.message });
      }
  }
});

router.get("/",async (req, res) => {
  try {
      const response=await axios.get(`${process.env.FASTAPI_URL}/`);
        res.json(response.data);
  
  } catch (error) {
      res.status(500).json({ message: "Error fetching forecast data" });
  }
});

router.get("/run-all",async (req, res) => {
  try {
      const mlUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
      console.log(`📡 Calling ML server: ${mlUrl}/run-all`);
      const response=await axios.get(`${mlUrl}/run-all`, {
        timeout: 30000, // 30 second timeout
      });
      console.log(`✅ Received data from ML server`);
      res.json(response.data);
  
  } catch (error) {
      console.error('❌ Error fetching run-all data:', error.message);
      if (error.code === 'ECONNREFUSED') {
        res.status(503).json({ 
          message: "ML server is not running. Please start the ML server on port 8000.",
          error: error.message 
        });
      } else if (error.code === 'ETIMEDOUT') {
        res.status(504).json({ 
          message: "ML server request timed out. The server may be processing data.",
          error: error.message 
        });
      } else {
        res.status(500).json({ 
          message: "Error fetching run-all data from ML server",
          error: error.message 
        });
      }
  }
});

router.get("/explain_forecast",async (req, res) => {
  try {
      const mlUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
      const response=await axios.get(`${mlUrl}/explain-forecast`, {
        timeout: 30000,
      });
      res.json(response.data);
  
  } catch (error) {
      console.error('❌ Error fetching explain forecast:', error.message);
      if (error.code === 'ECONNREFUSED') {
        res.status(503).json({ message: "ML server is not running. Please start the ML server on port 8000." });
      } else {
        res.status(500).json({ message: "Error fetching explain forecast data", error: error.message });
      }
  }
});

router.get("/blockchain/integrity",async (req, res) => {
  try {
      const response=await axios.get(`${process.env.FASTAPI_URL}/blockchain/integrity`);
        res.json(response.data);
  
  } catch (error) {
      res.status(500).json({ message: "Error fetching forecast data" });
  }
});


export default router;