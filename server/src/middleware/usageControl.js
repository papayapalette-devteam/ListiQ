const { supabaseAdmin } = require('../config/supabase');

const checkUsage = async (action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      // Get user profile for plan details
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('plan_type')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const plan = profile.plan_type || 'free';
      
      // Count usage for today
      const today = new Date().toISOString().split('T')[0];
      const { count, error: countError } = await supabaseAdmin
        .from('usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('action', action)
        .gte('created_at', today);

      if (countError) throw countError;

      // Plan limits
      const limits = {
        generate_listing: { free: 10, pro: 100 },
        research_trending: { free: 5, pro: 999999 },
      };

      const limit = limits[action][plan];

      if (count >= limit) {
        return res.status(429).json({ 
          error: `Daily limit reached for your ${plan} plan. Please upgrade for more access.` 
        });
      }

      next();
    } catch (err) {
      console.error('Usage check error:', err);
      next(err);
    }
  };
};

module.exports = { checkUsage };
