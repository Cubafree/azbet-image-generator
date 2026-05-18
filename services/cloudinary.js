const cloudinary = require('cloudinary').v2;
const { CLOUDINARY_CONFIG } = require('../config');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(buffer, folder = 'banner-gen/generated') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', format: 'jpg' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function uploadAsset(filePath, publicId) {
  return cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    resource_type: 'image',
    overwrite: true,
  });
}

function buildOverlayUrl(imagePublicId, bannerText) {
  const { logoPublicId, framePublicId, textFont, textSize, textColor, textGravity, textY } =
    CLOUDINARY_CONFIG;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  // Encode text for Cloudinary URL (replace special chars)
  const encodedText = encodeCloudinaryText(bannerText);

  const transformations = [
    // Logo overlay at top center
    `l_${logoPublicId.replace(/\//g, ':')},g_north,w_320,y_40,fl_relative`,
    // Promo frame overlay at bottom
    `l_${framePublicId.replace(/\//g, ':')},g_south,w_1.0,y_0,fl_relative`,
    // Text on top of frame
    `l_text:${textFont}_${textSize}_bold:${encodedText},g_${textGravity},co_rgb:${textColor},y_${textY},w_900,c_fit`,
  ].join('/');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${imagePublicId}`;
}

function encodeCloudinaryText(text) {
  return encodeURIComponent(text)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '_');
}

module.exports = { uploadImage, uploadAsset, buildOverlayUrl };
