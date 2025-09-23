const CheckoutRouter = require("express").Router()
const { verifyBoth, verifyAdmin } = require("../middleware/authentication")

const {
    createRecord,
    getRecord,
    getUserRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/CheckoutController")

CheckoutRouter.post("", verifyBoth, createRecord)
CheckoutRouter.get("", verifyAdmin, getRecord)
CheckoutRouter.get("/:_id", verifyBoth, getSingleRecord)
CheckoutRouter.get("/user/:_id", verifyBoth, getUserRecord)
CheckoutRouter.put("/:_id", verifyAdmin, updateRecord)
CheckoutRouter.delete("/:_id", verifyAdmin, deleteRecord)


module.exports = CheckoutRouter