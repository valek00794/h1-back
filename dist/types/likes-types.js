"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedLikesInfo = exports.NewestLike = exports.LikesInfoView = exports.LikesInfo = exports.LikeStatus = void 0;
var LikeStatus;
(function (LikeStatus) {
    LikeStatus["None"] = "None";
    LikeStatus["Like"] = "Like";
    LikeStatus["Dislike"] = "Dislike";
})(LikeStatus || (exports.LikeStatus = LikeStatus = {}));
class LikesInfo {
    constructor(parrentId, authorId, authorLogin, status, addedAt) {
        this.parrentId = parrentId;
        this.authorId = authorId;
        this.authorLogin = authorLogin;
        this.status = status;
        this.addedAt = addedAt;
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
    constructor(likesCount, dislikesCount, myStatus, newestLikes) {
        super(likesCount, dislikesCount, myStatus);
        this.newestLikes = newestLikes;
    }
}
exports.ExtendedLikesInfo = ExtendedLikesInfo;
