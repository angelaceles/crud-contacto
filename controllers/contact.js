const Contact = require("../model/contact");
const cloudinary = require("../Utils/cloudinary");
const fs = require('fs')

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener los contactos');
  }
};

const getSignleContact = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener el contacto');
  }
};

const postContact = async(req, res) => {
    try {
        if (!req.file) {
          return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
        }
    
        const { path } = req.file;
        const result = await cloudinary.uploader.upload(path);
        const { secure_url, public_id } = result;
    
        const contact = new Contact({
          name: req.body.name,
          lastname: req.body.lastname,
          email: req.body.email,
          fecha_nac: new Date(req.body.fecha_nac),
          image: secure_url,
          cloudinary_id: public_id
        });
    
        await contact.save();
        fs.unlinkSync(path);
        res.redirect('/');

      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear el contacto' });
    }
};

const putContact = async(req, res) => {
    try {
        let contact = await Contact.findById(req.params.id).exec();
    
        if (!contact) {
          return res.status(404).json({ error: 'Contacto no encontrado' });
        }
    
        if (req.file) {
          await cloudinary.uploader.destroy(contact.cloudinary_id);
          const result = await cloudinary.uploader.upload(req.file.path);
          contact.image = result.secure_url;
          contact.cloudinary_id = result.public_id;
          fs.unlinkSync(req.file.path);
        }
    
        const data = {
            name: req.body.name || contact.name,
            lastname: req.body.lastname || contact.lastname,
            email: req.body.email || contact.email,
            fecha_nac: req.body.fecha_nac ? new Date(req.body.fecha_nac) : contact.fecha_nac,
            image: contact.image,
            cloudinary_id: contact.cloudinary_id,
        };
    
        contact = await Contact.findByIdAndUpdate(req.params.id, data, { new: true });
        res.redirect('/');
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al actualizar el contacto' });
    }
};

const delContact = async (req, res) => {
  try {
      const contact = await Contact.findByIdAndDelete(req);
      if (!contact) {
        return res.status(404).json({ error: 'Contacto no encontrado' });
      }
  
      await cloudinary.uploader.destroy(contact.cloudinary_id);
      await Contact.findByIdAndRemove(req).exec();
      res.redirect('/');
      res.status(200).json({ message: 'Contacto eliminado exitosamente' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al eliminar el contacto' });
  }
};

module.exports = {
    getAllContacts,
    postContact,
    putContact,
    delContact,
    getSignleContact
};
