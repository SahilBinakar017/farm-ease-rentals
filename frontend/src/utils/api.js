const API_BASE = "http://localhost:5000/api";

export async function apiRequest(
  endpoint,
  method = "GET",
  data = null,
  auth = true
) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Request failed");
  return result;
}
