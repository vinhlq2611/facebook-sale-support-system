const { UserService, FacebookService } = require("../services");
const { logError, logWarn, isVietnamesePhoneNumber } = require("../utils/index");
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
        isActive: true
      });
      console.log(account);
      if (account.length == 1) {
        let user = account[0];
        // console.log("token data",{ username: user.username, password: user.password, type: user.type})
        let token = jwt.sign(
          { username: user.username, password: user.password, type: user.type },
          process.env.SECRET_KEY
        );
        account[0].token = token
        res.cookie("token", token, { maxAge: 90000000, httpOnly: true });
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
      let fullname = req.body.fullname
      let username = req.body.username;
      let password = req.body.password;
      let rePassword = req.body.rePassword;
      let email = req.body.email;
      let phone = req.body.phone;
      let birthday = req.body.birthday;
      let type = req.body.type;
      // CHECK EMPTY INPUT  ""
      if (
        !fullname ||
        !username ||
        !password ||
        !rePassword ||
        !email ||
        !phone ||
        !birthday || !type
      ) {
        //  console.log("Invalid information", {
        //   username,
        //   password,
        //   rePassword,
        //   email,
        //   phone,
        //   type,
        //   fullname,
        // });
        return res.json({ data: null, message: "Invalid information" });
      } else if (password.length < 6) {
        logWarn("Password must be at least 6 characters", {
          fullname,
          username,
          password,
          rePassword,
          email,
          phone,
          birthdate: birthday, type
        });
        return res.json({ data: null, message: "Password must be at least 6 characters" });
      } else if (!isVietnamesePhoneNumber(phone)) {
        logWarn("Phone number must be valid in Vietnam", {
          fullname,
          username,
          password,
          rePassword,
          email,
          phone,
          birthdate: birthday, type
        });
        return res.json({ data: null, message: "Phone number must be valid in Vietnam" });
      }
      // CHECK PASSWORD & REPASSWORD
      else if (password != rePassword) {
        logWarn("Password not match", {
          fullname,
          username,
          password,
          rePassword,
          email,
          phone,
          birthdate: birthday, type
        });
        return res.json({ data: null, message: "Password not match" });
      }
      // CHECK DUPLICATE ACCOUNT
      let account = await UserService.find({ username });
      // console.log("Account Found: ", account);
      if (account.length != 0) {
        logWarn("Account Is Existed", {
          fullname,
          username,
          password,
          rePassword,
          email,
          phone,
          birthdate: birthday, type
        });
        return res.json({ data: null, message: "Account Is Existed" });
      }
      //
      let result = await UserService.create({
        fullname,
        username,
        password,
        email,
        phone,
        birthdate: birthday, type
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
      let fullname = req.body.fullname;
      let email = req.body.email;
      let phone = req.body.phone;
      let birthdate = req.body.birthdate;
      let replySyntaxs = req.body.replySyntaxs;
      console.log(username, email, phone, birthdate, fullname);
      // CHECK EMPTY INPUT  ""
      if (!username || !email || !phone || !birthdate || !replySyntaxs || !fullname) {
        logWarn("Invalid information", {
          username,
          email,
          phone,
          birthdate,
          replySyntaxs,
          fullname
        });

        return res.json({ data: null, message: "Invalid information" });
      } else if (!isVietnamesePhoneNumber(phone)) {
        logWarn("Phone number must be valid in Vietnam", {
          fullname,
          username,
          email,
          phone,
          birthdate
        });
        return res.json({ data: null, message: "Phone number must be valid in Vietnam" });
      }

      let result = await UserService.updateOne(
        { username: username },
        { username, email, phone, birthdate, replySyntaxs, fullname }
      );
      return res.json({ data: result, message: "Update Success" });
    } catch (error) {
      // console.error(error);
      logError("Register Error", error);
      return res.json({ data: error, message: "Update Error" });
    }
  },
  async addCookie(req, res) {
    let fbCookie = req.body.fbCookie;
    let fbToken = req.body.fbToken;
    if (fbCookie == undefined || fbCookie == null || fbCookie == "") {
      return res.json({ data: null, message: "Cookie không được bỏ trống" })
    }
    if (fbToken == undefined || fbToken == null || fbToken == "") {
      return res.json({ data: null, message: "Token không được bỏ trống" })
    }
    let username = req.body.username;
    let [user] = await UserService.find({ username });
    let facebookData = await FacebookService.getUserInfo(fbCookie, fbToken)
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
      let groupList = await FacebookService.getGroupList(fbData.token, fbData.cookie.data)
      // console.log("Facebook Group = ", groupList);
      return res.json({ data: groupList, message: 'Lấy Group Facebook Thành Công' })
    } else {
      return res.json({ data: null, message: 'Cookie Quá Hạn' })
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
      if (password.length < 6) {
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
  async getAllUser(req, res) {
    try {
      let condition = {};
      // if (req.body.username) {
      //     condition.username = req.body.username
      // }
      if (req.query.id) {
        condition._id = req.query.id
      }
      let result = await UserService.find(condition)
      if (result.length == 0) {
        return res.json({ data: null, message: "User not existed !" })
      }
      return res.json({ data: result, message: "Get User Success" })
    } catch (error) {
      logError("Get Product Error", error)
      return res.json({ data: error, message: "Get User Error" })
    }
  },
  async changeStatusUser(req, res) {
    try {
      let condition = {};
      if (req.query.id) {
        condition._id = req.query.id
      }
      let result = await UserService.find(condition)
      if (result.length == 0) {
        return res.json({ data: null, message: "User not existed !" })
      }
      if (result[0].isActive == true) {
        let isActive = false
        UserService.updateOne(condition, { isActive })
      } else {
        let isActive = true
        UserService.updateOne(condition, { isActive })
      }
      return res.json({ data: result, message: "Change User Status Success" })
    } catch (error) {
      logError("Get Product Error", error)
      return res.json({ data: error, message: "Change User Status Success" })
    }
  },
  async findListUserByUserName(req, res) {
    try {
      let condition = {};
      if (req.query.fullname) {
        condition.fullname = { $regex: req.query.fullname }
      }
      console.log(req.query.fullname)
      let result = await UserService.find(condition)
      if (result.length == 0) {
        return res.json({ data: null, message: "User not existed !" })
      }
      return res.json({ data: result, message: "Find User Success" })
    } catch (error) {
      logError("Get Product Error", error)
      return res.json({ data: error, message: "Find User Success" })
    }
  },
  async adminUpdateProfile(req, res) {
    try {
      let _id = req.body._id
      let username = req.body.username;
      let fullname = req.body.fullname;
      let email = req.body.email;
      let phone = req.body.phone;
      let birthdate = req.body.birthdate;
      let replySyntaxs = req.body.replySyntaxs;
      console.log(username, email, phone, birthdate, fullname);
      // CHECK EMPTY INPUT  ""
      if (!username || !email || !phone || !birthdate || !replySyntaxs || !fullname) {
        logWarn("Invalid information", {
          username,
          email,
          phone,
          birthdate,
          replySyntaxs,
          fullname
        });

        return res.json({ data: null, message: "Invalid information" });
      } else if (!isVietnamesePhoneNumber(phone)) {
        logWarn("Phone number must be valid in Vietnam", {
          fullname,
          username,
          email,
          phone,
          birthdate
        });
        return res.json({ data: null, message: "Phone number must be valid in Vietnam" });
      }

      let result = await UserService.updateOne(
        { _id },
        { email, phone, birthdate, replySyntaxs, fullname }
      );
      return res.json({ data: result, message: "Update Success" });
    } catch (error) {
      // console.error(error);
      logError("Register Error", error);
      return res.json({ data: error, message: "Update Error" });
    }
  },
  async adminChangePassword(req, res) {
    try {
      let _id = req.body._id;
      let username = req.body.username;
      let oldpassword = req.body.oldpassword;
      let password = req.body.newpassword;
      let repass = req.body.repass;
      console.log(username, oldpassword, password, repass);
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
      if (password.length < 6) {
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
      let account = await UserService.find({ _id, password: oldpassword });
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
        { _id },
        { password }
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
