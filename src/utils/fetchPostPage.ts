export default async function fetchCSRFPost(URL, csrfToken, body?) {
  try {
    const postRes = await fetch(URL, {
      method: "POST",
      body: body,
      credentials: "include",
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    });

    if (postRes.ok) {
      const postResData = await postRes.json();
      return postResData;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
