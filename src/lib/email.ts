import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

interface PartnerSelection {
  partnerName: string;
  interestType: string;
}

interface SubmissionEmailData {
  merchantName: string;
  merchantEmail: string;
  merchantPhone: string;
  partners: PartnerSelection[];
  submittedAt: string;
}

export async function sendSubmissionEmail(data: SubmissionEmailData) {
  const resend = getResend();
  const toEmail = process.env.AM_TEAM_EMAIL;
  if (!resend || !toEmail) {
    console.warn("Email not configured (RESEND_API_KEY or AM_TEAM_EMAIL missing), skipping notification");
    return;
  }

  const partnersList = data.partners
    .map(
      (p) =>
        `  - ${p.partnerName}: ${p.interestType.charAt(0).toUpperCase() + p.interestType.slice(1)}`
    )
    .join("\n");

  await resend.emails.send({
    from: process.env.FROM_EMAIL || "Resal Connect <noreply@resend.dev>",
    to: toEmail,
    subject: `New Resal Connect Request from ${data.merchantName}`,
    text: `New merchant interest submission:

Merchant: ${data.merchantName}
Email: ${data.merchantEmail}
Phone: ${data.merchantPhone || "N/A"}
Submitted: ${data.submittedAt}

Selected Partners:
${partnersList}

Please follow up with this merchant.
`,
  });
}
