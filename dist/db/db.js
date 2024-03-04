"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDB = exports.db = void 0;
exports.db = {
    videos: [
        {
            "id": 1,
            "title": "im play",
            "author": "Barsik",
            "canBeDownloaded": true,
            "minAgeRestriction": null,
            "createdAt": "2024-02-27T09:08:13.199Z",
            "publicationDate": "2024-02-27T09:08:13.200Z",
            "availableResolutions": [
                "P144"
            ]
        },
        {
            "id": 2,
            "title": "im sleep",
            "author": "Barsik",
            "canBeDownloaded": false,
            "minAgeRestriction": null,
            "createdAt": "2024-02-27T09:08:13.199Z",
            "publicationDate": "2024-02-27T09:08:13.200Z",
            "availableResolutions": [
                "P240"
            ]
        },
        {
            "id": 3,
            "title": "im eat",
            "author": "Barsik",
            "canBeDownloaded": false,
            "minAgeRestriction": null,
            "createdAt": "2024-02-27T09:08:13.199Z",
            "publicationDate": "2024-02-27T09:08:13.200Z",
            "availableResolutions": [
                "P360"
            ]
        }
    ],
    posts: [
        {
            "id": "1",
            "title": "string1",
            "shortDescription": "string1",
            "content": "string1",
            "blogId": "1",
            "blogName": "string1"
        },
        {
            "id": "2",
            "title": "string2",
            "shortDescription": "string2",
            "content": "string2",
            "blogId": "2",
            "blogName": "string2"
        }
    ],
    blogs: [
        {
            "id": "1",
            "name": "blog1",
            "description": "descriptionBlog1",
            "websiteUrl": "https://Id2Nij8.9.ge8Mr7.PRsadsdoD4a7HCL3UkRvN.yYJ_8zwBm72uzzor_MLVW2fsfRZ/5jcX85qxWhdGDh9cg1M-4lcYA"
        },
        {
            "id": "2",
            "name": "blog2",
            "description": "descriptionBlog2",
            "websiteUrl": "https://Id2Nij8.9.ge8Mr7.PRsadsdoD4a7HCL3UkRvN.yYJ_8zwBm72uzzor_MLVW2fsfRZ/5jcX85qxWhdGDh9cg1M-4lcYA"
        }
    ]
};
const setDB = (dataset) => {
    if (!dataset) {
        exports.db.videos = [];
        exports.db.posts = [];
        exports.db.blogs = [];
        return;
    }
    exports.db.videos = dataset.videos || exports.db.videos;
    exports.db.posts = dataset.posts || exports.db.posts;
    exports.db.blogs = dataset.blogs || exports.db.blogs;
};
exports.setDB = setDB;
