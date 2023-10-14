"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromGroup = exports.addToGroup = exports.renameGroup = exports.createGroupChat = exports.fetchChat = exports.accessChat = void 0;
var ChatModel_1 = __importDefault(require("../Models/ChatModel"));
var User_1 = __importDefault(require("../Models/User"));
var accessChat = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, isChat, createdchat, fullChat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.body.userId;
                return [4 /*yield*/, ChatModel_1.default.find({
                        isGroupChat: false,
                        $and: [
                            { users: { $elemMatch: { $eq: req.user._id } } },
                            { users: { $elemMatch: { $eq: userId } } },
                        ],
                    })
                        .populate("users", "-password")
                        .populate("latestMessage")];
            case 1:
                isChat = _a.sent();
                return [4 /*yield*/, User_1.default.populate(isChat, {
                        path: "latestMessage.sender",
                        select: "name pic email",
                    })];
            case 2:
                isChat = _a.sent();
                if (!(isChat.length > 0)) return [3 /*break*/, 3];
                return [2 /*return*/, res.json(isChat[0])];
            case 3: return [4 /*yield*/, ChatModel_1.default.create({
                    chatName: "Chat Created",
                    isGroupChat: false,
                    users: [req.user._id, userId],
                })];
            case 4:
                createdchat = _a.sent();
                return [4 /*yield*/, ChatModel_1.default.find({ _id: createdchat._id }).populate("users", "-password")];
            case 5:
                fullChat = _a.sent();
                return [2 /*return*/, res.json(fullChat)];
        }
    });
}); };
exports.accessChat = accessChat;
var fetchChat = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            ChatModel_1.default.find({
                users: { $elemMatch: { $eq: req.user._id } },
            })
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
                .populate("latestMessage")
                .sort({ updatedAt: -1 })
                .then(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, User_1.default.populate(result, {
                                path: "latestMessage.sender",
                                select: "name pic email",
                            })];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, res.json({ result: result })];
                    }
                });
            }); });
        }
        catch (error) {
            return [2 /*return*/, res.status(500).json({ message: error.message })];
        }
        return [2 /*return*/];
    });
}); };
exports.fetchChat = fetchChat;
var createGroupChat = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, groupChat, fullGroupChat, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.users || !req.body.name) {
                    return [2 /*return*/, res.status(400).json({ message: "Please fill all the details" })];
                }
                users = JSON.parse(req.body.users);
                if (users.length < 2) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "More than two 2 users are required to form Group" })];
                }
                users.push(req.user);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, ChatModel_1.default.create({
                        chatName: req.body.name,
                        users: users,
                        isGroupChat: true,
                        groupAdmin: req.user,
                    })];
            case 2:
                groupChat = _a.sent();
                return [4 /*yield*/, ChatModel_1.default.findOne({ _id: groupChat._id })
                        .populate("users", "-password")
                        .populate("groupAdmin", "-password")];
            case 3:
                fullGroupChat = _a.sent();
                return [2 /*return*/, res.status(201).json(fullGroupChat)];
            case 4:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({ message: error_1.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createGroupChat = createGroupChat;
var renameGroup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, groupId, groupName, updatedName, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, groupId = _a.groupId, groupName = _a.groupName;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ChatModel_1.default.findByIdAndUpdate(groupId, { chatName: groupName }, { new: true })
                        .populate("users", "-password")
                        .populate("groupAdmin", "-password")];
            case 2:
                updatedName = _b.sent();
                if (updatedName) {
                    return [2 /*return*/, res.status(201).json(updatedName)];
                }
                else {
                    return [2 /*return*/, res.status(404).json({ message: "Chat not Found" })];
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: error_2.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.renameGroup = renameGroup;
var addToGroup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, groupId, userId, group, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, groupId = _a.groupId, userId = _a.userId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ChatModel_1.default.findByIdAndUpdate(groupId, {
                        $push: { users: userId },
                    }, { new: true })
                        .populate("users", "-password")
                        .populate("groupAdmin", "-password")];
            case 2:
                group = _b.sent();
                if (group) {
                    return [2 /*return*/, res.status(201).json(group)];
                }
                else {
                    return [2 /*return*/, res.status(404).json({ message: "Group not Found" })];
                }
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: error_3.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addToGroup = addToGroup;
var removeFromGroup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, groupId, userId, group, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, groupId = _a.groupId, userId = _a.userId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ChatModel_1.default.findByIdAndUpdate(groupId, {
                        $pull: { users: userId },
                    }, { new: true })
                        .populate("users", "-password")
                        .populate("groupAdmin", "-password")];
            case 2:
                group = _b.sent();
                if (group) {
                    return [2 /*return*/, res.status(201).json(group)];
                }
                else {
                    return [2 /*return*/, res.status(404).json({ message: "Group not Found" })];
                }
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: error_4.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.removeFromGroup = removeFromGroup;
