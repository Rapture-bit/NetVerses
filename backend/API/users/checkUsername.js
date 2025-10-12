import { UserProfiles } from "../../database/models/User.js";

export default async function (req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(200).json({
      success: false,
      message: "Please provide 'Username' field.",
    });
  }

  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (username.length < 4 || !usernameRegex.test(username)) {
    return res.status(200).json({
      success: false,
      message:
        "Invalid username. It must be at least 4 characters long and contain only letters, numbers, underscores, or dashes.",
    });
  }

  try {
    const isUsernameFound = await UserProfiles.findOne({
      where: { username },
    });

    if (isUsernameFound) {
      res.status(200).json({
        success: false,
        isTaken: isUsernameFound,
        message: "Provided username already exists.",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Provided username is available.",
      });
    }
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
}
