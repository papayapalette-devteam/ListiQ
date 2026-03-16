const { v4: uuidv4 } = require('uuid');
const { supabaseAdmin } = require('../config/supabase');
const claudeService = require('../services/claude.service');
const { sanitizeString, isValidImageBuffer } = require('../utils/security');

const generateListing = async (req, res, next) => {
  try {
    const productType = sanitizeString(req.body.productType);
    const additionalNotes = sanitizeString(req.body.additionalNotes);
    const file = req.file;

    // 1. Validation & Security Checks
    if (!file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Magic Bytes Check
    if (!isValidImageBuffer(file.buffer)) {
      return res.status(400).json({ error: 'Tampered or invalid image file detected' });
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid image type. Use JPEG, PNG, or WEBP' });
    }

    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image size exceeds 5MB' });
    }

    if (!productType || productType.length > 100) {
      return res.status(400).json({ error: 'Product type is required (max 100 chars)' });
    }

    if (additionalNotes && additionalNotes.length > 1000) {
      return res.status(400).json({ error: 'Notes are too long (max 1000 chars)' });
    }

    const userId = req.user.id;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // 2. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('product-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    // Get Public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('product-images')
      .getPublicUrl(filePath);

    // 3. Convert to Base64 for Claude
    const imageBase64 = file.buffer.toString('base64');

    // 4. Call Claude Service
    const formData = { productType, additionalNotes };
    const listingData = await claudeService.generateListing(imageBase64, file.mimetype, formData);

    // 5. Save to listings table
    const { data: newListing, error: listingError } = await supabaseAdmin
      .from('listings')
      .insert({
        user_id: userId,
        product_type: productType,
        image_url: publicUrl,
        amazon_data: listingData.amazon,
        flipkart_data: listingData.flipkart,
        meesho_data: listingData.meesho,
        raw_notes: additionalNotes
      })
      .select()
      .single();

    if (listingError) {
      console.error('Database inserting listing error:', listingError);
      // We still have the AI result, but failed to save. Returning error for consistency.
      return res.status(500).json({ error: 'Failed to save listing' });
    }

    // 6. Increment user's listings_count in profiles
    const { error: profileError } = await supabaseAdmin.rpc('increment_listing_count', { row_id: userId });
    
    // Fallback if RPC isn't setup
    if (profileError) {
      console.warn('RPC increment failed, trying manual update');
      await supabaseAdmin
        .from('profiles')
        .update({ listings_count: supabaseAdmin.sql`listings_count + 1` }) // Note: might need raw Postgres or simpler select/update
        .eq('id', userId);
    }

    // 7. Log usage
    await supabaseAdmin.from('usage_logs').insert({
      user_id: userId,
      action: 'generate_listing',
      metadata: { listing_id: newListing.id }
    });

    // 8. Return result
    res.status(201).json(newListing);

  } catch (err) {
    console.error('Controller generateListing error:', err);
    next(err);
  }
};

module.exports = {
  generateListing
};
