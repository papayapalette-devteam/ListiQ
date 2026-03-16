const { supabasePublic, supabaseAdmin } = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabasePublic.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check if user is suspended (assuming profiles table has status)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching user profile:', profileError);
    }

    if (profile && profile.status === 'suspended') {
      return res.status(403).json({ error: 'Account suspended' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authMiddleware;
