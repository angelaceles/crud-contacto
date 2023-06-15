const express = require("express");
const { getAllContacts, postContact, 
        putContact, delContact, getSignleContact } = require("../controllers/contact");
const upload = require('../middleware/multer')
const router = express.Router()

router.get('/', getAllContacts);
router.post('/add',upload.single('image'), postContact);
router.put('/:id', upload.single("image"), putContact);
router.delete('/:id', delContact);
router.get('/:id', getSignleContact);

module.exports = router