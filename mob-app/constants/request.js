import { BASE_URL } from "./api";

export const apiRequest = async (endpoint, method = "GET", body, token) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Request failed");

  return data;
};
