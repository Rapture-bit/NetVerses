export default async function (req, res) {
  try {
    const { content, from_code, to_code } = req.query;
    if (!content || !from_code || !to_code) {
      return res.status(200).json({
        success: false,
        message: "Invalid parameters provided.",
      });
    }
    const params = new URLSearchParams({
      from: from_code,
      to: to_code,
      content: content,
    });

    const response = await fetch(
      `http://127.0.0.1:5000/translate?${params.toString()}`,
    );
    const data = await response.json();

    return res.status(200).json({
      success: true,
      translation: data.translated,
    });
  } catch (e) {
    console.error("Error processing request:", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
