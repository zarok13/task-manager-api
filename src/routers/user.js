const express = require('express');
const router = new express.Router();
const User = require('../models/user')
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelationEmail } = require('../email/account');


router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }

    // user.save().then(() => {
    // res.status(201).send(user);
    // }).catch((e) => {
    // res.status(400).send(e);
    // });
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutALL', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/users/me', auth, async (req, res) => {
    return res.send(req.user);
    // try {
    //     const users = await User.find({});
    //     res.send(users);
    // } catch (e) {
    //     res.status(500).send();
    // }

    // User.find({}).then((users) => {
    //     res.send(users);
    // }).catch((e) => {
    //     res.status(500).send();
    // });
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }

    // User.findById(_id).then((user) => {
    //     if(!user) {
    //         return res.status(404).send();
    //     }
    //     res.send(user);

    // }).catch((e) => {
    //     res.status(500).send();
    // });
});


const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    },
    storage: multer.memoryStorage()
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 200, height: 200
    }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/users/:id/avatar.png', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        updates.every((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    };
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;