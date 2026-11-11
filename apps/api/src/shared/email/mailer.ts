import nodemailer from 'nodemailer';
import { FEEDBACK_TYPE_LABELS, type FeedbackType } from '@meridia/shared';
import { env } from '../../config/env';
import { logger } from '../logger';

export type SentEmailKind = 'verification' | 'password-reset' | 'feedback';

export interface VerificationEmailInput {
  to: string;
  name: string;
  url: string;
  expiresInHours: number;
}

export interface PasswordResetEmailInput {
  to: string;
  name: string;
  url: string;
  expiresInMinutes: number;
}

export interface FeedbackEmailInput {
  userName: string;
  userEmail: string;
  avatarUrl: string | null;
  type: FeedbackType;
  subject: string;
  message: string;
  createdAt: string;
}

export interface SentEmail {
  kind: SentEmailKind;
  to: string;
  name: string;
  url: string;
  subject: string;
  sentAt: Date;
}

const outbox: SentEmail[] = [];

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const getFrom = (): string => env.SMTP_FROM || 'Meridia <no-reply@localhost>';

const getTransporter = (): ReturnType<typeof nodemailer.createTransport> => {
  if (!transporter) {
    const auth =
      env.SMTP_USER && env.SMTP_PASS
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined;

    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      ...(auth ? { auth } : {}),
    });
  }

  return transporter;
};

interface EmailLayoutInput {
  subject: string;
  heading: string;
  name: string;
  intro: string;
  ctaLabel: string;
  url: string;
  expiry: string;
  ignore: string;
}

const buildEmail = ({
  subject,
  heading,
  name,
  intro,
  ctaLabel,
  url,
  expiry,
  ignore,
}: EmailLayoutInput): { subject: string; text: string; html: string } => {
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(url);

  const text = [
    `Hola ${name},`,
    '',
    intro,
    url,
    '',
    expiry,
    ignore,
  ].join('\n');

  const html = `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1f2933;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;padding:32px;">
            <tr>
              <td>
                <h1 style="margin:0 0 16px;font-size:24px;color:#1f2933;">${heading}</h1>
                <p style="margin:0 0 16px;font-size:16px;line-height:24px;">Hola ${safeName},</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:24px;">
                  ${intro}
                </p>
                <p style="margin:0 0 24px;">
                  <a href="${safeUrl}" style="display:inline-block;background-color:#1f7a5a;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:8px;">
                    ${ctaLabel}
                  </a>
                </p>
                <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:#52606d;">
                  ${expiry} ${ignore}
                </p>
                <p style="margin:0;font-size:12px;line-height:20px;color:#7b8794;word-break:break-all;">
                  ${safeUrl}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
};

interface DeliverEmailInput {
  kind: SentEmailKind;
  to: string;
  name: string;
  url: string;
  subject: string;
  text: string;
  html: string;
  logDescription: string;
  replyTo?: string;
}

const deliverEmail = async ({
  kind,
  to,
  name,
  url,
  subject,
  text,
  html,
  logDescription,
  replyTo,
}: DeliverEmailInput): Promise<void> => {
  if (env.NODE_ENV === 'test') {
    outbox.push({
      kind,
      to,
      name,
      url,
      subject,
      sentAt: new Date(),
    });
    return;
  }

  if (!env.SMTP_HOST) {
    logger.info(
      { email: to, url },
      `SMTP no configurado; contenido de ${logDescription} disponible en el log`,
    );
    return;
  }

  try {
    await getTransporter().sendMail({
      from: getFrom(),
      to,
      subject,
      text,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
  } catch (error) {
    logger.error(
      { err: error, email: to },
      `No se pudo enviar el email de ${logDescription}`,
    );
  }
};

export const sendVerificationEmail = async (
  input: VerificationEmailInput,
): Promise<void> => {
  const { subject, text, html } = buildEmail({
    subject: 'Verifica tu cuenta de Meridia',
    heading: 'Verifica tu cuenta de Meridia',
    name: input.name,
    intro:
      'Gracias por registrarte. Confirma tu email para activar tu cuenta y poder acceder al dashboard.',
    ctaLabel: 'Verificar mi cuenta',
    url: input.url,
    expiry: `El enlace vence en ${input.expiresInHours} horas.`,
    ignore: 'Si no creaste una cuenta, puedes ignorar este mensaje.',
  });

  await deliverEmail({
    kind: 'verification',
    to: input.to,
    name: input.name,
    url: input.url,
    subject,
    text,
    html,
    logDescription: 'verificación',
  });
};

export const sendPasswordResetEmail = async (
  input: PasswordResetEmailInput,
): Promise<void> => {
  const { subject, text, html } = buildEmail({
    subject: 'Restablece tu contraseña de Meridia',
    heading: 'Restablece tu contraseña de Meridia',
    name: input.name,
    intro:
      'Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el enlace para crear una nueva.',
    ctaLabel: 'Restablecer contraseña',
    url: input.url,
    expiry: `El enlace vence en ${input.expiresInMinutes} minutos.`,
    ignore:
      'Si no solicitaste este cambio, puedes ignorar este mensaje. Tu contraseña no cambiará.',
  });

  await deliverEmail({
    kind: 'password-reset',
    to: input.to,
    name: input.name,
    url: input.url,
    subject,
    text,
    html,
    logDescription: 'restablecimiento de contraseña',
  });
};

export const sendFeedbackEmail = async (
  input: FeedbackEmailInput,
): Promise<void> => {
  if (!env.FEEDBACK_TO_EMAIL) {
    logger.warn(
      { email: input.userEmail },
      'FEEDBACK_TO_EMAIL no configurada; feedback guardado sin notificar',
    );
    return;
  }

  const typeLabel = FEEDBACK_TYPE_LABELS[input.type];
  const safeSubject = input.subject.replace(/[\r\n]+/g, ' ').trim();
  const subject = `[Meridia] ${typeLabel}: ${safeSubject}`;
  const createdAt = new Date(input.createdAt).toLocaleString('es-AR');
  const avatarUrl = input.avatarUrl ?? '';

  const text = [
    'Nuevo feedback recibido en Meridia',
    '',
    `Tipo: ${typeLabel}`,
    `De: ${input.userName} <${input.userEmail}>`,
    `Avatar: ${avatarUrl || 'Sin avatar'}`,
    `Fecha: ${createdAt}`,
    '',
    'Mensaje:',
    input.message,
  ].join('\n');

  const safeName = escapeHtml(input.userName);
  const safeEmail = escapeHtml(input.userEmail);
  const safeType = escapeHtml(typeLabel);
  const safeMessage = escapeHtml(input.message);
  const safeCreatedAt = escapeHtml(createdAt);
  const safeAvatarUrl = escapeHtml(avatarUrl);
  const avatarHtml = avatarUrl
    ? `<a href="${safeAvatarUrl}" style="color:#1f7a5a;word-break:break-all;">${safeAvatarUrl}</a>`
    : 'Sin avatar';

  const html = `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1f2933;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;padding:32px;">
            <tr>
              <td>
                <h1 style="margin:0 0 16px;font-size:24px;color:#1f2933;">Nuevo feedback</h1>
                <p style="margin:0 0 8px;font-size:15px;line-height:24px;"><strong>Tipo:</strong> ${safeType}</p>
                <p style="margin:0 0 8px;font-size:15px;line-height:24px;"><strong>De:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
                <p style="margin:0 0 8px;font-size:15px;line-height:24px;"><strong>Avatar:</strong> ${avatarHtml}</p>
                <p style="margin:0 0 24px;font-size:15px;line-height:24px;"><strong>Fecha:</strong> ${safeCreatedAt}</p>
                <div style="border-top:1px solid #e4e7eb;padding-top:20px;">
                  <p style="margin:0 0 8px;font-size:13px;color:#52606d;text-transform:uppercase;letter-spacing:0.04em;">Mensaje</p>
                  <p style="margin:0;font-size:15px;line-height:24px;white-space:pre-wrap;">${safeMessage}</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  await deliverEmail({
    kind: 'feedback',
    to: env.FEEDBACK_TO_EMAIL,
    name: input.userName,
    url: avatarUrl,
    subject,
    text,
    html,
    logDescription: 'feedback',
    replyTo: input.userEmail,
  });
};

const getLastEmail = (
  to: string,
  kind: SentEmailKind,
): SentEmail | undefined =>
  [...outbox].reverse().find((email) => email.to === to && email.kind === kind);

export const getLastVerificationEmail = (to: string): SentEmail | undefined =>
  getLastEmail(to, 'verification');

export const getLastPasswordResetEmail = (to: string): SentEmail | undefined =>
  getLastEmail(to, 'password-reset');

export const getLastFeedbackEmail = (to: string): SentEmail | undefined =>
  getLastEmail(to, 'feedback');

export const clearSentEmails = (): void => {
  outbox.length = 0;
};
