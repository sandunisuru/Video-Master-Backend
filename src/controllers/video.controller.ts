import { Router } from "express";
import { fetchVideo } from "../services/video.service";

const router = Router();

router.post("/", (req, res) => fetchVideo(req, res));

export default router;