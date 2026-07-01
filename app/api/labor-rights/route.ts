import { NextRequest, NextResponse } from 'next/server';
import { getLaborRightsCategories, syncLaborLaw } from '@/lib/labor-rights-helper';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const triggerSync = searchParams.get('sync') === 'true';
    const forceSync = searchParams.get('force') === 'true';

    if (triggerSync || forceSync) {
      const syncResult = await syncLaborLaw(forceSync);
      return NextResponse.json({
        success: true,
        message: syncResult.message,
        synced: syncResult.synced
      });
    }

    const categoriesData = await getLaborRightsCategories();
    return NextResponse.json(categoriesData);
  } catch (error: any) {
    console.error('Error in /api/labor-rights:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve or sync labor rights data.', details: error.message },
      { status: 500 }
    );
  }
}
