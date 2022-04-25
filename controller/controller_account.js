const { AccountService } = require('../services')
const { logError, logWarn, encode, decode } = require('../utils/index')
const round = parseInt(process.env.ROUND)
const AccountController =
{
    async login(req, res) {
        try {
            // Nhận dữ liệu từ request
            let username = req.body.username;
            let password = req.body.password;
            console.log("Data: ", req.body)
            //Querry ~ find => Model.find({condition}) => Trả về mảng object thỏa mãn
            let account = await AccountService.find({ username: username, password: encode(round, password) })
            if (account.length == 1) {
                return res.json({ data: account[0], message: "Login success" })
            } else {
                logWarn("Login fail", { username: username, password: password })
                return res.json({ data: null, message: "Login fail" })
            }
        } catch (error) {
            console.error("Login Error", error)
            return res.json({ data: error, message: "Login Error" })

        }
    },
    async register(req, res) {
        try {
            let username = req.body.username;
            let password = req.body.password;
            let rePassword = req.body.rePassword;
            let email = req.body.email;
            let phone = req.body.phone;
            // CHECK EMPTY INPUT  ""
            if (!username || !password || !rePassword || !email || !phone) {
                logWarn("Invalid information", { username, password, rePassword, email, phone })
                return res.json({ data: null, message: "Invalid information" })
            } else
                // CHECK PASSWORD & REPASSWORD
                if (password != rePassword) {
                    logWarn("Password not match", { username, password, rePassword, email, phone })
                    return res.json({ data: null, message: "Password not match" })
                }
            // CHECK DUPLICATE ACCOUNT
            let account = await AccountService.find({ username });
            console.log("Account Found: ", account)
            if (account.length != 0) {
                logWarn("Account Is Existed", { username, password, rePassword, email, phone })
                return res.json({ data: null, message: "Account Is Existed" })
            }
            // 
            let result = await AccountService.create({ username, password, email, phone });
            return res.json({ data: result, message: "Register Success" })
        } catch (error) {
            console.error("Register Error", error)
            return res.json({ data: error, message: "Register Error" })
        }
    }

}


module.exports = AccountController