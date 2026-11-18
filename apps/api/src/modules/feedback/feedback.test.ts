import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { pool } from "../../database/pool";
import { getLastFeedbackEmail } from "../../shared/email/mailer";
import { truncateAll } from "../../test/db";
import { registerAndLogin } from "../../test/helpers";

const app = createApp();

const feedbackPayload = {
  type: "suggestion" as const,
  subject: "Mejorar el resumen mensual",
  message: "Me gustaría poder comparar el resumen con el mes anterior.",
};

beforeEach(async () => {
  await truncateAll();
});

describe("POST /api/feedback", () => {
  it("requiere autenticación", async () => {
    const response = await request(app)
      .post("/api/feedback")
      .send(feedbackPayload);

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHENTICATED");
  });

  it("valida el tipo y la longitud de los campos", async () => {
    const { agent } = await registerAndLogin(app);

    const response = await agent
      .post("/api/feedback")
      .send({ type: "otro", subject: "Hola", message: "Corto" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("guarda el feedback con el avatar y envía el email", async () => {
    const { agent } = await registerAndLogin(app);
    const me = await agent.get("/api/auth/me");
    const userId = me.body.data.user.id as string;
    const publicId = `meridia/avatars/${userId}/avatar-1`;
    const avatar = `https://res.cloudinary.com/demo/image/upload/v123/${publicId}.webp`;

    const updated = await agent
      .patch("/api/auth/me")
      .send({ avatar, avatarPublicId: publicId });
    expect(updated.status).toBe(200);

    const response = await agent.post("/api/feedback").send(feedbackPayload);

    expect(response.status).toBe(201);
    expect(response.body.data.feedback).toMatchObject({
      type: feedbackPayload.type,
      subject: feedbackPayload.subject,
      message: feedbackPayload.message,
      avatarUrl: avatar,
    });

    const stored = await pool.query<{ avatar_url: string | null }>(
      "SELECT avatar_url FROM feedback WHERE id = $1",
      [response.body.data.feedback.id],
    );
    expect(stored.rows[0]?.avatar_url).toBe(avatar);

    const sent = getLastFeedbackEmail("feedback@test.com");
    expect(sent).toBeDefined();
    expect(sent?.name).toBe("Test User");
    expect(sent?.url).toBe(avatar);
    expect(sent?.subject).toContain("Sugerencia");
    expect(sent?.subject).toContain(feedbackPayload.subject);
  });

  it("guarda el feedback sin avatar y lo indica en el email", async () => {
    const { agent } = await registerAndLogin(app);

    const response = await agent
      .post("/api/feedback")
      .send({ ...feedbackPayload, type: "use_case" });

    expect(response.status).toBe(201);
    expect(response.body.data.feedback.avatarUrl).toBeNull();

    const stored = await pool.query<{ avatar_url: string | null }>(
      "SELECT avatar_url FROM feedback WHERE id = $1",
      [response.body.data.feedback.id],
    );
    expect(stored.rows[0]?.avatar_url).toBeNull();

    const sent = getLastFeedbackEmail("feedback@test.com");
    expect(sent?.url).toBe("");
    expect(sent?.subject).toContain("Caso de uso");
  });

  it("recorta espacios de asunto y mensaje", async () => {
    const { agent } = await registerAndLogin(app);

    const response = await agent.post("/api/feedback").send({
      type: "comment",
      subject: "  Un comentario  ",
      message: "  Este es un comentario suficientemente largo.  ",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.feedback.subject).toBe("Un comentario");
    expect(response.body.data.feedback.message).toBe(
      "Este es un comentario suficientemente largo.",
    );
  });
});
