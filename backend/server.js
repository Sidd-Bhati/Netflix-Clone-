import express from 'express'
import authRoutes from './routes/auth.route.js'
import movieRoutes from './routes/movie.route.js'
import tvRoutes from './routes/tv.route.js'
import searchRoutes from './routes/search.route.js'
import { connectDB } from './config/db.js';
import { ENV_VARS } from './config/envVars.js';
import cookieParser from 'cookie-parser';
import {config} from "dotenv"
import { protectRoute } from './middleware/protectRoute.middleware.js';
import cors from "cors"


const app = express();

config({ path: "./.env" });

app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      method: ["GET", "POST", "DELETE", "PUT"],
      credentials: true,
    })
  );

app.use(express.json());
app.use(cookieParser());
const PORT = ENV_VARS.PORT;

app.use("/api/v1/auth",authRoutes)
//protected routes
app.use("/api/v1/movie",protectRoute,movieRoutes)
app.use("/api/v1/tv",protectRoute,tvRoutes)
app.use("/api/v1/search",protectRoute,searchRoutes)

app.listen(PORT,()=>{
    console.log("Server started at http://localhost:" + PORT);
    connectDB();
}); 

