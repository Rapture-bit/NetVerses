import { useCSRFStore } from "@/context/CSRFStore";

export default async function fetchCSRF(
  URL: any,
  method: any,
  csrfToken?: any,
  body?: any,
) {
  try {
    const postRequest = await fetch(URL, {
      method: method,
      body: body,
      credentials: "include",
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    });

    if (postRequest.ok) {
      const postRequestResponse = await postRequest.json();

      if (postRequestResponse.csrfToken) {
        useCSRFStore.getState().setCSRFToken(postRequestResponse.csrfToken);
      }

      return postRequestResponse;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
