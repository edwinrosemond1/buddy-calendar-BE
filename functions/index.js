const loginFunctions = require("./auth/login");
const signupFunctions = require("./auth/sign-up");
const createEventFunctions = require("./calendar-events/event");
const listEventFunctions = require("./calendar-events/list/index");
const createCalendarGroup = require("./calendar-groups/create/index");
const enableAdmin = require("./auth/setClaim/index");

exports.login = loginFunctions.handler;
exports.signup = signupFunctions.handler;
exports.createEvent = createEventFunctions.handler;
exports.listEvent = listEventFunctions.handler;
exports.createCalenadrGroup = createCalendarGroup.handler;
exports.enableAdmin = enableAdmin.handler;
