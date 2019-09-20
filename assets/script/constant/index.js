import proxyUtil from "../util/proxyUtil"
// const viewportWidth = 500

export class ListConstant {
  constructor() {
    this.colNumber = 2
    this.colWidth = 48.5
    this.infoHeight = 16
    this.widthOffset = 1
    this.heightOffset = 1
  }
}

export class Menu {
  constructor() {
    this.home = "主页"
    this.find = "发现"
    this.new = "最新"
    this.collection = "收藏"
    this.works = "作品"
    this.footprint = "足迹"
    this.follower = "粉丝"
    this.following = "关注"
    this.upload = "上传"
    this.message = "通知"
  }
}

export const enumObjectList = {
  CollectState: proxyUtil.enumProxy({
    CONCERNED: "已关注",
    STRANGE: "未关注",
    SElF: "自己"
  }),
  FollowState: proxyUtil.enumProxy({
    CONCERNED: "已关注",
    STRANGE: "未关注",
    SElF: "自己"
  }),
  Gender: proxyUtil.enumProxy({
    MALE: "男",
    FEMALE: "女"
  }),
  PrivacyState: proxyUtil.enumProxy({
    PUBLIC: "公开",
    PRIVATE: "隐藏"
  }),
  DrawLifeState: proxyUtil.enumProxy({
    DISAPPEAR: "不存在",
    EXIST: "正常"
  })
}
