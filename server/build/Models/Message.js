"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var MessageSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        trim: true,
    },
    chat: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Chat",
    },
}, {
    timestamps: true,
});
var Message = mongoose_1.default.model("Message", MessageSchema);
exports.default = Message;
