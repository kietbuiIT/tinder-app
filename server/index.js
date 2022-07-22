const PORT = 8000
const express = require('express')
const {MongoClient} = require('mongodb')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');

require('dotenv').config()

const multer = require('multer');
const bodyParser = require("body-parser");

const path = require("path");

const uri = 'mongodb://localhost:27017/data'

const app = express()
app.use(cors())
app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/images', express.static('images'));


// Default
app.get('/', (req, res) => {
    res.json('Hello to my app')
})

// Sign up to the Database
app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri)
    const {email, phone, password} = req.body

    const generatedUserId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await client.connect()
        const database = client.db('data')
        const users = database.collection('users')

        const existingUser = await users.findOne({email})

        if (existingUser) {
            return res.status(409).send('User already exists. Please login')
        }

        const sanitizedEmail = email.toLowerCase()

        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            phone: phone,
            hashed_password: hashedPassword
        }

        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24
        })
        res.status(201).json({token, userId: generatedUserId})

    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
})

// Log in to the Database
app.post('/login', async (req, res) => {
    const client = new MongoClient(uri)
    const {email, password} = req.body

    try {
        await client.connect()
        const database = client.db('data')
        const users = database.collection('users')

        const user = await users.findOne({email})

        const correctPassword = await bcrypt.compare(password, user.hashed_password)

        if (user && correctPassword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24
            })
           return  res.status(201).json({token, userId: user.user_id})
        }

       return  res.status(400).json('Invalid Credentials')

    } catch (err) {
        console.log(err)
        return res.status(400).json("Nhập Sai TK Hoặc MK")
    } finally {
        await client.close()
    }
})

// Get individual user
app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const userId = req.query.userId

    try {
        await client.connect()
        const database = client.db('data')
        const users = database.collection('users')

        const query = {user_id: userId}
        const user = await users.findOne(query)
        res.send(user)

    } finally {
        await client.close()
    }
})

// Update User with a match
app.put('/addmatch', async (req, res) => {
    const client = new MongoClient(uri)
    const {userId, matchedUserId} = req.body
    try {
        await client.connect()
        const database = client.db('data')
        const users = database.collection('users')

        const query = {user_id: userId}
        const updateDocument = {
            $push: {matches: {user_id: matchedUserId}}
        }
        const user = await users.updateOne(query, updateDocument)
        res.send(user)
    } finally {
        await client.close()
    }
})

// Get all Users by userIds in the Database
app.get('/users', async (req, res) => {
    const client = new MongoClient(uri)
    const userIds = JSON.parse(req.query.userIds)

    try {
        await client.connect()
        const database = client.db('data')
        const users = database.collection('users')

        const pipeline =
            [
                {
                    '$match': {
                        'user_id': {
                            '$in': userIds
                        }
                    }
                }
            ]

        const foundUsers = await users.aggregate(pipeline).toArray()

        res.json(foundUsers)
        console.log(foundUsers)

    } finally {
        await client.close()
    }
})

// Get all the Gendered Users in the Database
app.get('/gendered-users', async (req, res) => {
    const client = new MongoClient(uri)
    const gender = req.query.gender

    try {
        await client.connect()
        const database = client.db('data')
        const users = database.collection('users')
        const query = {gender_identity: {$eq: gender}}
        const foundUsers = await users.find(query).toArray()
        res.json(foundUsers)

    } finally {
        await client.close()
    }
})

// Update a User in the Database
app.put('/user',async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData
    try {
        await client.connect()
        const database = client.db('data')
        const users = database.collection('users')
        const query = {user_id: formData.user_id}
        const date = new Date();

        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                last_name: formData.last_name,
                date:formData.date,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                about: formData.about,
                matches: formData.matches,
                birthplace: formData.birthplace,
                location: formData.location,
                interests: formData.interests,
                education: formData.education,
                createAt: date,
                status: "active"
            },
        }

        const insertedUser = await users.updateOne(query, updateDocument)
        res.json(insertedUser)

    } finally {
        await client.close()
    }
})



// Get Messages by from_userId and to_userId
app.get('/messages', async (req, res) => {
    const {userId, correspondingUserId} = req.query
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const database = client.db('data')
        const messages = database.collection('messages')

        const query = {
            from_userId: userId, to_userId: correspondingUserId
        }
        const foundMessages = await messages.find(query).toArray()
        res.send(foundMessages)
    } finally {
        await client.close()
    }
})

// Add a Message to our Database
app.post('/message', async (req, res) => {
    const client = new MongoClient(uri)
    const message = req.body.message

    try {
        await client.connect()
        const database = client.db('data')
        const messages = database.collection('messages')

        const insertedMessage = await messages.insertOne(message)
        res.send(insertedMessage)
    } finally {
        await client.close()
    }
})

// setup upload image
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname))
    }
});
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }

};
let upload = multer({storage, fileFilter})

//Upload image Avatar
app.post('/image/add', upload.array('image'),async (req, res) => {
    const client = new MongoClient(uri)
    const images = req.files;
    const userId = req.body.userId;
    const query = {user_id: userId}
    try {
        await client.connect()
        const database = client.db('data')
        const users = database.collection('users')
        const url = req.protocol + '://' + req.get('host')

        let photos = []
        images.forEach( (doc, index) => {
          //  const name = 'avatar ' + index
            photos.push([
                 doc.filename
            ])
        })
        const image = url + '/images/' + photos[0];
        console.log(image)

        const updateDocument = {
            $set: {
                image_avatar: image
            },
        }
            const insertedUser = await users.updateOne( query, updateDocument)
        res.json(insertedUser)

    }
    finally {
        await client.close()
    }

})

//Upload Multiple Image
app.post('/images/add', upload.array('images'), async (req, res, next) => {
    const client = new MongoClient(uri)
    const images = req.files;
    console.log(images)
    const userId = req.body.userId;
    const query = {user_id: userId}
    const url = req.protocol + '://' + req.get('host')
    try {
        await client.connect()
        const database = client.db('data')
        const users = database.collection('users')
        let fileInfo = []
        images.forEach( (doc, index) => {
          const name = 'avatar ' + index
            fileInfo.push([
                url + '/images/' + doc.filename
        ])
        })
        console.log(fileInfo)
        const updateDocument = {
            $set: {
                relate_image: fileInfo
            },
        }
        const insertedUser = await users.updateOne( query, updateDocument)
        res.json(insertedUser)

    }finally {
        await client.close()
    }
})

app.post('/forgotpassword', async (req, res, next) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData;
    const email = formData.email
    const phone = formData.phone
    const newpassword = formData.newpassword
    let mailTransporter = nodemailer.createTransport(
    {
        service: "gmail",
        auth: {
            user: "tindercloneservice@gmail.com",
            pass: "ebnwsejnnrvwhteg"
        }
        }
    )
    try {
        await client.connect()
        const database = client.db('data')
        const users = database.collection('users')

        const existingUser = await users.findOne({email});

        const query = {user_id: existingUser.user_id}


        if (existingUser && existingUser.phone === phone){
                const newHashedPassword = await bcrypt.hash(newpassword, 10)
                console.log(newHashedPassword)
                const data = {
                    $set: {
                        hashed_password: newHashedPassword
                    }
                }
                await users.updateOne( query ,data)
            let details = {
                    from: "tindercloneservice@gmail.com",
                    to: "01632142865a@gmail.com",
                    subject: 'Password',
                    text: 'Mật khẩu của bạn đã được cập nhật'
                }
                await  mailTransporter.sendMail(details, (err) => {
                    if(err) {
                        console.log(err)
                    }else{
                       return  res.status(200).json("qua ben kia lay")
                    }
                })
        }else {
            return res.status(400).json("Lỗi email hay phone")
         }

        res.status(200).json("abc")
    } finally {
        await client.close()
    }
})

app.get('/userall', async (req, res, next) => {
    const client = new MongoClient(uri)
    try {
        await client.connect()
        const database = client.db('data')
        const users = database.collection('users')

        const getAll = await users.find({}).toArray();

        res.status(200).json(getAll)
    }finally {
        await client.close()
    }

})

app.listen(PORT, () => console.log('server running on PORT ' + PORT))
