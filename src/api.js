async function GET(api, { table, profile, ...args }) {
  let query = table + "?";
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

function getEndpoint(api, { table, profile, select = "*", ...args }) {
  select = select.split(",").reduce((object, item) => {
    if (typeof object !== "string") return { ...object, [item]: true };
    else return { [object]: true, [item]: true };
  });

  return {
    key: [table, profile, select, { ...args }],
    func: () => GET(api, { table, profile, ...args }),
  };
}

export { getEndpoint };
