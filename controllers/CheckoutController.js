const Checkout = require("../models/Checkout")
const mailer = require("../mailer/index")

async function createRecord(req, res) {
    try {
        var data = new Checkout(req.body)
        data.date = new Date()
        await data.save()

        let finalData = await Checkout.findOne({ _id: data._id }).populate([
            {
                path: "user",
                select: "name username phone email address pin city state"
            },
            {
                path: "products.product",
                select: "name brand color size finalPrice stockQuantity pic",
                populate: [
                    {
                        path: "brand",
                        select: "name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            }
        ])
        let { user } = finalData
        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: user.email,
            subject: "Your Order Has Been Placed : Team Ducart",
            text: `
                    Hello ${user.name}
                    Your Order Has Been Placed Successfully
                    Now You Can Track Your Order in Profile Page of Our Website
                    Team : Ducart
                `
        }, (error) => {
            if (error)
                console.log(error)
        })

        res.send({ result: "Done", data: finalData })
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        error.errors?.user ? errorMessage['user'] = error.errors?.user?.message : null
        error.errors?.subtotal ? errorMessage['subtotal'] = error.errors?.subtotal?.message : null
        error.errors?.shipping ? errorMessage['shipping'] = error.errors?.shipping?.message : null
        error.errors?.total ? errorMessage['total'] = error.errors?.total?.message : null

        Object.keys(errorMessage).length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.send({ result: "Fail", reason: "Missing Fields", error: errorMessage })
    }
}

async function getRecord(req, res) {
    try {
        const data = await Checkout.find().sort({ _id: -1 }).populate([
            {
                path: "user",
                select: "name username phone email address pin city state"
            },
            {
                path: "products.product",
                select: "name brand color size finalPrice stockQuantity pic",
                populate: [
                    {
                        path: "brand",
                        select: "name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            }
        ])
        res.send({ result: "Done", data: data, count: data.length })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function getUserRecord(req, res) {
    try {
        const data = await Checkout.find({ user: req.body.userid }).sort({ _id: -1 }).populate([
            {
                path: "user",
                select: "name username phone email address pin city state"
            },
            {
                path: "products.product",
                select: "name brand color size finalPrice stockQuantity pic",
                populate: [
                    {
                        path: "brand",
                        select: "name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            }
        ])
        res.send({ result: "Done", data: data, count: data.length })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function getSingleRecord(req, res) {
    try {
        const data = await Checkout.findOne({ _id: req.params._id }).populate([
            {
                path: "user",
                select: "name username phone email address pin city state"
            },
            {
                path: "products.product",
                select: "name brand color size finalPrice stockQuantity pic",
                populate: [
                    {
                        path: "brand",
                        select: "name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            }
        ])
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function updateRecord(req, res) {
    try {
        var data = await Checkout.findOne({ _id: req.params._id })
        if (data) {
            data.paymentMode = req.body.paymentMode ?? data.paymentMode
            data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus
            data.orderStatus = req.body.orderStatus ?? data.orderStatus
            data.rppid = req.body.rppid ?? data.rppid
            await data.save()

            let finalData = await Checkout.findOne({ _id: data._id }).populate([
                {
                    path: "user",
                    select: "name username phone email address pin city state"
                },
                {
                    path: "products.product",
                    select: "name brand color size finalPrice stockQuantity pic",
                    populate: [
                        {
                            path: "brand",
                            select: "name"
                        }
                    ],
                    options: {
                        slice: {
                            pic: 1
                        }
                    }
                }
            ])
            let { user } = finalData
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: user.email,
                subject: "Your Order Status Has Been Updated : Team Ducart",
                text: `
                        Hello ${user.name}
                        Your Order Status Has Been Updated
                        Status : ${req.body.orderStatus}
                        Now You Can Track Your Order in Profile Page of Our Website
                        Team : Ducart
                    `
            }, (error) => {
                if (error)
                    console.log(error)
            })
            res.send({ result: "Done", data: finalData })
        }
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function deleteRecord(req, res) {
    try {
        const data = await Checkout.findOne({ _id: req.params._id })
        await data.deleteOne()
        res.send({ result: "Done", reason: "Record Has Been Deleted" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

module.exports = {
    getRecord,
    createRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    getUserRecord
}