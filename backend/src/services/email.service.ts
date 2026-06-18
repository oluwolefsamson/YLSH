import { Resend } from 'resend'

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
const LOGO_SRC = `${CLIENT_URL}/images/yls-logo.svg`

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = process.env.EMAIL_FROM || 'YLSH Platform <onboarding@resend.dev>'

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    console.log(`\n📧 [DEV] Email to ${to} | Subject: ${subject}\n`)
    return
  }
  const { error } = await resend.emails.send({ from: FROM, to, subject, html })
  if (error) throw new Error(error.message)
}

function shell(headerStart: string, headerEnd: string, body: string): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background-color:#f0f9ff;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f9ff;">
<tr><td align="center" style="padding:40px 16px;">

  <table border="0" cellpadding="0" cellspacing="0" width="580" style="max-width:580px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(14,116,144,0.13);">

    <tr>
      <td align="center" style="background:linear-gradient(135deg,${headerStart} 0%,${headerEnd} 100%);padding:32px 40px;">
        <img src="${LOGO_SRC}" alt="YLS Summit" height="60" style="display:block;height:60px;border:0;"/>
      </td>
    </tr>
    <tr>
      <td height="4" style="background:linear-gradient(90deg,${headerStart},${headerEnd},${headerStart});font-size:0;line-height:0;">&nbsp;</td>
    </tr>

    ${body}

    <tr>
      <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center">
              <p style="margin:0 0 5px;font-size:13px;color:#64748b;font-family:Arial,Helvetica,sans-serif;">
                &copy; 2025 YLS Summit &mdash; Young Leaders Summit Hub
              </p>
              <p style="margin:0;font-size:11px;color:#94a3b8;font-family:Arial,Helvetica,sans-serif;">
                This is an automated message. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>

  <table border="0" cellpadding="0" cellspacing="0" width="580" style="max-width:580px;width:100%;">
    <tr>
      <td align="center" style="padding:14px 0 0;">
        <p style="margin:0;font-size:11px;color:#94a3b8;font-family:Arial,Helvetica,sans-serif;">
          YLSH Summit Operations Platform &middot; Nigeria
        </p>
      </td>
    </tr>
  </table>

</td></tr>
</table>
</body>
</html>`
}

// ─── Registration Confirmation ────────────────────────────────────────────────

export const sendRegistrationConfirmationEmail = async (
  to: string, name: string, eventTitle: string, eventDate: string, venue: string, qrToken: string,
): Promise<void> => {
  const body = `
    <tr>
      <td align="center" style="background:#ffffff;padding:36px 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" width="60" height="60"
              style="width:60px;height:60px;background-color:#d1fae5;border-radius:50%;
                     font-size:28px;line-height:60px;text-align:center;">&#10003;</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:14px 40px 0;">
        <span style="display:inline-block;background-color:#d1fae5;color:#065f46;
                     font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
                     padding:5px 16px;border-radius:20px;font-family:Arial,Helvetica,sans-serif;">
          Registration Confirmed
        </span>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:14px 40px 0;">
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">
          You're registered!
        </h1>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:16px 48px 0;">
        <p style="margin:0 0 14px;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          Hi <strong>${name}</strong>,
        </p>
        <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          Your spot has been confirmed for:
        </p>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
          <tr>
            <td style="background-color:#f0f9ff;border-left:4px solid #0e7490;border-radius:0 8px 8px 0;padding:14px 18px;">
              <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">${eventTitle}</p>
              <p style="margin:0;font-size:13px;color:#475569;font-family:Arial,Helvetica,sans-serif;">${eventDate} &bull; ${venue}</p>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;font-family:Arial,Helvetica,sans-serif;">
          Your Registration ID
        </p>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
          <tr>
            <td align="center" style="background-color:#0f172a;border-radius:10px;padding:16px;">
              <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:4px;font-family:'Courier New',Courier,monospace;">
                ${qrToken}
              </span>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          Present this ID or your QR code from the dashboard at the venue for check-in. Keep this email safe.
        </p>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:4px 40px 44px;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="background-color:#0e7490;border-radius:8px;">
              <a href="${CLIENT_URL}/dashboard/registrations"
                style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;
                       color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">
                View My QR Code &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
  await send(to, `Registration confirmed — ${eventTitle}`, shell('#065f46', '#0e7490', body)).catch(() => {})
}

// ─── Waitlist Confirmation ────────────────────────────────────────────────────

export const sendWaitlistConfirmationEmail = async (
  to: string, name: string, eventTitle: string, eventDate: string, venue: string,
): Promise<void> => {
  const body = `
    <tr>
      <td align="center" style="background:#ffffff;padding:36px 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" width="60" height="60"
              style="width:60px;height:60px;background-color:#fef9c3;border-radius:50%;
                     font-size:28px;line-height:60px;text-align:center;">&#9203;</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:14px 40px 0;">
        <span style="display:inline-block;background-color:#fef9c3;color:#854d0e;
                     font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
                     padding:5px 16px;border-radius:20px;font-family:Arial,Helvetica,sans-serif;">
          On the Waitlist
        </span>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:14px 40px 0;">
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">
          You're on the waitlist
        </h1>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:16px 48px 44px;">
        <p style="margin:0 0 14px;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          Hi <strong>${name}</strong>,
        </p>
        <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          The event below is currently full, but we've added you to the waitlist:
        </p>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
          <tr>
            <td style="background-color:#fefce8;border-left:4px solid #eab308;border-radius:0 8px 8px 0;padding:14px 18px;">
              <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">${eventTitle}</p>
              <p style="margin:0;font-size:13px;color:#475569;font-family:Arial,Helvetica,sans-serif;">${eventDate} &bull; ${venue}</p>
            </td>
          </tr>
        </table>
        <p style="margin:0;font-size:14px;color:#64748b;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          If a spot opens up, you will automatically be moved to confirmed and receive a new email with your registration ID. No action is needed from you.
        </p>
      </td>
    </tr>
  `
  await send(to, `You're on the waitlist — ${eventTitle}`, shell('#854d0e', '#eab308', body)).catch(() => {})
}

// ─── Waitlist Promotion ───────────────────────────────────────────────────────

export const sendWaitlistPromotionEmail = async (to: string, name: string, eventTitle: string, eventDate: string, venue: string): Promise<void> => {
  const body = `
    <tr>
      <td align="center" style="background:#ffffff;padding:36px 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" width="60" height="60"
              style="width:60px;height:60px;background-color:#dbeafe;border-radius:50%;
                     font-size:28px;line-height:60px;text-align:center;">&#127881;</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:14px 40px 0;">
        <span style="display:inline-block;background-color:#dbeafe;color:#1e40af;
                     font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
                     padding:5px 16px;border-radius:20px;font-family:Arial,Helvetica,sans-serif;">
          Spot Confirmed
        </span>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:14px 40px 0;">
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">
          You're Off the Waitlist!
        </h1>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:16px 48px 0;">
        <p style="margin:0 0 14px;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          Hi <strong>${name}</strong>,
        </p>
        <p style="margin:0 0 14px;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          Great news! A spot has opened up and you have been <strong style="color:#1e40af;">confirmed</strong>
          for the following event:
        </p>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:4px 0 20px;">
          <tr>
            <td style="background-color:#f0f9ff;border-left:4px solid #0e7490;
                       border-radius:0 8px 8px 0;padding:14px 18px;">
              <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">
                ${eventTitle}
              </p>
              <p style="margin:0;font-size:13px;color:#475569;font-family:Arial,Helvetica,sans-serif;">
                ${eventDate} &bull; ${venue}
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 28px;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          Your QR code is ready in your dashboard. Please present it at the venue for check-in.
        </p>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:4px 40px 44px;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="background-color:#0e7490;border-radius:8px;">
              <a href="${CLIENT_URL}/dashboard/registrations"
                style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;
                       color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">
                View My QR Code &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
  await send(to, `You're confirmed for ${eventTitle}!`, shell('#1e40af', '#0e7490', body)).catch(() => {})
}

// ─── Mentor Approval ─────────────────────────────────────────────────────────

export const sendMentorApprovalEmail = async (to: string, name: string): Promise<void> => {
  const body = `
    <tr>
      <td align="center" style="background:#ffffff;padding:36px 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" width="60" height="60"
              style="width:60px;height:60px;background-color:#d1fae5;border-radius:50%;
                     font-size:28px;line-height:60px;text-align:center;">&#127881;</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:14px 40px 0;">
        <span style="display:inline-block;background-color:#d1fae5;color:#065f46;
                     font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
                     padding:5px 16px;border-radius:20px;font-family:Arial,Helvetica,sans-serif;">
          Application Approved
        </span>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:14px 40px 0;">
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">
          Welcome to the YLSH Mentor Team!
        </h1>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:16px 48px 0;">
        <p style="margin:0 0 14px;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          Hi <strong>${name}</strong>,
        </p>
        <p style="margin:0 0 14px;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          Congratulations! Your mentor application has been reviewed and
          <strong style="color:#065f46;">approved</strong>. We're thrilled to have you join the
          YLSH mentor community.
        </p>
        <p style="margin:0 0 28px;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          You can now access your Mentor Portal to set your availability, connect with mentees,
          and start making an impact on the next generation of young leaders.
        </p>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:4px 40px 44px;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="background-color:#0e7490;border-radius:8px;">
              <a href="${CLIENT_URL}/signin"
                style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;
                       color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">
                Access Mentor Portal &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
  await send(to, 'Congratulations — Your Mentor Application is Approved!', shell('#065f46', '#10b981', body)).catch(() => {})
}

// ─── Mentor Decline ──────────────────────────────────────────────────────────

export const sendMentorDeclineEmail = async (to: string, name: string, note?: string): Promise<void> => {
  const reviewerNote = note
    ? `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:20px 0 14px;">
        <tr>
          <td style="background-color:#f8fafc;border-left:4px solid #94a3b8;
                     border-radius:0 8px 8px 0;padding:14px 18px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;
                       text-transform:uppercase;color:#64748b;font-family:Arial,Helvetica,sans-serif;">
              Reviewer Note
            </p>
            <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
              ${note}
            </p>
          </td>
        </tr>
      </table>`
    : ''

  const body = `
    <tr>
      <td align="center" style="background:#ffffff;padding:36px 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" width="60" height="60"
              style="width:60px;height:60px;background-color:#f1f5f9;border-radius:50%;
                     font-size:26px;line-height:60px;text-align:center;">&#128203;</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:18px 40px 0;">
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">
          Update on Your Mentor Application
        </h1>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;padding:16px 48px 44px;">
        <p style="margin:0 0 14px;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          Hi <strong>${name}</strong>,
        </p>
        <p style="margin:0 0 14px;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          Thank you for taking the time to apply as a mentor on the YLSH platform. After careful
          consideration, we are unable to approve your application at this time.
        </p>
        ${reviewerNote}
        <p style="margin:0;font-size:15px;color:#334155;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          We truly appreciate your commitment to youth leadership and warmly encourage you to
          apply again in future cohorts. Thank you for being part of the YLSH community.
        </p>
      </td>
    </tr>
  `
  await send(to, 'Update on Your YLSH Mentor Application', shell('#475569', '#94a3b8', body)).catch(() => {})
}
