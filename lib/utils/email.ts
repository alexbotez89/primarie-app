import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendRequestCreatedEmail({
  to,
  citizenName,
  code,
  title,
}: {
  to: string;
  citizenName: string;
  code: string;
  title: string;
}) {
  return resend.emails.send({
    from: fromEmail,
    to,
    subject: `Confirmare cerere ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2>Cererea ta a fost înregistrată</h2>
        <p>Bună, ${citizenName},</p>
        <p>Cererea ta a fost înregistrată cu succes în platformă.</p>
        <p><strong>Cod cerere:</strong> ${code}</p>
        <p><strong>Titlu:</strong> ${title}</p>
        <p>Poți urmări statusul cererii aici:</p>
        <p>
          <a href="${appUrl}/cetatean/tracking" target="_blank">
            ${appUrl}/cetatean/tracking
          </a>
        </p>
        <p>Vei avea nevoie de codul cererii și de adresa de email folosită la trimitere.</p>
        <hr />
        <p style="font-size: 14px; color: #475569;">
          Acesta este un email automat trimis de platforma digitală pentru primării.
        </p>
      </div>
    `,
  });
}

export async function sendStatusUpdatedEmail({
  to,
  citizenName,
  code,
  title,
  status,
  comment,
}: {
  to: string;
  citizenName: string;
  code: string;
  title: string;
  status: string;
  comment?: string | null;
}) {
  return resend.emails.send({
    from: fromEmail,
    to,
    subject: `Actualizare cerere ${code} - ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2>Status actualizat pentru cererea ta</h2>
        <p>Bună, ${citizenName},</p>
        <p>Statusul cererii tale a fost actualizat.</p>
        <p><strong>Cod cerere:</strong> ${code}</p>
        <p><strong>Titlu:</strong> ${title}</p>
        <p><strong>Status nou:</strong> ${status}</p>
        ${
          comment
            ? `<p><strong>Mesaj public:</strong> ${comment}</p>`
            : ""
        }
        <p>Poți urmări istoricul cererii aici:</p>
        <p>
          <a href="${appUrl}/cetatean/tracking" target="_blank">
            ${appUrl}/cetatean/tracking
          </a>
        </p>
        <hr />
        <p style="font-size: 14px; color: #475569;">
          Acesta este un email automat trimis de platforma digitală pentru primării.
        </p>
      </div>
    `,
  });
}