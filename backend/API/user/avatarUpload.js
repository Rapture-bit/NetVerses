import { User, UserProfile } from "../../database/models/User.js";
import checkAuth from "../../auth/checkAuth.js";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (req, res) {
  try {
    const { success, user } = await checkAuth(req);
    if (!success || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log(req.files);

    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;

    const allowedMimeTypes = [
      "image/jpeg",
      "image/avif",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    const ext = path.extname(file.name);
    const filename = `${randomUUID()}${ext}`;
    const uploadDir = path.join(
      __dirname,
      "../../assets/images/uploads/avatars",
    );

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);

    console.log("Saving file to:", filePath);
    await file.mv(filePath);
    if (!fs.existsSync(filePath)) {
      console.error("File was not saved!");
    }
    const avatarUrl = `https://cdn.netverses.com/uploads/avatars/${filename}`;

    const profile = await UserProfile.findOne({ where: { id: user.id } });
    if (!profile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    return res.status(200).json({ success: true, avatar_url: avatarUrl });
  } catch (err) {
    console.error("Avatar upload error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
