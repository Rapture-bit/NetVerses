import { UserSession } from "../../database/models/Session.js";
import { generateCSRFToken, hashToken } from "../tokenUtils.js";

export default async function (req, res) {
  const { session_id } = req?.signedCookies;

  if (!session_id) {
    return res.status(200).json({
      success: false,
      message: "Invalid session.",
    });
  }

  const acquiredSession = await UserSession.findOne({
    where: { id: session_id },
  });

  if (!acquiredSession) {
    return res.status(200).json({
      success: false,
      message: "Invalid session.",
    });
  }

  const dateNow = Date.now();
  const refreshExpirationDate = acquiredSession.refreshExpiresAt.getTime();
  const refreshExpiryDifference = Math.abs(refreshExpirationDate - dateNow);

  const SevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

  if (refreshExpiryDifference >= SevenDaysInMs) {
    return res.status(200).json({
      success: false,
      message: "Invalid session.",
    });
  }

  const generatedCSRFToken = generateCSRFToken();
  acquiredSession.csrfToken = generatedCSRFToken;
  await acquiredSession.save();

  return res
    .status(200)
    .json({ success: true, csrf_token: generatedCSRFToken });
}
