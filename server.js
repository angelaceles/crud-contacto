const express = require('express');
const path = require('path');
const upload = require('./middleware/multer')

const { postContact, putContact, 
    delContact, getSignleContact, 
    getAllContacts 
} = require('./controllers/contact');

const { default: mongoose } = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());
app.use(express.static('public'));
app.use('/api/v1', require('./routes/contact'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', async (req, res) => {
    try {
        const contacts = await getAllContacts();
        res.render('index', { contacts });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los contactos');
    }
});

app.get('/agregar', (req, res) => {
    res.render('contacto-agregar');
});


app.get('/contactos/:id', async (req, res) => {
    try {
        const contact = await getSignleContact(req.params.id);
        if (!contact) {
            return res.status(404).send('Contacto no encontrado');
        }

        res.render('contacto-detalle', { contact });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los detalles del contacto');
    }
});

app.get('/editar/:id', async (req, res) => {
    const contactId = req.params.id;
    try {
      const contact = await getSignleContact(req.params.id);
      if (!contact) {
        return res.render('error', { message: 'Contacto no encontrado' });
      }
  
      res.render('contacto-editar', { contact });
    } catch (error) {
      console.log(error);
      res.render('error', { message: 'Error al obtener el contacto' });
    }
  });  

app.post('/putContact/:id', upload.single('image'), putContact);

app.get('/contacto/eliminar/:id', async (req, res) => {
    const contactId = req.params.id;
    try {
      await delContact(contactId, res);
    } catch (error) {
      console.log(error);
      res.render('error', { message: 'Error al eliminar el contacto' });
    }
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));