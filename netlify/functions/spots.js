export default async (req) => {
  const kv = await import("@netlify/kv").then(m => m.default);

  const defaultState = {
    camps: {
      "wk1": 10,
      "wk2": 10
    },
    groups: {
      "sun-10-12": 7,
      "sun-12-2": 8,
      "mon": 5,
      "tue": 2,
      "wed": 2,
      "thu-1": 5,
      "thu-2": 3,
      "fri-1": 8,
      "fri-open": 20
    }
  };

  if (req.method === "GET") {
    let state = await kv.get("cg_spots");

    if (!state) {
      await kv.set("cg_spots", defaultState);
      state = defaultState;
    }

    return new Response(JSON.stringify(state), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { type, id, spots } = body;

    let state = await kv.get("cg_spots") || defaultState;

    if (type === "camp") {
      state.camps[id] = spots;
    }

    if (type === "group") {
      state.groups[id] = spots;
    }

    await kv.set("cg_spots", state);

    return new Response(JSON.stringify({ success: true, state }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Method not allowed", { status: 405 });
};
