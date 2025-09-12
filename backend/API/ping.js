function HelloWorld(request, response) {
  return response.json({ message: "Pong!" });
}

export default function (request, response) {
  return HelloWorld(request, response);
}
