"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikesInfoView = exports.LikesInfo = exports.LikeStatus = void 0;
var LikeStatus;
(function (LikeStatus) {
    LikeStatus["None"] = "None";
    LikeStatus["Like"] = "Like";
    LikeStatus["Dislike"] = "Dislike";
})(LikeStatus || (exports.LikeStatus = LikeStatus = {}));
class LikesInfo {
    constructor(likesUsersIds, dislikesUsersIds, commentId) {
        this.likesUsersIds = likesUsersIds;
        this.dislikesUsersIds = dislikesUsersIds;
        this.commentId = commentId;
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
