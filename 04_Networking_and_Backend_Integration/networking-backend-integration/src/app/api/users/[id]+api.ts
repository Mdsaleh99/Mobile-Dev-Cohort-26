import { db } from "@/lib/db";

type Ctx = {id:string}

export async function GET(_req: Request, { id }: Ctx) {
  try {
    console.log(id)
    const result = await db.execute({
      sql: "SELECT * FROM users_data WHERE id = ?",
      args: [parseInt(id, 10)],
    });

    return Response.json(result.rows);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch user", status: 500 },
      { status: 500 }
    );
  }
}

export async function PATCH(_request: Request, _ctx: Ctx) {}

export async function DELETE(_request: Request, _ctx: Ctx) {}