export interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, params } = context;
  const matricNumber = params.matricNumber as string;

  if (!matricNumber) {
    return new Response('Missing matricNumber', { status: 400 });
  }

  const { results } = await env.DB.prepare(
    'SELECT * FROM results WHERE matric_number = ?'
  ).bind(matricNumber).all();

  if (results.length === 0) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const row = results[0];
  const data = JSON.parse(row.data as string);

  return new Response(JSON.stringify({
    matricNumber: row.matric_number,
    name: row.name,
    data
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const matricNumber = params.matricNumber as string;

  if (!matricNumber) {
    return new Response('Missing matricNumber', { status: 400 });
  }

  try {
    const body: any = await request.json();
    const name = body.name;
    const data = JSON.stringify(body.data);

    if (!name) {
      return new Response('Missing name', { status: 400 });
    }

    await env.DB.prepare(
      `INSERT INTO results (matric_number, name, data, updated_at) 
       VALUES (?, ?, ?, CURRENT_TIMESTAMP) 
       ON CONFLICT (matric_number) DO UPDATE SET name = excluded.name, data = excluded.data, updated_at = CURRENT_TIMESTAMP`
    ).bind(matricNumber, name, data).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
