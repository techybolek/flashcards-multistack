import { Router } from 'express';
import { supabase } from '@/lib/supabase';
import { authenticate } from '@/middleware/auth';
import type { ApiResponse } from '@/types';

const router = Router();

// Environment validation to prevent running in production
const isTestCleanupEnabled = process.env.ENABLE_TEST_CLEANUP === 'true';

// Apply authentication middleware
router.use(authenticate);

// POST /api/tests/cleanup
router.post('/cleanup', async (req, res) => {
  console.log('isTestCleanupEnabled', isTestCleanupEnabled);
  
  // Safety check: Only allow when explicitly enabled
  if (!isTestCleanupEnabled) {
    console.error('Test cleanup endpoint is not enabled. Set ENABLE_TEST_CLEANUP=true to enable it.');
    return res.json({
      success: false, 
      error: 'Test cleanup endpoint is not enabled. Set ENABLE_TEST_CLEANUP=true to enable it.',
      status: 403
    });
  }

  try {
    // Get the authenticated user's ID
    const userId = req.user!.id;

    // Delete records from all three tables in a specific order to respect foreign key constraints
    const { error: flashcardsError, count: flashcardsCount } = await supabase
      .from('flashcards')
      .delete({ count: 'exact' })
      .eq('user_id', userId);

    const { error: generationsError, count: generationsCount } = await supabase
      .from('generations')
      .delete({ count: 'exact' })
      .eq('user_id', userId);

    const { error: errorLogsError, count: errorLogsCount } = await supabase
      .from('generation_error_logs')
      .delete({ count: 'exact' })
      .eq('user_id', userId);

    // Collect any errors
    const errors = [];
    if (flashcardsError) errors.push(`Flashcards: ${flashcardsError.message}`);
    if (generationsError) errors.push(`Generations: ${generationsError.message}`);
    if (errorLogsError) errors.push(`Error Logs: ${errorLogsError.message}`);

    const response: ApiResponse = {
      success: errors.length === 0,
      data: {
        deleted: {
          flashcards: flashcardsCount || 0,
          generations: generationsCount || 0,
          generation_error_logs: errorLogsCount || 0
        },
        errors: errors.length > 0 ? errors : undefined,
        status: 200
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Test cleanup error:', error);
    res.json({
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error during test cleanup',
      status: 500
    });
  }
});

export default router;