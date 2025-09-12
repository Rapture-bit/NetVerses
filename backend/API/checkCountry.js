import { blacklistedCountries } from "../constants/blacklists.js";

async function getCountryFromIp(ip) {
  try {
    console.log(`Fetching data for IP: ${ip}`);
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.countryCode;
  } catch (error) {
    console.error("Error fetching IP info:", error);
    return null;
  }
}

export default async function (req, res) {
  try {
    const ip =
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.connection.remoteAddress;
    const countryCode = await getCountryFromIp(ip);

    console.log(`Country code for IP ${ip}: ${countryCode}`);

    if (blacklistedCountries.has(countryCode)) {
      return res.status(200).json({
        success: false,
        message: "Blacklisted region.",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Not blacklisted.",
      });
    }
  } catch (e) {
    console.error("Error processing request:", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
