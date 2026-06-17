import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

const isDev = process.env.NODE_ENV !== 'production'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

const LOGO_CID = 'ylsh-logo@ylsh.ng'
const LOGO_PATH = path.resolve(__dirname, '../../../frontend/public/images/yls-logo.svg')
const logoExists = fs.existsSync(LOGO_PATH)
const LOGO_SRC = logoExists ? `cid:${LOGO_CID}` : `${CLIENT_URL}/images/yls-logo.svg`
const logoAttachment = logoExists
  ? [{ filename: 'yls-logo.svg', path: LOGO_PATH, cid: LOGO_CID, contentDisposition: 'inline' as const }]
  : []

const transporter = nodemailer.createTransport(
  isDev && !process.env.EMAIL_USER
    ? ({ jsonTransport: true } as Parameters<typeof nodemailer.createTransport>[0])
    : {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      }
)

function otpDigits(otp: string, borderColor: string, bgColor: string, textColor: string): string {
  return otp
    .split('')
    .map(
      (d) =>
        `<td style="padding:0 5px;">` +
        `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">` +
        `<tr><td width="52" height="68" align="center" valign="middle" ` +
        `style="width:52px;height:68px;background-color:${bgColor};border:2.5px solid ${borderColor};` +
        `border-radius:10px;font-size:30px;font-weight:800;color:${textColor};` +
        `font-family:'Courier New',Courier,monospace;letter-spacing:0;">${d}</td></tr>` +
        `</table></td>`
    )
    .join('')
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

    <!-- Header -->
    <tr>
      <td align="center" style="background:linear-gradient(135deg,${headerStart} 0%,${headerEnd} 100%);padding:32px 40px;">
        <img src="${LOGO_SRC}" alt="YLS Summit" height="60" style="display:block;height:60px;border:0;"/>
      </td>
    </tr>

    <!-- Accent bar -->
    <tr>
      <td height="4" style="background:linear-gradient(90deg,${headerStart},${headerEnd},${headerStart});font-size:0;line-height:0;">&nbsp;</td>
    </tr>

    <!-- Body rows -->
    ${body}

    <!-- Footer -->
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

// ─── Registration OTP ────────────────────────────────────────────────────────

export const sendOTP = async (to: string, otp: string): Promise<void> => {
  const body = `
    <tr>
      <td align="center" style="background:#ffffff;padding:36px 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" width="60" height="60"
              style="width:60px;height:60px;background-color:#e0f2fe;border-radius:50%;
                     font-size:28px;line-height:60px;text-align:center;">&#9993;</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:18px 40px 0;">
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">
          Verify Your Email Address
        </h1>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:10px 48px 0;">
        <p style="margin:0;font-size:15px;color:#64748b;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          Use the code below to complete your registration on the YLSH platform. Do not share this code with anyone.
        </p>
      </td>
    </tr>

    <!-- OTP card -->
    <tr>
      <td align="center" style="background:#ffffff;padding:32px 40px 24px;">
        <table border="0" cellpadding="0" cellspacing="0"
          style="background-color:#f0f9ff;border-radius:14px;border:1px solid #bae6fd;padding:28px 32px;">
          <tr>
            <td align="center" style="padding:0 0 14px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;
                         text-transform:uppercase;color:#0e7490;font-family:Arial,Helvetica,sans-serif;">
                Verification Code
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 0 16px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>${otpDigits(otp, '#0e7490', '#e0f2fe', '#0e7490')}</tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center">
              <p style="margin:0;font-size:13px;color:#64748b;font-family:Arial,Helvetica,sans-serif;">
                &#9201;&nbsp; Expires in <strong>10 minutes</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Warning note -->
    <tr>
      <td style="background:#ffffff;padding:0 40px 40px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="background-color:#fef9c3;border-left:4px solid #facc15;
                       border-radius:0 8px 8px 0;padding:13px 16px;">
              <p style="margin:0;font-size:13px;color:#78350f;font-family:Arial,Helvetica,sans-serif;">
                <strong>Didn't request this?</strong>&nbsp;
                You can safely ignore this email. Your account has not been affected.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `

  const info = await transporter.sendMail({
    from: `YLSH Platform <${process.env.EMAIL_USER || 'noreply@ylsh.ng'}>`,
    to,
    subject: 'Verify Your Email — YLSH Platform',
    html: shell('#0e7490', '#2bb3e0', body),
    attachments: logoAttachment,
  })

  if (isDev && !process.env.EMAIL_USER) {
    console.log(`\n📧 [DEV] Registration OTP for ${to}: ${otp}\n`)
    if (info && typeof info === 'object' && 'message' in info) {
      console.log(JSON.stringify(info, null, 2))
    }
  }
}

// ─── Super-Admin Login OTP ───────────────────────────────────────────────────

export const sendLoginOTP = async (to: string, otp: string): Promise<void> => {
  const body = `
    <tr>
      <td align="center" style="background:#ffffff;padding:36px 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" width="60" height="60"
              style="width:60px;height:60px;background-color:#fee2e2;border-radius:50%;
                     font-size:26px;line-height:60px;text-align:center;">&#128274;</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:14px 40px 0;">
        <span style="display:inline-block;background-color:#fee2e2;color:#b91c1c;
                     font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
                     padding:5px 16px;border-radius:20px;font-family:Arial,Helvetica,sans-serif;">
          Security Alert
        </span>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:14px 40px 0;">
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">
          Super Admin Login Attempt
        </h1>
      </td>
    </tr>

    <tr>
      <td align="center" style="background:#ffffff;padding:10px 48px 0;">
        <p style="margin:0;font-size:15px;color:#64748b;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
          A sign-in was attempted on your Super Admin account. Enter this one-time code to complete authentication.
        </p>
      </td>
    </tr>

    <!-- OTP card -->
    <tr>
      <td align="center" style="background:#ffffff;padding:32px 40px 24px;">
        <table border="0" cellpadding="0" cellspacing="0"
          style="background-color:#fff1f2;border-radius:14px;border:1px solid #fecdd3;padding:28px 32px;">
          <tr>
            <td align="center" style="padding:0 0 14px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;
                         text-transform:uppercase;color:#b91c1c;font-family:Arial,Helvetica,sans-serif;">
                One-Time Access Code
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 0 16px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>${otpDigits(otp, '#b91c1c', '#fee2e2', '#b91c1c')}</tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center">
              <p style="margin:0;font-size:13px;color:#64748b;font-family:Arial,Helvetica,sans-serif;">
                &#9201;&nbsp; Expires in <strong>5 minutes</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Urgent warning -->
    <tr>
      <td style="background:#ffffff;padding:0 40px 40px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="background-color:#fef2f2;border-left:4px solid #ef4444;
                       border-radius:0 8px 8px 0;padding:13px 16px;">
              <p style="margin:0;font-size:13px;color:#991b1b;font-family:Arial,Helvetica,sans-serif;">
                <strong>Not you?</strong>&nbsp;
                Contact your system administrator immediately. Never share this code with anyone.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `

  const info = await transporter.sendMail({
    from: `YLSH Platform <${process.env.EMAIL_USER || 'noreply@ylsh.ng'}>`,
    to,
    subject: '[ACTION REQUIRED] YLSH Admin Login Verification Code',
    html: shell('#991b1b', '#dc2626', body),
    attachments: logoAttachment,
  })

  if (isDev && !process.env.EMAIL_USER) {
    console.log(`\n🔐 [DEV] Super-Admin Login OTP for ${to}: ${otp}\n`)
    if (info && typeof info === 'object' && 'message' in info) {
      console.log(JSON.stringify(info, null, 2))
    }
  }
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

  await transporter
    .sendMail({
      from: `YLSH Platform <${process.env.EMAIL_USER || 'noreply@ylsh.ng'}>`,
      to,
      subject: 'Congratulations — Your Mentor Application is Approved!',
      html: shell('#065f46', '#10b981', body),
      attachments: logoAttachment,
    })
    .catch(() => {})

  if (isDev && !process.env.EMAIL_USER) {
    console.log(`\n✅ [DEV] Mentor approval email sent to ${to}\n`)
  }
}

// ─── Mentor Decline ──────────────────────────────────────────────────────────

export const sendMentorDeclineEmail = async (
  to: string,
  name: string,
  note?: string
): Promise<void> => {
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

  await transporter
    .sendMail({
      from: `YLSH Platform <${process.env.EMAIL_USER || 'noreply@ylsh.ng'}>`,
      to,
      subject: 'Update on Your YLSH Mentor Application',
      html: shell('#475569', '#94a3b8', body),
      attachments: logoAttachment,
    })
    .catch(() => {})

  if (isDev && !process.env.EMAIL_USER) {
    console.log(`\n❌ [DEV] Mentor decline email sent to ${to}\n`)
  }
}
