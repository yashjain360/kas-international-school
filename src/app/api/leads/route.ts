import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { LeadEnquiryModel } from '@/server/models';
import { getSessionUser } from '@/server/auth';
import { sendLeadConfirmationEmail } from '@/server/mailer';

export async function POST(req: NextRequest) {
  try {
    const { parentName, studentName, email, phone, targetGrade, previousSchool, message } = await req.json();

    if (!parentName || !studentName || !email || !phone || !targetGrade) {
      return NextResponse.json({ error: 'Please fill in all mandatory admission fields.' }, { status: 400 });
    }

    await connectToDatabase();
    const count = await LeadEnquiryModel.countDocuments();
    const enquiryNo = `ENQ-2026-${8805 + count}`;

    const lead = await LeadEnquiryModel.create({
      enquiryNo,
      parentName: parentName.trim(),
      studentName: studentName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      targetGrade,
      previousSchool: previousSchool?.trim(),
      message: message?.trim(),
      status: 'new',
      notes: [
        {
          text: 'Inquiry registered through website portal.',
          author: 'System',
          createdAt: new Date(),
        },
      ],
    });

    // Send confirmation email asynchronously
    try {
      await sendLeadConfirmationEmail({
        parentName: lead.parentName,
        studentName: lead.studentName,
        email: lead.email,
        targetGrade: lead.targetGrade,
        enquiryNo: lead.enquiryNo,
      });
    } catch (mailErr) {
      console.warn('SMTP notice email warning:', mailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Admission inquiry submitted successfully. Our counselor will contact you shortly.',
      enquiryNo: lead.enquiryNo,
      lead,
    });
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Failed to submit admission inquiry.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin privilege required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    await connectToDatabase();
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { parentName: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { enquiryNo: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await LeadEnquiryModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    console.error('Lead fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve admission leads.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin privilege required.' }, { status: 403 });
    }

    const { id, status, note, campusVisitDate } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required.' }, { status: 400 });
    }

    await connectToDatabase();
    const lead = await LeadEnquiryModel.findById(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    if (status) lead.status = status;
    if (campusVisitDate !== undefined) lead.campusVisitDate = campusVisitDate;
    if (note && note.trim()) {
      lead.notes.push({
        text: note.trim(),
        author: user.name,
        createdAt: new Date(),
      });
    }

    await lead.save();
    return NextResponse.json({ success: true, message: 'Lead updated successfully.', lead });
  } catch (error: any) {
    console.error('Lead update error:', error);
    return NextResponse.json({ error: 'Failed to update lead.' }, { status: 500 });
  }
}
