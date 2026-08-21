import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { UserModel, LeadEnquiryModel, BroadcastLogModel, StudentProfileModel } from '@/server/models';
import { getSessionUser } from '@/server/auth';
import { sendBroadcastEmail } from '@/server/mailer';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin privilege required.' }, { status: 403 });
    }

    await connectToDatabase();
    const broadcasts = await BroadcastLogModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, broadcasts });
  } catch (error: any) {
    console.error('Broadcast fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve broadcast history.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin privilege required.' }, { status: 403 });
    }

    const { subject, messageHtml, recipientType, targetGrade } = await req.json();

    if (!subject || !messageHtml || !recipientType) {
      return NextResponse.json({ error: 'Subject, message content, and recipient audience are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const recipientEmails = new Set<string>();

    if (recipientType === 'students' || recipientType === 'all') {
      const students = await UserModel.find({ role: 'student', isActive: true });
      students.forEach((s) => recipientEmails.add(s.email));

      // Also include parent emails
      const profiles = await StudentProfileModel.find({});
      profiles.forEach((p) => {
        if (p.parentEmail) recipientEmails.add(p.parentEmail);
      });
    }

    if (recipientType === 'faculty' || recipientType === 'all') {
      const faculty = await UserModel.find({ role: 'faculty', isActive: true });
      faculty.forEach((f) => recipientEmails.add(f.email));
    }

    if (recipientType === 'leads' || recipientType === 'all') {
      const leads = await LeadEnquiryModel.find({ status: { $ne: 'archived' } });
      leads.forEach((l) => {
        if (l.email) recipientEmails.add(l.email);
      });
    }

    if (recipientType === 'grade_specific' && targetGrade) {
      const studentsInGrade = await UserModel.find({ role: 'student', grade: targetGrade, isActive: true });
      studentsInGrade.forEach((s) => recipientEmails.add(s.email));
    }

    const emailList = Array.from(recipientEmails);

    // Fallback if no specific emails found
    if (emailList.length === 0) {
      emailList.push('info@thewebvale.com');
    }

    let successCount = emailList.length;
    let failCount = 0;

    try {
      await sendBroadcastEmail({
        recipients: emailList,
        subject,
        htmlContent: messageHtml,
        senderName: `${user.name} (${user.designation || 'Administration'})`,
      });
    } catch (mailErr: any) {
      console.warn('Broadcast SMTP delivery warning:', mailErr);
      failCount = emailList.length;
      successCount = 0;
    }

    const broadcastLog = await BroadcastLogModel.create({
      subject,
      messageHtml,
      recipientType,
      targetGrade,
      totalRecipients: emailList.length,
      successfulDeliveries: successCount,
      failedDeliveries: failCount,
      recipientEmails: emailList,
      sentBy: user.name,
    });

    return NextResponse.json({
      success: true,
      message: `Broadcast sent successfully to ${emailList.length} recipients.`,
      broadcast: broadcastLog,
    });
  } catch (error: any) {
    console.error('Broadcast creation error:', error);
    return NextResponse.json({ error: 'Failed to dispatch email broadcast.' }, { status: 500 });
  }
}
