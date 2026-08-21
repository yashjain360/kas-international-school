import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { AssessmentTermModel } from '@/server/models';
import { getSessionUser } from '@/server/auth';

const defaultTerms = [
  {
    session: '2026-2027',
    code: 'FA1',
    title: 'Formative Assessment 1 (FA-1)',
    startDate: '2026-07-15',
    endDate: '2026-07-22',
    weightagePercentage: 10,
    gradesApplicable: ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 6', 'Grade 4'],
    status: 'published',
    isPublished: true,
    description: 'First quarter unit evaluation covering foundational syllabus units and practical project work.',
  },
  {
    session: '2026-2027',
    code: 'FA2',
    title: 'Formative Assessment 2 (FA-2)',
    startDate: '2026-09-08',
    endDate: '2026-09-16',
    weightagePercentage: 10,
    gradesApplicable: ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 6', 'Grade 4'],
    status: 'published',
    isPublished: true,
    description: 'Mid-term periodic evaluation including class presentations and lab notebook verification.',
  },
  {
    session: '2026-2027',
    code: 'SA1',
    title: 'Summative Assessment 1 (Half-Yearly Examination)',
    startDate: '2026-10-10',
    endDate: '2026-10-24',
    weightagePercentage: 30,
    gradesApplicable: ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 6', 'Grade 4'],
    status: 'active',
    isPublished: true,
    description: 'Comprehensive mid-year examination evaluating 50% cumulative CBSE syllabus with full theory papers.',
  },
  {
    session: '2026-2027',
    code: 'FA3',
    title: 'Formative Assessment 3 (FA-3)',
    startDate: '2026-12-05',
    endDate: '2026-12-14',
    weightagePercentage: 10,
    gradesApplicable: ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 6', 'Grade 4'],
    status: 'upcoming',
    isPublished: true,
    description: 'Third quarter testing module focusing on application problem-solving and science demonstrations.',
  },
  {
    session: '2026-2027',
    code: 'FA4',
    title: 'Formative Assessment 4 (FA-4 / Pre-Boards)',
    startDate: '2027-01-15',
    endDate: '2027-01-25',
    weightagePercentage: 10,
    gradesApplicable: ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 6', 'Grade 4'],
    status: 'upcoming',
    isPublished: true,
    description: 'Pre-annual revision test series and model examination for Board & promotion candidates.',
  },
  {
    session: '2026-2027',
    code: 'SA2',
    title: 'Summative Assessment 2 (Annual Final Examination)',
    startDate: '2027-03-01',
    endDate: '2027-03-18',
    weightagePercentage: 30,
    gradesApplicable: ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 6', 'Grade 4'],
    status: 'upcoming',
    isPublished: true,
    description: 'Annual comprehensive evaluation culminating in final session marksheet, GPA, and promotion certificate.',
  },
  // 2025-2026 Historical Archive Session
  {
    session: '2025-2026',
    code: 'SA1',
    title: 'Summative Assessment 1 (Half-Yearly Examination 2025)',
    startDate: '2025-10-12',
    endDate: '2025-10-25',
    weightagePercentage: 50,
    gradesApplicable: ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 6', 'Grade 4'],
    status: 'closed',
    isPublished: true,
    description: 'Historical archive term evaluation for 2025-26 academic year.',
  },
  {
    session: '2025-2026',
    code: 'SA2',
    title: 'Annual Final Examination 2025-26',
    startDate: '2026-03-02',
    endDate: '2026-03-20',
    weightagePercentage: 50,
    gradesApplicable: ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 6', 'Grade 4'],
    status: 'closed',
    isPublished: true,
    description: 'Historical final promotion report cards for 2025-26 academic year.',
  },
];

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');

    await connectToDatabase();

    // Auto-seed if terms table is empty
    const count = await AssessmentTermModel.countDocuments();
    if (count === 0) {
      await AssessmentTermModel.insertMany(defaultTerms);
    }

    const query: any = {};
    if (session && session !== 'all') {
      query.session = session;
    }

    const terms = await AssessmentTermModel.find(query).sort({ session: -1, startDate: 1 });

    // Distinct list of available sessions
    const sessions = await AssessmentTermModel.distinct('session');
    if (!sessions.includes('2026-2027')) sessions.unshift('2026-2027');

    return NextResponse.json({
      success: true,
      terms,
      sessions: sessions.sort().reverse(),
    });
  } catch (error: any) {
    console.error('Terms fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve assessment terms.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authority required to configure terms.' }, { status: 403 });
    }

    const body = await req.json();
    const { session, code, title, startDate, endDate, weightagePercentage, gradesApplicable, description, status } = body;

    if (!session || !code || !title || !startDate || !endDate) {
      return NextResponse.json({ error: 'Session, Term Code, Title, Start Date, and End Date are mandatory.' }, { status: 400 });
    }

    await connectToDatabase();

    const normalizedCode = code.toUpperCase().trim();
    const term = await AssessmentTermModel.findOneAndUpdate(
      { session, code: normalizedCode },
      {
        session,
        code: normalizedCode,
        title: title.trim(),
        startDate,
        endDate,
        weightagePercentage: Number(weightagePercentage) || 10,
        gradesApplicable: Array.isArray(gradesApplicable) && gradesApplicable.length > 0
          ? gradesApplicable
          : ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 6', 'Grade 4'],
        status: status || 'active',
        isPublished: true,
        description: description || `Assessment evaluation window for ${title}`,
        createdBy: `${user.name} (Admin)`,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Assessment term ${normalizedCode} for session ${session} created / updated successfully.`,
      term,
    });
  } catch (error: any) {
    console.error('Create term error:', error);
    return NextResponse.json({ error: 'Failed to create assessment term.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authority required.' }, { status: 403 });
    }

    const { id, status, isPublished, startDate, endDate, weightagePercentage, title } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Term ID required.' }, { status: 400 });
    }

    await connectToDatabase();
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (weightagePercentage !== undefined) updateData.weightagePercentage = Number(weightagePercentage);
    if (title !== undefined) updateData.title = title;

    const term = await AssessmentTermModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!term) {
      return NextResponse.json({ error: 'Term not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Term ${term.code} status updated.`,
      term,
    });
  } catch (error: any) {
    console.error('Update term error:', error);
    return NextResponse.json({ error: 'Failed to update term.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authority required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Term ID required.' }, { status: 400 });
    }

    await connectToDatabase();
    await AssessmentTermModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Assessment term removed from timeline.',
    });
  } catch (error: any) {
    console.error('Delete term error:', error);
    return NextResponse.json({ error: 'Failed to delete term.' }, { status: 500 });
  }
}
