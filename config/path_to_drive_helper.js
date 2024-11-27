require('dotenv').config();
const fs = require('fs');
const { google } = require('googleapis');

// Load environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const PARENT_FOLDER_ID = process.env.PARENT_FOLDER_ID;

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function uploadFileToDrive(filePath, fileName) {
    try {
        const fileMetadata = {
            name: fileName,
            parents: [PARENT_FOLDER_ID],
        };

        const media = {
            mimeType: 'image/png',
            body: fs.createReadStream(filePath),
        };

        // Upload file
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id',
        });

        const fileId = response.data.id;

        // Set file permissions to public
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Get file links
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
        });

        return result.data.webContentLink.replace('&export=download', '');
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        throw new Error('Failed to upload file to Google Drive');
    }
}

module.exports = { uploadFileToDrive };
