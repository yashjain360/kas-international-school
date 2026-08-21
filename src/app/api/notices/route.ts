import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { NoticeModel } from '@/server/models';
import { getSessionUser } from '@/server/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const audience = searchParams.get('audience');

    await connectToDatabase();
    const query: any = {};
    if (category && category !== 'all') query.category = category;
    if (audience && audience !== 'all') query.targetAudience = { $in: ['all', audience] };

    const notices = await NoticeModel.find(query).sort({ isPinned: -1, publishedDate: -1 });
    return NextResponse.json({ success: true, notices });
  } catch (error: any) {
    console.error('Notices fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve notices.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin privilege required.' }, { status: 403 });
    }

    const { title, content, category, targetAudience, isPinned, priority } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    await connectToDatabase();
    const notice = await NoticeModel.create({
      title: title.trim(),
      content: content.trim(),
      category: category || 'academic',
      targetAudience: targetAudience || 'all',
      isPinned: Boolean(isPinned),
      priority: priority || 'medium',
      publishedDate: new Date().toISOString().split('T')[0],
      authorName: `${user.name} (${user.designation || 'Principal Office'})`,
    });

    return NextResponse.json({ success: true, message: 'Notice published successfully.', notice });
  } catch (error: any) {
    console.error('Notice creation error:', error);
    return NextResponse.json({ error: 'Failed to publish notice.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin privilege required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Notice ID is required.' }, { status: 400 });
    }

    await connectToDatabase();
    await NoticeModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Notice deleted successfully.' });
  } catch (error: any) {
    console.error('Notice delete error:', error);
    return NextResponse.json({ error: 'Failed to delete notice.' }, { status: 500 });
  }
}
