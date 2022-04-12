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
      });
      console.log(account);
      if (account.length == 1) {
        
          let user = account[0];
          if(!user.isActive){
            logWarn("Login fail", { username: username, password: password });
            return res.json({ data: null, message: "Tài khoản đã ngừng hoạt động" });
          }else{
             // console.log("token data",{ username: user.username, password: user.password, type: user.type})
          let token = jwt.sign(
            { username: user.username, password: user.password, type: user.type,isActive:user.isActive },
            process.env.SECRET_KEY
          );
          account[0].token = token
          res.cookie("token", token, { maxAge: 90000000, httpOnly: true });
          return res.json({ data: account[0], message: "Đăng nhập thành công" });
          }
         
            
      }  else {
        logWarn("Login fail", { username: username, password: password });
        return res.json({ data: null, message: "Tài khoản hoặc mật khẩu không đúng" });
      }
    } catch (error) {
      console.log("Login ERROR: ", error);
      return res.json({ data: error, message: "Lỗi đăng nhập" });
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
        return res.json({ data: null, message: "Thông tin không hợp lệ" });
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
        return res.json({ data: null, message: "Mật khẩu phải có ít nhất 6 kí tự" });
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
        return res.json({ data: null, message: "Số điện thoại không hợp lệ" });
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
        return res.json({ data: null, message: "Chưa trùng với mật khẩu" });
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
        return res.json({ data: null, message: "Tên tài khoản đã tồn tại" });
      }
      let email_exist = await UserService.find({ email });
      // console.log("Account Found: ", account);
      if (email_exist.length != 0) {
        logWarn("Account Is Existed", {
          fullname,
          username,
          password,
          rePassword,
          email,
          phone,
          birthdate: birthday, type
        });
        return res.json({ data: null, message: "Email đã được dùng ở tài khoản khác" });
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
      return res.json({ data: result, message: "Đăng kí thành công" });
    } catch (error) {
      logError("Register Error", error);
      return res.json({ data: error, message: "Lỗi đăng kí" });
    }
  },
  async logout(req, res) {
    try {
      res.cookie("token", "", { maxAge: -1 });
      return res.json({ message: "Đăng xuất thành công" });
    } catch (error) {
      console.log("Log out error: ", error);
      return res.json({ message: "Đăng xuất thất bại" });
    }
  },
  async getUserByUsername(req, res) {
    try {
      consosle.log("Hello")
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
        logWarn("Vui lòng điền đầy đủ thông tin", {
          username,
          email,
          phone,
          birthdate,
          replySyntaxs,
          fullname
        });

        return res.json({ data: null, message: "Vui lòng điền đầy đủ thông tin" });
      } else if (!isVietnamesePhoneNumber(phone)) {
        logWarn("Phone number must be valid in Vietnam", {
          fullname,
          username,
          email,
          phone,
          birthdate
        });
        return res.json({ data: null, message: "Số điện thoại không hợp lệ" });
      }

      let result = await UserService.updateOne(
        { username: username },
        { username, email, phone, birthdate, replySyntaxs, fullname }
      );
      return res.json({ data: result, message: "Cập nhật thành công" });
    } catch (error) {
      // console.error(error);
      logError("Register Error", error);
      return res.json({ data: error, message: "Lỗi cập nhật" });
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
      let groupList = await FacebookService.getGroupList(fbData.token)
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
        logWarn("Vui lòng điền đầy đủ thông tin", {
          username,
          oldpassword,
          password,
          repass,
        });

        return res.json({ data: null, message: "Vui lòng điền đầy đủ thông tin" });
      }
      if (password.length < 6) {
        logWarn("", {
          username,
          oldpassword,
          password,
          repass,
        });

        return res.json({ data: null, message: "Mật khẩu phải có ít nhất 6 kí tự" });
      }
      if (password == oldpassword) {
        logWarn("Password must be different from old password", {
        });

        return res.json({ data: null, message: "Mật khẩu mới phải khác mật khẩu cũ" });
      }
      // CHECK PASSWORD & REPASSWORD
      if (password != repass) {
        logWarn("Password not match", {});
        return res.json({ data: null, message: "Chưa trùng với mật khẩu" });
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
        return res.json({ data: null, message: "Sai mật khẩu cũ" });
      }
      let result = await UserService.updateOne(
        { username: username },
        { username, password }
      );

      return res.json({
        data: result,
        message: "Đổi mật khẩu thành công",
      });
    } catch (error) {
      // console.log("Change Error", error);
      return res.json({ data: error, message: "Lỗi đổi mật khẩu" });
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
        return res.json({ data: null, message: "Người dùng không tồn tại !" })
      }
      return res.json({ data: result, message: "Lấy thông tin người dùng thành công" })
    } catch (error) {
      logError("Get Product Error", error)
      return res.json({ data: error, message: "Lấy thông tin người dùng thất bại" })
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
        return res.json({ data: null, message: "Người dùng không tồn tại !" })
      }
      if (result[0].isActive == true) {
        let isActive = false
        UserService.updateOne(condition, { isActive ,password:"-----"})
      } else {
        let isActive = true
        UserService.updateOne(condition, { isActive })
      }
      return res.json({ data: result, message: "Thay đổi trạng thái người dùng thành công" })
    } catch (error) {
      logError("Get Product Error", error)
      return res.json({ data: error, message: "Lỗi thay đổi trạng thái" })
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
        return res.json({ data: null, message: "Người dùng không tồn tại!" })
      }
      return res.json({ data: result, message: "Tìm người dùng thành công" })
    } catch (error) {
      logError("Get Product Error", error)
      return res.json({ data: error, message: "Lỗi tìm người dùng" })
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

        return res.json({ data: null, message: "Vui lòng điền đầy đủ thông tin" });
      } else if (!isVietnamesePhoneNumber(phone)) {
        logWarn("Phone number must be valid in Vietnam", {
          fullname,
          username,
          email,
          phone,
          birthdate
        });
        return res.json({ data: null, message: "Số điện thoại không hợp lệ" });
      }

      let result = await UserService.updateOne(
        { _id },
        { email, phone, birthdate, replySyntaxs, fullname }
      );
      return res.json({ data: result, message: "Cập nhật thành công" });
    } catch (error) {
      // console.error(error);
      logError("Register Error", error);
      return res.json({ data: error, message: "Lỗi cập nhật" });
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

        return res.json({ data: null, message: "Vui lòng điền đầy đủ thông tin" });
      }
      if (password.length < 6) {
        logWarn("Password length must be larger than 6", {
          username,
          oldpassword,
          password,
          repass,
        });

        return res.json({ data: null, message: "Mật khẩu phải có ít nhất 6 kí tự" });
      }
      if (password == oldpassword) {
        logWarn("Password must be different from old password", {
        });

        return res.json({ data: null, message: "Mật khẩu mới phải khác mật khẩu cũ" });
      }
      // CHECK PASSWORD & REPASSWORD
      if (password != repass) {
        logWarn("Password not match", {});
        return res.json({ data: null, message: "Chưa trùng mật khẩu" });
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
        return res.json({ data: null, message: "Sai mật khẩu cũ" });
      }
      let result = await UserService.updateOne(
        { _id },
        { password }
      );

      return res.json({
        data: result,
        message: "Đổi mật khẩu thành công",
      });
    } catch (error) {
      // console.log("Change Error", error);
      return res.json({ data: error, message: "Lỗi đổi mật khẩu" });
    }
  },
};

module.exports = UserController;
