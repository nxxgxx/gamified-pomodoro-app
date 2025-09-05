// This function is used to fetch data from the server with the credentials option set to include.

export async function refreshAuthToken() {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }
    return true;
  } catch (err) {
    console.error("Token refresh failed:", err);
    return false;
  }
}

export async function fetchWithAuth(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (res.status === 401) {
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    return res;
  } catch (error) {
    if (error.message === "Unauthorized") {
      window.location.href = "/login";
    } else {
      console.error("Error during fetchWithAuth:", error);
    }
    throw error;
  }
}

export async function fetchGetWithAuth(url) {
  await refreshAuthToken();

  const res = await fetchWithAuth(url, {
    method: "GET",
  });
  return res.json();
}

export async function fetchPostWithAuth(url, data) {
  await refreshAuthToken();

  const res = await fetchWithAuth(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchDeleteWithAuth(url, data) {
  const res = await fetchWithAuth(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
