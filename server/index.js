const express = require('express')
const app = express()
var cors = require('cors')
app.use(cors())
const mysql = require('mysql');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
const PORT = process.env.PORT || 5000
app.use(express.static('public'))


const { Sequelize, Model, DataTypes } = require('sequelize');

// ---------------to run the app with localhost server-------------

const sequelize = new Sequelize('twilio_test', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql'
});


async function fn() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
fn()



const PhoneInfo = sequelize.define('phoneInfo', {
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: false
});



app.post("/add", async (req, res) => {
    const data = req.body
    try {
        await PhoneInfo.sync();

        let response = await PhoneInfo.findOrCreate({
            where: {
                phone_number: data.number
            },
            defaults: {

                phone_number: data.number,
                date: data.date
            }
        })

        console.log(response);

        res.status(201).json({
            message: "client post" + " " + data.message,
            success: true
        })

    }
    catch (err) {
        res.status(500).send({
            message: "Invalid information",
            status: false
        });
    }
})

app.post('/delete', async (req, res) => {
    try {
        let number = req.body.number
        let response = await PhoneInfo.destroy({
            where: {
                phone_number: number
            }
        })

        res.json({
            status: "success"
        })
    }
    catch (err) {
        console.log(err);
        res.json({
            status: "failed"
        })
    }
})
app.post('/edit', async (req, res) => {
    try {
        let oldNumber = req.body.oldNumber
        let newNumber = req.body.newNumber

        let contact = await PhoneInfo.findOne({
            where: {
                phone_number: oldNumber
            }
        })

        contact.update({
            phone_number: newNumber
        })

        res.json({
            status: "success"
        })


    }
    catch (err) {
        console.log(err);

        res.json({
            status: "failed"
        })
    }
})


// app.post("/aaaa", async (req, res) => {
//     console.log(req.body);
//     res.end()
// })

app.get('/contacts', async (req, res) => {

    try {
        let response = await PhoneInfo.findAll()
        res.json(response)
    }
    catch (err) {
        console.log(err);
    }

})

app.get('/all/:id', async (req, res) => {
    try {
        const data = req.params.id
        console.log(data);
        res.status(201).json({
            message: "client get" + " " + data,
            success: true
        })
    }
    catch (err) {
        res.status(404).send({
            message: "Invalid information",
            status: false
        });
    }
})




app.listen(PORT, () => {
    console.log("the server is listening on port 5000")
})