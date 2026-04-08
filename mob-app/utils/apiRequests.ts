import { getToken } from "@/constants/auth";
import { BASE_URL } from "@/constants/api";

export const apiRequest = async (
  endpoint: string,
  method = "GET",
  body?: any,
) => {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API error");
  }

  return data;
};
