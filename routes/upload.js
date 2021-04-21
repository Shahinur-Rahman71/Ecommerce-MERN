const router = require('express').Router();
const cloudniary = require('cloudinary');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const fs = require('fs');

// we can upload image on cloudinary
cloudniary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// upload image => only admin
router.route('/upload', auth, authAdmin).post((req, res) => {
    try {       
        console.log(req.files);
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: 'No file uploaded.'});

        const file = req.files.file;

        if(file.size > 1024*1024) {
            removeTmp(file.tempFilePath);
            return res.status(400).json({msg: 'File size too large'});
        }
        
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath);
            return res.status(400).json({msg: 'File format is incorrect'});
        }

        cloudniary.v2.uploader.upload(file.tempFilePath, {folder: 'test'}, async(err, result) => {
            if(err) throw err;

            removeTmp(file.tempFilePath);

            res.json({public_id: result.public_id, url: result.secure_url});
        })

    } catch (error) {
        return res.status(500).json({msg: error.message});
    }
});

// delete image => only admin
router.post('/destroy', auth, authAdmin ,(req, res) => {
    try {
        const {public_id} = req.body;

        if(!public_id) {
            return res.status(400).json({msg: 'No image selected'});
        }

        cloudniary.v2.uploader.destroy(public_id, async (err, result) => {
            if(err) throw err;

            res.json({msg: 'Image Deleted'});
        })
        
    } catch (error) {
        return res.status(500).json({msg: error.message});
    }
})

// for remove tmp
const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err;
    })
}


module.exports = router;