const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/");
const { decode, encode } = require("../utils/index")
const round = parseInt(process.env.ROUND)
// Check token có tồn tại hay không
async function needLogin(req, res, next) {
  try {
    let token = req.headers.authorization;
    // console.log(req.headers)
    let decodeData = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("Xác minh danh tính:", decodeData);
    let isValid = await UserModel.find({
      username: decodeData.username,
      password: encode(round, decodeData.password),
      // isActive: true,
    });
    req.body.username = decodeData.username;
    req.body.type = decodeData.type;
    // req.body.isActive = decodeData.isActive;
    if (isValid.length == 1) {
      next();
    } else res.json({ data: null, message: "Đăng nhập hết hạn" })
  } catch (error) {
    console.log("needLogin Error:", error);
    return res.json({ data: null, message: "Đăng nhập hết hạn" })
  }
}
async function needAdmin(req, res, next) {
  try {
    let token = req.headers.authorization;
    let decodeData = jwt.verify(token, process.env.SECRET_KEY);
    let isValid = await UserModel.find({
      username: decodeData.username,
      password: encode(round, decodeData.password),
      // isActive: true,
    });
    req.body.username = decodeData.username;
    req.body.type = decodeData.type;
    console.log(decodeData)
    if (isValid.length == 1 && decodeData.type == 2) {
      next();
    } else res.json({ data: null, message: "Bạn Không Đủ Quyền Hạn" })
  } catch (error) {
    console.log("needLogin Error:", error);
    return res.json({ data: null, message: "Bạn Không Đủ Quyền Hạn" })
  }
}
async function needGuest(req, res, next) {
  let token = req.headers.authorization;
  try {
    let decodeData = jwt.verify(token, process.env.SECRET_KEY);
    let isValid = await UserModel.find({
      username: decodeData.username,
      password: encode(round, decodeData.password),
    });
    if (isValid.length > 0) {
      return res.json({ data: null, message: "Bạn Không Đủ Quyền Hạn" })
    } else next();
  } catch (error) {
    next();
  }
}

module.exports = { needLogin, needGuest, needAdmin };
