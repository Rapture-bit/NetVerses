export default async function (req, res) {
  try {
    const { username, password } = req?.body;

    if (!username || !password) {
      return res.status(200).json({
        success: false,
        message: "Username or password was not provided.",
      });
    }
  } catch (e) {
    console.error(`Error occured: ${e}`);
  }
}
