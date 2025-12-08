export default async function (req, res) {
  try {
    const { identifier, password } = req?.body;

    if (!identifier || !password) {
      return res.status(200).json({
        success: false,
        message: "Identifier or password was not provided.",
      });
    }
  } catch (e) {
    console.error(`Error occured: ${e}`);
  }
}
