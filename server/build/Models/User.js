"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
        default: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
    },
}, {
    timestamps: true,
});
var User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
