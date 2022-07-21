async function GET(api, { table, profile, ...args }) {
  let query = table + (!!Object.keys(args).length ? "?" : "");
  for (let arg in args) {
    if (Array.isArray(args[arg])) {
      for (let subArg of args[arg]) {
        query += subArg ? `${arg}=${subArg}&` : "";
      }
    } else query += args[arg] ? `${arg}=${args[arg]}&` : "";
  }

  const response = await api.get(query, {
    headers: { "Accept-Profile": profile },
  });

  return response.data;
}

async function POST(api, { table, profile, data }) {
  const response = await api.post(`rpc/${table}`, data, {
    headers: { "Content-Profile": profile },
  });

  return response.data;
}

export { GET, POST };
