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
exports.allUsers = exports.logIn = exports.signUp = void 0;
var User_1 = __importDefault(require("../Models/User"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var TokenGenerator_1 = __importDefault(require("../helper/TokenGenerator"));
var signUp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, existingUser, saltRounds, hashedPassword, data, loginToken, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    pic: req.body.pic,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, User_1.default.findOne({ email: user.email })];
            case 2:
                existingUser = _a.sent();
                // Checking Existing User
                if (existingUser) {
                    return [2 /*return*/, res.status(409).json({ message: "User Already Exists" })];
                }
                saltRounds = parseInt(process.env.SALT_ROUND || "10");
                hashedPassword = bcrypt_1.default.hashSync(user.password, saltRounds);
                user.password = hashedPassword;
                data = new User_1.default(user);
                return [4 /*yield*/, data.save()];
            case 3:
                _a.sent();
                loginToken = (0, TokenGenerator_1.default)(data.email, data._id);
                console.log(req.userId);
                res.status(201).json({
                    message: "User Created",
                    User: {
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        pic: data.pic,
                        Token: loginToken,
                    },
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.signUp = signUp;
//Login
var logIn = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, loginToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                try {
                    //User Exists
                    if (user) {
                        // Comparing Password
                        if (bcrypt_1.default.compareSync(password, user.password)) {
                            loginToken = (0, TokenGenerator_1.default)(user.email, user._id);
                            return [2 /*return*/, res.status(201).json({
                                    message: "Valid User",
                                    User: {
                                        id: user._id,
                                        name: user.name,
                                        email: user.email,
                                        pic: user.pic,
                                        Token: loginToken,
                                    },
                                })];
                        }
                        // Email and Password not Match
                        return [2 /*return*/, res
                                .status(404)
                                .json({ message: "Email and Password Doesn't Match" })];
                    }
                    //User doesn't Exists
                    return [2 /*return*/, res.status(404).json({ message: "User Not Found" })];
                }
                catch (err) {
                    return [2 /*return*/, res.status(500).json({ message: err.message })];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.logIn = logIn;
var allUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var search, users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                search = req.query.search;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User_1.default.find({
                        $or: [
                            { name: { $regex: search, $options: "i" } },
                            { email: { $regex: search, $options: "i" } },
                        ],
                    }).find({ _id: { $ne: req.user.id } })];
            case 2:
                users = _a.sent();
                if (users) {
                    return [2 /*return*/, res.status(201).json({ users: users })];
                }
                return [2 /*return*/, res.status(201).json({ users: [], message: "No users found" })];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(400).json({ message: error_1.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.allUsers = allUsers;
