const mongoose = require("mongoose");
const {Schema} = mongoose;

const ContactSchema = new Schema({
    name: String,
    lastname: String,
    email: String,
    fecha_nac: Date,
    image: String,
    cloudinary_id: String
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;