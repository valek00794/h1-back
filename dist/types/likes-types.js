"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedLikesInfo = exports.NewestLike = exports.LikesInfoView = exports.LikesInfo = exports.LikeStatusParrent = exports.LikeStatus = void 0;
var LikeStatus;
(function (LikeStatus) {
    LikeStatus["None"] = "None";
    LikeStatus["Like"] = "Like";
    LikeStatus["Dislike"] = "Dislike";
})(LikeStatus || (exports.LikeStatus = LikeStatus = {}));
var LikeStatusParrent;
(function (LikeStatusParrent) {
    LikeStatusParrent["Post"] = "Post";
    LikeStatusParrent["Comment"] = "Comment";
})(LikeStatusParrent || (exports.LikeStatusParrent = LikeStatusParrent = {}));
class LikesInfo {
    constructor(parrentId, parrentName, likesUsersIds, dislikesUsersIds) {
        this.parrentId = parrentId;
        this.parrentName = parrentName;
        this.likesUsersIds = likesUsersIds;
        this.dislikesUsersIds = dislikesUsersIds;
    }
}
exports.LikesInfo = LikesInfo;
class LikesInfoView {
    constructor(likesCount, dislikesCount, myStatus) {
        this.likesCount = likesCount;
        this.dislikesCount = dislikesCount;
        this.myStatus = myStatus;
    }
}
exports.LikesInfoView = LikesInfoView;
class NewestLike {
    constructor(addedAt, userId, login) {
        this.addedAt = addedAt;
        this.userId = userId;
        this.login = login;
    }
}
exports.NewestLike = NewestLike;
class ExtendedLikesInfo extends LikesInfoView {
    constructor(likesInfoView, newestLikes) {
        super(likesInfoView.likesCount, likesInfoView.dislikesCount, likesInfoView.myStatus);
        this.newestLikes = newestLikes;
    }
}
exports.ExtendedLikesInfo = ExtendedLikesInfo;
