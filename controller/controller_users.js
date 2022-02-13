const { UserService } = require("../services");
const { logError, logWarn } = require("../utils/index");
const jwt = require("jsonwebtoken");
const UserController = {
  async login(req, res) {
    try {
      // Nhận dữ liệu từ request
      let username = req.body.username;
      let password = req.body.password;
      // console.log(req.body);
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
      //  console.log("Invalid information", {
        //   username,
        //   password,
        //   rePassword,
        //   email,
        //   phone,
        // });
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
     // console.log("Account Found: ", account);
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
     // console.log(username, email, phone, birthdate);
      // CHECK EMPTY INPUT  ""
      if (!username || !email || !phone || !birthdate || !replySyntaxs) {
        logWarn("Invalid information", {
          username,
          email,
          phone,
          birthdate,
          replySyntaxs,
        });

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
  async changePassword(req, res) {
    try {
      let username = req.body.username;
      let oldpassword = req.body.oldpassword;
      let password = req.body.newpassword;
      let repass = req.body.repass;
      // console.log(username, oldpassword, password, repass);
      // CHECK EMPTY INPUT  ""
      if (!username || !oldpassword || !password || !repass) {
        logWarn("Invalid information", {
          username,
          oldpassword,
          password,
          repass,
        });

        return res.json({ data: null, message: "Invalid information" });
      }
      if(password.length<6){
        logWarn("Password length must be larger than 6", {
          username,
          oldpassword,
          password,
          repass,
        });

        return res.json({ data: null, message: "Password length must be larger than 6" });
      }
      if (password == oldpassword) {
        logWarn("Password must be different from old password", {
        });

        return res.json({ data: null, message: "Password must be different from old password" });
      }
      // CHECK PASSWORD & REPASSWORD
     if (password != repass) {
        logWarn("Password not match", {});
        return res.json({ data: null, message: "Password not match" });
      }
      let account = await UserService.find({ username, password: oldpassword });
      //console.log("Account Found: ", account.length);
      if (account.length == 0) {
        logWarn("Old password is incorrect", {
          username,
          oldpassword,
          password,
          repass,
        });
        return res.json({ data: null, message: "Old password is incorrect" });
      }
      let result = await UserService.updateOne(
        { username: username },
        { username, password }
      );

      return res.json({
        data: result,
        message: "Change password successfully",
      });
    } catch (error) {
      // console.log("Change Error", error);
      return res.json({ data: error, message: "Change Error" });
    }
  },
};

module.exports = UserController;
