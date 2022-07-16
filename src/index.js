const express = require('express');
require('./db/mongoose');
const auth = require('./middleware/auth');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const app = express();
const port = process.env.PORT || 3000;
const multer = require('multer');

/* app.use(auth);

app.use((req,res,next) => {
    res.status(503).send('site is currently down');
}); */

/* const uplaod = multer({
    dest: 'images'
});
app.post('/upload', uplaod.single('upload'), (req, res) => {
    res.send();
}); */

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server is up on port: ' + port);
});







/* const Task = require('./models/task');
const User = require('./models/user');
const main = async () => {
    const task =  await Task.findById('62c6c526ea6d26fb45f78b0e');
    await task.populate('owner');
    console.log(task.owner);
    const user = await User.findById('62c6c51bea6d26fb45f78b08');
    await user.populate('tasks');
    console.log(user.tasks);
}
main(); */



// const myfunction = async () =>  {
//     const password = 'red123!$';
//     const hashedPassword = await bcrypt.hash(password, 8);

//     console.log(hashedPassword);

//     const isMatch = await bcrypt.compare(password, hashedPassword);
//     console.log(isMatch);
// }


// myfunction();

