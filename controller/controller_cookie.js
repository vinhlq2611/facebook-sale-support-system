const { CookieService, FacebookService } = require("../services");
const {
  logError,
  logWarn,
  isVietnamesePhoneNumber,
} = require("../utils/index");
const jwt = require("jsonwebtoken");
const CookieController = {
  async addCookie(req, res) {
    try {
      let cookie = req.body.cookie;
      if (cookie == "") {
        // console.log
        return res.json({ data: null, message: "Cookie không được bỏ trống" });
      }

      let facebookData = await FacebookService.getUserInfo(cookie, "-");
      if (facebookData.isSuccess == false) {
        return res.json({ data: null, message: "Cookie sai" });
      }
      let checkuid = await CookieService.find({ uid: facebookData.data.uid });
      if (checkuid.length != 0) {
        return res.json({ data: null, message: "Cookie đã tồn tại" });
      }
      let result = await CookieService.create({
        data: cookie,
        token: "----",
        dtsg: facebookData.data.dtsg,
        uid: facebookData.data.uid,
      });
      return res.json({ data: result, message: "Thêm cookie thành công" });
    } catch (error) {
      console.error(error);
    }
  },
  async updateCookie(req, res) {
    try {
      let cookie = req.body.cookie;
      let uid = req.body.uid;
      if (cookie == "") {
        // console.log
        return res.json({ data: null, message: "Cookie không được bỏ trống" });
      }
      let facebookData = await FacebookService.getUserInfo(cookie, "-");
      if (facebookData.isSuccess == false) {
        return res.json({ data: null, message: "Cookie sai" });
      }
      let new_uid = facebookData.data.uid;
      if (uid != new_uid) {
        return res.json({ data: null, message: "Uid mới không trùng khớp uid cũ" });
      }
      let result = await CookieService.updateOne({
        uid: facebookData.data.uid,
      },
        {
          data: cookie,
          token: "----",
          dtsg: facebookData.data.dtsg,
        });
      return res.json({ data: result, message: "Sửa cookie thành công" });
    } catch (error) {
      console.error(error);
    }
  },
  async getAllCookie(req, res) {
    try {
      let keyword = req.query.keyword
      let data = {}
      if (keyword == null || keyword == "") {
        console.log("haha")
        data = await CookieService.find();
      } else {
        console.log(keyword)
        data = await CookieService.find({ uid: { $regex: keyword } });
      }
      // let data = await CookieService.find({data: keyword});
      return res.json({ data });
    } catch (error) {
      return res.json(null);
    }
  },
  async getOneCookie(req, res) {
    try {
      let uid = req.body.uid;
      console.log(uid);
      let data = await CookieService.find({ uid: uid });
      let cookie = data[0];
      console.log(cookie);
      return res.json({ data: cookie });
    } catch (error) {
      return res.json(null);
    }
  },

  async deleteCookie(req, res) {
    try {
      let uid = req.body.uid;
      let data = await CookieService.deleteOne({ uid: uid });
      return res.json({ data: data, message: "Xóa cookie thành công" });
    } catch (error) {
      console.error("Delete Cookie Fail: ", error)
      return res.json(null);
    }
  },
};
module.exports = CookieController;
