export const validateFields = (fields, body) => {
  for (let f of fields) {
    if (!body[f]) return `Missing field: ${f}`;
  }
  return null;
};
