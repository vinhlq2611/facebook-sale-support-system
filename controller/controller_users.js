const { UserService, FacebookService } = require("../services");
const { logError, logWarn } = require("../utils/index");
const jwt = require("jsonwebtoken");
const UserController = {
  async login(req, res) {
    try {
      // Nhận dữ liệu từ request
      let username = req.body.username;
      let password = req.body.password;
      console.log(req.body);
      let account = await UserService.find({
        username: username,
        password: password,
      });
      if (account.length == 1) {
        let user = account[0];
        let token = jwt.sign(
          { username: user.username, password: user.password, type: user.type },
          process.env.SECRET_KEY
        );
        res.cookie("token", token, { maxAge: 900000, httpOnly: true });
        return res.json({ data: account[0], message: "Login success" });
      } else {
        logWarn("Login fail", { username: username, password: password });
        return res.json({ data: null, message: "Account not found" });
      }
    } catch (error) {
      console.log("Login ERROR: ", error);
      return res.json({ data: error, message: "Login Error" });
    }
  },
  async register(req, res) {
    try {
      let username = req.body.username;
      let password = req.body.password;
      let rePassword = req.body.rePassword;
      let email = req.body.email;
      let phone = req.body.phone;
      let birthday = req.body.birthday;
      // CHECK EMPTY INPUT  ""
      if (
        !username ||
        !password ||
        !rePassword ||
        !email ||
        !phone ||
        !birthday
      ) {
        console.log("Invalid information", {
          username,
          password,
          rePassword,
          email,
          phone,
        });
        return res.json({ data: null, message: "Invalid information" });
      }
      // CHECK PASSWORD & REPASSWORD
      else if (password != rePassword) {
        logWarn("Password not match", {
          username,
          password,
          rePassword,
          email,
          phone,
          birthdate: birthday,
        });
        return res.json({ data: null, message: "Password not match" });
      }
      // CHECK DUPLICATE ACCOUNT
      let account = await UserService.find({ username });
      console.log("Account Found: ", account);
      if (account.length != 0) {
        logWarn("Account Is Existed", {
          username,
          password,
          rePassword,
          email,
          phone,
          birthdate: birthday,
        });
        return res.json({ data: null, message: "Account Is Existed" });
      }
      //
      let result = await UserService.create({
        username,
        password,
        email,
        phone,
        birthdate: birthday,
      });
      return res.json({ data: result, message: "Register Success" });
    } catch (error) {
      logError("Register Error", error);
      return res.json({ data: error, message: "Register Error" });
    }
  },
  async logout(req, res) {
    try {
      res.cookie("token", "", { maxAge: -1 });
      return res.json({ message: "Logout Success" });
    } catch (error) {
      console.log("Log out error: ", error);
      return res.json({ message: "Logout Fail" });
    }
  },
  async getUserByUsername(req, res) {
    try {
      let username = req.body.username;
      let data = await UserService.find({ username: username });
      let user = data[0];
      return res.json({ data: user });
    } catch (error) {
      return res.json(null);
    }
  },
  async updateProfile(req, res) {
    try {
      let username = req.body.username;
      let email = req.body.email;
      let phone = req.body.phone;
      let birthdate = req.body.birthdate;
      let replySyntaxs = req.body.replySyntaxs;
      console.log(username, email, phone, birthdate)
      // CHECK EMPTY INPUT  ""
      if (!username || !email || !phone || !birthdate || !replySyntaxs) {
        logWarn("Invalid information", { username, email, phone, birthdate, replySyntaxs });

        return res.json({ data: null, message: "Invalid information" });
      }

      let result = await UserService.updateOne(
        { username: username },
        { username, email, phone, birthdate, replySyntaxs }
      );
      return res.json({ data: result, message: "Update Success" });
    } catch (error) {
      logError("Register Error", error);
      return res.json({ data: error, message: "Update Error" });
    }
  },
  async addCookie(req, res) {
    let fbCookie = req.body.fbCookie;
    if (fbCookie == undefined || fbCookie == null || fbCookie == "") {
      return res.json({ data: null, message: "Cookie không được bỏ trống" })
    }
    let username = req.body.username;
    let [user] = await UserService.find({ username });
    let facebookData = await FacebookService.getUserInfo(fbCookie)
    if (facebookData.isSuccess == false) {
      return res.json({ data: null, message: "Cookie không hợp lệ" })
    }
    user.facebook = {
      cookie: {
        data: fbCookie,
        status: 1
      },
      token: facebookData.data.token,
      dtsg: facebookData.data.dtsg,
      uid: facebookData.data.uid,
    }
    let result = await UserService.updateOne({ username }, user)
    return res.json({ data: result, message: "Thêm cookie thành công" })
  },
  async getCookie(req, res) {
    let fbCookie = req.body.fbCookie;
    let username = req.body.username;
    let [user] = await UserService.find({ username });
    return res.json({ data: user.facebook?.cookie, message: "Thêm cookie thành công" })
  },
  async getFacebookGroup(req, res, next) {
    // let fbCookie = req.body.fbCookie;
    let username = req.body.username;
    let [user] = await UserService.find({ username });
    let fbData = user.facebook
    if (fbData.cookie?.status == 1) {
      let groupList = await FacebookService.getGroupList(fbData.token)
      console.log("Facebook Group = ", groupList);
      return res.json({ data: groupList, message: 'Lấy Group Facebook Thành Công' })
    } else {
      return res.json({ data: null, message: 'Cookie Quá Hạn' })
    }
  }

};

module.exports = UserController;
