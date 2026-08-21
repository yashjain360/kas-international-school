import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'mail.thewebvale.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || SMTP_PORT === 465;
const SMTP_USER = process.env.SMTP_USER || 'info@thewebvale.com';
const SMTP_PASS = process.env.SMTP_PASS || 'Global5972@';
const SMTP_FROM = process.env.SMTP_FROM || '"K.A.S. International School" <info@thewebvale.com>';

export function getTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

const baseEmailHeader = `
  <div style="background: linear-gradient(135deg, #0F2942 0%, #1E3A8A 100%); padding: 32px 24px; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px;">
    <div style="display: inline-block; background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); margin-bottom: 12px;">
      <span style="color: #F59E0B; font-weight: 800; font-size: 20px; letter-spacing: 2px;">K.A.S. INTERNATIONAL SCHOOL</span>
    </div>
    <p style="color: #E2E8F0; font-size: 13px; margin: 0; letter-spacing: 1px; text-transform: uppercase;">Excellence in Education & Character Development • Bhopal</p>
  </div>
`;

const baseEmailFooter = `
  <div style="background: #F8FAFC; padding: 24px; text-align: center; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; border-top: 1px solid #E2E8F0;">
    <p style="color: #475569; font-size: 13px; margin: 0 0 6px 0; font-weight: 600;">K.A.S. International School</p>
    <p style="color: #64748B; font-size: 12px; margin: 0 0 10px 0;">Khajuri Kalan Road, Near Krishna Mandir, Regal Town, BHEL / Awadhpuri, Bhopal, MP 462022</p>
    <p style="color: #64748B; font-size: 12px; margin: 0 0 6px 0;">📞 +91 94259 92209 | ✉️ info@thewebvale.com</p>
    <p style="color: #94A3B8; font-size: 11px; margin: 12px 0 0 0;">This is an official communication from K.A.S. International School Management Portal.</p>
  </div>
`;

export async function sendFeeReminderEmail({
  studentName,
  parentName,
  parentEmail,
  admissionNo,
  grade,
  term,
  amount,
  dueDate,
  invoiceNo,
}: {
  studentName: string;
  parentName: string;
  parentEmail: string;
  admissionNo: string;
  grade: string;
  term: string;
  amount: number;
  dueDate: string;
  invoiceNo: string;
}) {
  const transporter = getTransporter();
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Fee Payment Notice - K.A.S. International School</title>
  </head>
  <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #F1F5F9; margin: 0; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden;">
      ${baseEmailHeader}
      
      <div style="padding: 32px 28px;">
        <h2 style="color: #0F172A; margin: 0 0 16px 0; font-size: 20px;">Fee Statement & Payment Reminder</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
          Dear <strong>${parentName}</strong>,
        </p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
          We would like to gently remind you regarding the upcoming term fee dues for your ward <strong>${studentName}</strong> (Grade: ${grade}, Admission No: <strong>${admissionNo}</strong>).
        </p>

        <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #92400E; font-size: 13px; padding-bottom: 8px;"><strong>Invoice Reference:</strong></td>
              <td style="color: #92400E; font-size: 13px; text-align: right; padding-bottom: 8px;">${invoiceNo}</td>
            </tr>
            <tr>
              <td style="color: #92400E; font-size: 13px; padding-bottom: 8px;"><strong>Term Period:</strong></td>
              <td style="color: #92400E; font-size: 13px; text-align: right; padding-bottom: 8px;">${term}</td>
            </tr>
            <tr>
              <td style="color: #92400E; font-size: 13px; padding-bottom: 8px;"><strong>Due Date:</strong></td>
              <td style="color: #DC2626; font-size: 13px; font-weight: 700; text-align: right; padding-bottom: 8px;">${dueDate}</td>
            </tr>
            <tr style="border-top: 1px dashed #FCD34D;">
              <td style="color: #78350F; font-size: 15px; font-weight: 700; padding-top: 10px;">Total Payable:</td>
              <td style="color: #78350F; font-size: 18px; font-weight: 800; text-align: right; padding-top: 10px;">${formattedAmount}</td>
            </tr>
          </table>
        </div>

        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
          Please log in to the <strong>KAS Student ERP Portal</strong> to view complete fee receipts or settle the balance at the school bursar desk.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://kas-international-school.vercel.app/auth/login" style="background: #1E3A8A; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block; letter-spacing: 0.5px;">
            Access Student Fee Portal &rarr;
          </a>
        </div>

        <p style="color: #64748B; font-size: 12px; margin: 20px 0 0 0;">
          * If you have already processed this payment, kindly disregard this automated notification.
        </p>
      </div>

      ${baseEmailFooter}
    </div>
  </body>
  </html>
  `;

  return transporter.sendMail({
    from: SMTP_FROM,
    to: parentEmail,
    subject: `Fee Payment Reminder - ${studentName} (${admissionNo}) | K.A.S. International School`,
    html,
  });
}

export async function sendLeadConfirmationEmail({
  parentName,
  studentName,
  email,
  targetGrade,
  enquiryNo,
}: {
  parentName: string;
  studentName: string;
  email: string;
  targetGrade: string;
  enquiryNo: string;
}) {
  const transporter = getTransporter();

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Admission Inquiry Acknowledged - K.A.S. International School</title>
  </head>
  <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #F1F5F9; margin: 0; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden;">
      ${baseEmailHeader}
      
      <div style="padding: 32px 28px;">
        <h2 style="color: #0F172A; margin: 0 0 16px 0; font-size: 20px;">Admission Inquiry Received</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
          Dear <strong>${parentName}</strong>,
        </p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          Thank you for choosing <strong>K.A.S. International School, Bhopal</strong> for the academic journey of <strong>${studentName}</strong>. We have registered your inquiry for <strong>${targetGrade}</strong> (Reference No: <strong style="color: #1E3A8A;">${enquiryNo}</strong>).
        </p>

        <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
          <h3 style="color: #166534; font-size: 14px; margin: 0 0 8px 0;">Next Steps in Admission Procedure:</h3>
          <ul style="color: #15803D; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Our Senior Admission Counselor will contact you within 24 hours.</li>
            <li>Campus walkthrough and interactive session scheduling.</li>
            <li>Submission of prior scholastic records and birth certification.</li>
          </ul>
        </div>

        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          For urgent queries or immediate campus visit arrangements, reach our Admissions Desk at <strong>+91 94259 92209</strong> or visit our office at Regal Town, BHEL, Bhopal.
        </p>
      </div>

      ${baseEmailFooter}
    </div>
  </body>
  </html>
  `;

  return transporter.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: `Admission Inquiry Confirmation [${enquiryNo}] - K.A.S. International School`,
    html,
  });
}

export async function sendBroadcastEmail({
  recipients,
  subject,
  htmlContent,
  senderName,
}: {
  recipients: string[];
  subject: string;
  htmlContent: string;
  senderName: string;
}) {
  const transporter = getTransporter();

  const fullHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${subject}</title>
  </head>
  <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #F1F5F9; margin: 0; padding: 24px;">
    <div style="max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden;">
      ${baseEmailHeader}
      
      <div style="padding: 32px 28px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px;">
          <span style="color: #64748B; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Official Announcement</span>
          <span style="color: #64748B; font-size: 12px;">Issued by: <strong>${senderName}</strong></span>
        </div>
        
        <div style="color: #1E293B; font-size: 15px; line-height: 1.7;">
          ${htmlContent}
        </div>
      </div>

      ${baseEmailFooter}
    </div>
  </body>
  </html>
  `;

  // Send individually or in bulk BCC
  return transporter.sendMail({
    from: SMTP_FROM,
    to: SMTP_USER, // Main to address
    bcc: recipients,
    subject: `[KAS Circular] ${subject}`,
    html: fullHtml,
  });
}
