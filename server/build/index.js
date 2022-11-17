var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_server = require("react-dom/server"), import_react = require("@remix-run/react"), import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server.renderToString)(
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, {
      context: remixContext,
      url: request.url
    }, void 0, !1, {
      fileName: "app/entry.server.tsx",
      lineNumber: 32,
      columnNumber: 5
    }, this)
  );
  return responseHeaders.set("Content-Type", "text/html"), new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  loader: () => loader,
  meta: () => meta
});
var import_node2 = require("@remix-run/node");

// app/session.server.ts
var import_node = require("@remix-run/node"), import_tiny_invariant = __toESM(require("tiny-invariant"));

// app/models/user.server.ts
var import_bcryptjs = __toESM(require("bcryptjs"));

// app/db.server.ts
var import_client = require("@prisma/client"), prisma;
global.__db__ || (global.__db__ = new import_client.PrismaClient()), prisma = global.__db__, prisma.$connect();

// app/models/user.server.ts
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
async function createUser(email, password) {
  let hashedPassword = await import_bcryptjs.default.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });
}
async function verifyLogin(email, password) {
  let userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: !0
    }
  });
  if (!userWithPassword || !userWithPassword.password || !await import_bcryptjs.default.compare(
    password,
    userWithPassword.password.hash
  ))
    return null;
  let { password: _password, ...userWithoutPassword } = userWithPassword;
  return userWithoutPassword;
}

// app/session.server.ts
(0, import_tiny_invariant.default)(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
var DEFAULT_SECRET = "y9q*uMGmx3Aw", sessionStorage = (0, import_node.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: !0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: !1
  }
}), USER_SESSION_KEY = "userId";
async function getSession(request) {
  let cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
async function getUserId(request) {
  return (await getSession(request)).get(USER_SESSION_KEY);
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (userId === void 0)
    return null;
  let user = await getUserById(userId);
  if (user)
    return user;
  throw await logout(request);
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  let userId = await getUserId(request);
  if (!userId) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw (0, import_node.redirect)(`/login?${searchParams}`);
  }
  return userId;
}
async function createUserSession({
  request,
  userId,
  remember,
  redirectTo
}) {
  let session = await getSession(request);
  return session.set(USER_SESSION_KEY, userId), (0, import_node.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  });
}
async function logout(request) {
  let session = await getSession(request);
  return (0, import_node.redirect)("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}
var { commitSession, destroySession } = (0, import_node.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: !0,
    expires: new Date(Date.now() + 36e5),
    maxAge: 3600,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || DEFAULT_SECRET],
    secure: !0
  }
});

// app/root.tsx
var import_react3 = require("react"), import_react4 = require("@remix-run/react"), import_socket = __toESM(require("socket.io-client"));

// app/context.tsx
var import_react2 = require("react"), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), context = (0, import_react2.createContext)(void 0);
function useSocket() {
  return console.log("CONTEXT", context), (0, import_react2.useContext)(context);
}
function SocketProvider({ socket, children }) {
  return console.log("socket", socket), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(context.Provider, {
    value: socket,
    children
  }, void 0, !1, {
    fileName: "app/context.tsx",
    lineNumber: 20,
    columnNumber: 10
  }, this);
}

// app/root.tsx
var import_jsx_dev_runtime = require("react/jsx-dev-runtime"), meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1"
});
async function loader({ request }) {
  return (0, import_node2.json)({
    user: await getUser(request)
  });
}
function App() {
  let [socket, setSocket] = (0, import_react3.useState)();
  return (0, import_react3.useEffect)(() => {
    let socket2 = (0, import_socket.default)();
    return setSocket(socket2), () => {
      socket2.close();
    };
  }, []), (0, import_react3.useEffect)(() => {
    !socket || socket.on("confirmation", (data) => {
      console.log(data);
    });
  }, [socket]), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
    lang: "en",
    className: "h-full",
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", {
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react4.Meta, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 51,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react4.Links, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 52,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 50,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", {
        className: "h-full",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SocketProvider, {
            socket,
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react4.Outlet, {}, void 0, !1, {
              fileName: "app/root.tsx",
              lineNumber: 56,
              columnNumber: 11
            }, this)
          }, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 55,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react4.ScrollRestoration, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 58,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react4.Scripts, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 59,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react4.LiveReload, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 60,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 54,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 49,
    columnNumber: 5
  }, this);
}

// app/routes/eat-with/$noteId.tsx
var noteId_exports = {};
__export(noteId_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary,
  action: () => action,
  default: () => NoteDetailsPage,
  loader: () => loader2
});
var import_node3 = require("@remix-run/node"), import_react5 = require("@remix-run/react"), import_tiny_invariant2 = __toESM(require("tiny-invariant"));

// app/models/note.server.ts
function getNote({
  id,
  userId
}) {
  return prisma.note.findFirst({
    select: { id: !0, body: !0, title: !0 },
    where: { id, userId }
  });
}
function getNoteListItems({ userId }) {
  return prisma.note.findMany({
    where: { userId },
    select: { id: !0, title: !0 },
    orderBy: { updatedAt: "desc" }
  });
}
function createNote({
  body,
  title,
  userId
}) {
  return prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
}
function deleteNote({
  id,
  userId
}) {
  return prisma.note.deleteMany({
    where: { id, userId }
  });
}

// app/routes/eat-with/$noteId.tsx
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
async function loader2({ request, params }) {
  let userId = await requireUserId(request);
  (0, import_tiny_invariant2.default)(params.noteId, "noteId not found");
  let note = await getNote({ userId, id: params.noteId });
  if (!note)
    throw new Response("Not Found", { status: 404 });
  return (0, import_node3.json)({ note });
}
async function action({ request, params }) {
  let userId = await requireUserId(request);
  return (0, import_tiny_invariant2.default)(params.noteId, "noteId not found"), await deleteNote({ userId, id: params.noteId }), (0, import_node3.redirect)("/notes");
}
function NoteDetailsPage() {
  let data = (0, import_react5.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
        className: "text-2xl font-bold",
        children: data.note.title
      }, void 0, !1, {
        fileName: "app/routes/eat-with/$noteId.tsx",
        lineNumber: 34,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
        className: "py-6",
        children: data.note.body
      }, void 0, !1, {
        fileName: "app/routes/eat-with/$noteId.tsx",
        lineNumber: 35,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("hr", {
        className: "my-4"
      }, void 0, !1, {
        fileName: "app/routes/eat-with/$noteId.tsx",
        lineNumber: 36,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react5.Form, {
        method: "post",
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
          type: "submit",
          className: "rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
          children: "Delete"
        }, void 0, !1, {
          fileName: "app/routes/eat-with/$noteId.tsx",
          lineNumber: 38,
          columnNumber: 9
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/eat-with/$noteId.tsx",
        lineNumber: 37,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/eat-with/$noteId.tsx",
    lineNumber: 33,
    columnNumber: 5
  }, this);
}
function ErrorBoundary({ error }) {
  return console.error(error), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    children: [
      "An unexpected error occurred: ",
      error.message
    ]
  }, void 0, !0, {
    fileName: "app/routes/eat-with/$noteId.tsx",
    lineNumber: 52,
    columnNumber: 10
  }, this);
}
function CatchBoundary() {
  let caught = (0, import_react5.useCatch)();
  if (caught.status === 404)
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
      children: "Note not found"
    }, void 0, !1, {
      fileName: "app/routes/eat-with/$noteId.tsx",
      lineNumber: 59,
      columnNumber: 12
    }, this);
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

// app/routes/eat-with/index.tsx
var eat_with_exports = {};
__export(eat_with_exports, {
  default: () => NoteIndexPage
});
var import_react7 = require("@remix-run/react");

// app/components/chat.tsx
var import_react6 = require("react");
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function Socket() {
  let socket = useSocket();
  return (0, import_react6.useEffect)(() => {
    console.log("HERE in socket", socket), socket && (socket.on("event", (data) => {
      console.log(data);
    }), socket.emit("event", "ping"));
  }, [socket]), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.4" },
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
        children: "Welcome to Remix + Socket.io"
      }, void 0, !1, {
        fileName: "app/components/chat.tsx",
        lineNumber: 21,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
          type: "button",
          onClick: () => socket == null ? void 0 : socket.emit("event", "ping"),
          children: "Send ping"
        }, void 0, !1, {
          fileName: "app/components/chat.tsx",
          lineNumber: 23,
          columnNumber: 9
        }, this)
      }, void 0, !1, {
        fileName: "app/components/chat.tsx",
        lineNumber: 22,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
        children: "See Browser console and Server terminal"
      }, void 0, !1, {
        fileName: "app/components/chat.tsx",
        lineNumber: 27,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/components/chat.tsx",
    lineNumber: 20,
    columnNumber: 5
  }, this);
}

// app/routes/eat-with/index.tsx
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function NoteIndexPage() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    children: [
      "No note selected. Select a note on the left, or",
      " ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react7.Link, {
        to: "new",
        className: "text-blue-500 underline",
        children: "create a new note."
      }, void 0, !1, {
        fileName: "app/routes/eat-with/index.tsx",
        lineNumber: 7,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Socket, {}, void 0, !1, {
        fileName: "app/routes/eat-with/index.tsx",
        lineNumber: 10,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/eat-with/index.tsx",
    lineNumber: 5,
    columnNumber: 5
  }, this);
}

// app/routes/eat-with/new.tsx
var new_exports = {};
__export(new_exports, {
  action: () => action2,
  default: () => NewNotePage
});
var import_node4 = require("@remix-run/node"), import_react8 = require("@remix-run/react"), React = __toESM(require("react"));
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
async function action2({ request }) {
  let userId = await requireUserId(request), formData = await request.formData(), title = formData.get("title"), body = formData.get("body");
  if (typeof title != "string" || title.length === 0)
    return (0, import_node4.json)(
      { errors: { title: "Title is required", body: null } },
      { status: 400 }
    );
  if (typeof body != "string" || body.length === 0)
    return (0, import_node4.json)(
      { errors: { title: null, body: "Body is required" } },
      { status: 400 }
    );
  let note = await createNote({ title, body, userId });
  return (0, import_node4.redirect)(`/notes/${note.id}`);
}
function NewNotePage() {
  var _a, _b, _c, _d, _e, _f;
  let actionData = (0, import_react8.useActionData)(), titleRef = React.useRef(null), bodyRef = React.useRef(null);
  return React.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.title ? (_b2 = titleRef.current) == null || _b2.focus() : (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.body && ((_d2 = bodyRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react8.Form, {
    method: "post",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%"
    },
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
            className: "flex w-full flex-col gap-1",
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                children: "Title: "
              }, void 0, !1, {
                fileName: "app/routes/eat-with/new.tsx",
                lineNumber: 60,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                ref: titleRef,
                name: "title",
                className: "flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose",
                "aria-invalid": (_a = actionData == null ? void 0 : actionData.errors) != null && _a.title ? !0 : void 0,
                "aria-errormessage": (_b = actionData == null ? void 0 : actionData.errors) != null && _b.title ? "title-error" : void 0
              }, void 0, !1, {
                fileName: "app/routes/eat-with/new.tsx",
                lineNumber: 61,
                columnNumber: 11
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/eat-with/new.tsx",
            lineNumber: 59,
            columnNumber: 9
          }, this),
          ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.title) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "pt-1 text-red-700",
            id: "title-error",
            children: actionData.errors.title
          }, void 0, !1, {
            fileName: "app/routes/eat-with/new.tsx",
            lineNumber: 72,
            columnNumber: 11
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/eat-with/new.tsx",
        lineNumber: 58,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
            className: "flex w-full flex-col gap-1",
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
                children: "Body: "
              }, void 0, !1, {
                fileName: "app/routes/eat-with/new.tsx",
                lineNumber: 80,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
                ref: bodyRef,
                name: "body",
                rows: 8,
                className: "w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6",
                "aria-invalid": (_d = actionData == null ? void 0 : actionData.errors) != null && _d.body ? !0 : void 0,
                "aria-errormessage": (_e = actionData == null ? void 0 : actionData.errors) != null && _e.body ? "body-error" : void 0
              }, void 0, !1, {
                fileName: "app/routes/eat-with/new.tsx",
                lineNumber: 81,
                columnNumber: 11
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/eat-with/new.tsx",
            lineNumber: 79,
            columnNumber: 9
          }, this),
          ((_f = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _f.body) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "pt-1 text-red-700",
            id: "body-error",
            children: actionData.errors.body
          }, void 0, !1, {
            fileName: "app/routes/eat-with/new.tsx",
            lineNumber: 93,
            columnNumber: 11
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/eat-with/new.tsx",
        lineNumber: 78,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        className: "text-right",
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
          type: "submit",
          className: "rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
          children: "Save"
        }, void 0, !1, {
          fileName: "app/routes/eat-with/new.tsx",
          lineNumber: 100,
          columnNumber: 9
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/eat-with/new.tsx",
        lineNumber: 99,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/eat-with/new.tsx",
    lineNumber: 49,
    columnNumber: 5
  }, this);
}

// app/routes/healthcheck.tsx
var healthcheck_exports = {};
__export(healthcheck_exports, {
  loader: () => loader3
});
async function loader3({ request }) {
  let host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  try {
    let url = new URL("/", `http://${host}`);
    return await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok)
          return Promise.reject(r);
      })
    ]), new Response("OK");
  } catch (error) {
    return console.log("healthcheck \u274C", { error }), new Response("ERROR", { status: 500 });
  }
}

// app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action3,
  loader: () => loader4
});
var import_node5 = require("@remix-run/node");
async function action3({ request }) {
  return logout(request);
}
async function loader4() {
  return (0, import_node5.redirect)("/");
}

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index
});
var import_react11 = require("@remix-run/react");

// app/assets/eat-group.jpg
var eat_group_default = "/build/_assets/eat-group-L7IDIPMO.jpg";

// app/utils.ts
var import_react9 = require("@remix-run/react"), import_react10 = require("react"), DEFAULT_REDIRECT = "/";
function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  return !to || typeof to != "string" || !to.startsWith("/") || to.startsWith("//") ? defaultRedirect : to;
}
function useMatchesData(id) {
  let matchingRoutes = (0, import_react9.useMatches)(), route = (0, import_react10.useMemo)(
    () => matchingRoutes.find((route2) => route2.id === id),
    [matchingRoutes, id]
  );
  return route == null ? void 0 : route.data;
}
function isUser(user) {
  return user && typeof user == "object" && typeof user.email == "string";
}
function useOptionalUser() {
  let data = useMatchesData("root");
  if (!(!data || !isUser(data.user)))
    return data.user;
}
function useUser() {
  let maybeUser = useOptionalUser();
  if (!maybeUser)
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  return maybeUser;
}
function validateEmail(email) {
  return typeof email == "string" && email.length > 3 && email.includes("@");
}

// app/styles/landing-page.js
var import_styled_components = __toESM(require("styled-components")), Image = import_styled_components.default.img`
  object-fit: cover;
  opacity: 0.4;
`, Header = import_styled_components.default.header`
  height: 600px;
  width: 100vw;
  background: black;
  overflow: hidden;
`;

// app/routes/index.tsx
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function Index() {
  let user = useOptionalUser();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Image, {
          src: eat_group_default
        }, void 0, !1, {
          fileName: "app/routes/index.tsx",
          lineNumber: 10,
          columnNumber: 9
        }, this),
        user ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react11.Link, {
            to: "/eat-with",
            children: [
              "View Notes for ",
              user.email
            ]
          }, void 0, !0, {
            fileName: "app/routes/index.tsx",
            lineNumber: 13,
            columnNumber: 13
          }, this)
        }, void 0, !1, {
          fileName: "app/routes/index.tsx",
          lineNumber: 12,
          columnNumber: 11
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
          children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react11.Link, {
              to: "/join",
              children: "Sign up"
            }, void 0, !1, {
              fileName: "app/routes/index.tsx",
              lineNumber: 17,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react11.Link, {
              to: "/login",
              children: "Log In"
            }, void 0, !1, {
              fileName: "app/routes/index.tsx",
              lineNumber: 18,
              columnNumber: 13
            }, this)
          ]
        }, void 0, !0, {
          fileName: "app/routes/index.tsx",
          lineNumber: 16,
          columnNumber: 11
        }, this)
      ]
    }, void 0, !0, {
      fileName: "app/routes/index.tsx",
      lineNumber: 9,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/index.tsx",
    lineNumber: 8,
    columnNumber: 5
  }, this);
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action4,
  default: () => LoginPage,
  loader: () => loader5,
  meta: () => meta2
});
var import_node6 = require("@remix-run/node"), import_react12 = require("@remix-run/react"), React2 = __toESM(require("react"));
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
async function loader5({ request }) {
  return await getUserId(request) ? (0, import_node6.redirect)("/") : (0, import_node6.json)({});
}
async function action4({ request }) {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/notes"), remember = formData.get("remember");
  if (!validateEmail(email))
    return (0, import_node6.json)(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  if (typeof password != "string" || password.length === 0)
    return (0, import_node6.json)(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  if (password.length < 8)
    return (0, import_node6.json)(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  let user = await verifyLogin(email, password);
  return user ? createUserSession({
    request,
    userId: user.id,
    remember: remember === "on",
    redirectTo
  }) : (0, import_node6.json)(
    { errors: { email: "Invalid email or password", password: null } },
    { status: 400 }
  );
}
var meta2 = () => ({
  title: "Login"
});
function LoginPage() {
  var _a, _b, _c, _d;
  let [searchParams] = (0, import_react12.useSearchParams)(), redirectTo = searchParams.get("redirectTo") || "/notes", actionData = (0, import_react12.useActionData)(), emailRef = React2.useRef(null), passwordRef = React2.useRef(null);
  return React2.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.email ? (_b2 = emailRef.current) == null || _b2.focus() : (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.password && ((_d2 = passwordRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    className: "flex min-h-full flex-col justify-center",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
      className: "mx-auto w-full max-w-md px-8",
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react12.Form, {
        method: "post",
        className: "space-y-6",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                htmlFor: "email",
                className: "block text-sm font-medium text-gray-700",
                children: "Email address"
              }, void 0, !1, {
                fileName: "app/routes/login.tsx",
                lineNumber: 87,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "mt-1",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    ref: emailRef,
                    id: "email",
                    required: !0,
                    autoFocus: !0,
                    name: "email",
                    type: "email",
                    autoComplete: "email",
                    "aria-invalid": (_a = actionData == null ? void 0 : actionData.errors) != null && _a.email ? !0 : void 0,
                    "aria-describedby": "email-error",
                    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 94,
                    columnNumber: 15
                  }, this),
                  ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "pt-1 text-red-700",
                    id: "email-error",
                    children: actionData.errors.email
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 107,
                    columnNumber: 17
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 93,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/login.tsx",
            lineNumber: 86,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                htmlFor: "password",
                className: "block text-sm font-medium text-gray-700",
                children: "Password"
              }, void 0, !1, {
                fileName: "app/routes/login.tsx",
                lineNumber: 115,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "mt-1",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    id: "password",
                    ref: passwordRef,
                    name: "password",
                    type: "password",
                    autoComplete: "current-password",
                    "aria-invalid": (_c = actionData == null ? void 0 : actionData.errors) != null && _c.password ? !0 : void 0,
                    "aria-describedby": "password-error",
                    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 122,
                    columnNumber: 15
                  }, this),
                  ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "pt-1 text-red-700",
                    id: "password-error",
                    children: actionData.errors.password
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 133,
                    columnNumber: 17
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 121,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/login.tsx",
            lineNumber: 114,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
            type: "hidden",
            name: "redirectTo",
            value: redirectTo
          }, void 0, !1, {
            fileName: "app/routes/login.tsx",
            lineNumber: 140,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
            type: "submit",
            className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
            children: "Log in"
          }, void 0, !1, {
            fileName: "app/routes/login.tsx",
            lineNumber: 141,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "flex items-center justify-between",
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "flex items-center",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    id: "remember",
                    name: "remember",
                    type: "checkbox",
                    className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 149,
                    columnNumber: 15
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                    htmlFor: "remember",
                    className: "ml-2 block text-sm text-gray-900",
                    children: "Remember me"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 155,
                    columnNumber: 15
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 148,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "text-center text-sm text-gray-500",
                children: [
                  "Don't have an account?",
                  " ",
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react12.Link, {
                    className: "text-blue-500 underline",
                    to: {
                      pathname: "/join",
                      search: searchParams.toString()
                    },
                    children: "Sign up"
                  }, void 0, !1, {
                    fileName: "app/routes/login.tsx",
                    lineNumber: 164,
                    columnNumber: 15
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/login.tsx",
                lineNumber: 162,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/login.tsx",
            lineNumber: 147,
            columnNumber: 11
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/login.tsx",
        lineNumber: 85,
        columnNumber: 9
      }, this)
    }, void 0, !1, {
      fileName: "app/routes/login.tsx",
      lineNumber: 84,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/login.tsx",
    lineNumber: 83,
    columnNumber: 5
  }, this);
}

// app/routes/notes.tsx
var notes_exports = {};
__export(notes_exports, {
  default: () => NotesPage,
  loader: () => loader6
});
var import_node7 = require("@remix-run/node"), import_react13 = require("@remix-run/react");
var import_react14 = require("react"), import_jsx_dev_runtime = require("react/jsx-dev-runtime");
async function loader6({ request }) {
  let userId = await requireUserId(request), noteListItems = await getNoteListItems({ userId });
  return (0, import_node7.json)({ noteListItems });
}
function NotesPage() {
  let getLocation = () => {
    typeof window < "u" && typeof window.navigator < "u" && window.navigator.geolocation.getCurrentPosition(
      (res) => {
        setLocation(res);
      },
      (error) => {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }, [location, setLocation] = (0, import_react14.useState)(null), data = (0, import_react13.useLoaderData)(), user = useUser();
  return (0, import_react14.useEffect)(() => {
    getLocation(), console.log(location);
  }, []), console.log("LOCATION", location), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    className: "flex h-full min-h-screen flex-col",
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
        className: "flex items-center justify-between bg-slate-800 p-4 text-white",
        children: [
          location && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
            children: [
              "Your location is ",
              location.coords.latitude,
              ",",
              location.coords.longitude
            ]
          }, void 0, !0, {
            fileName: "app/routes/notes.tsx",
            lineNumber: 48,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
            className: "text-3xl font-bold",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react13.Link, {
              to: ".",
              children: "Notes"
            }, void 0, !1, {
              fileName: "app/routes/notes.tsx",
              lineNumber: 54,
              columnNumber: 11
            }, this)
          }, void 0, !1, {
            fileName: "app/routes/notes.tsx",
            lineNumber: 53,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
            children: user.email
          }, void 0, !1, {
            fileName: "app/routes/notes.tsx",
            lineNumber: 56,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react13.Form, {
            action: "/logout",
            method: "post",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
              type: "submit",
              className: "rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600",
              children: "Logout"
            }, void 0, !1, {
              fileName: "app/routes/notes.tsx",
              lineNumber: 58,
              columnNumber: 11
            }, this)
          }, void 0, !1, {
            fileName: "app/routes/notes.tsx",
            lineNumber: 57,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/notes.tsx",
        lineNumber: 46,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
        className: "flex h-full bg-white",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "h-full w-80 border-r bg-gray-50",
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react13.Link, {
                to: "new",
                className: "block p-4 text-xl text-blue-500",
                children: "+ New Note"
              }, void 0, !1, {
                fileName: "app/routes/notes.tsx",
                lineNumber: 69,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("hr", {}, void 0, !1, {
                fileName: "app/routes/notes.tsx",
                lineNumber: 73,
                columnNumber: 11
              }, this),
              data.noteListItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
                className: "p-4",
                children: "No notes yet"
              }, void 0, !1, {
                fileName: "app/routes/notes.tsx",
                lineNumber: 76,
                columnNumber: 13
              }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
                children: data.noteListItems.map((note) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react13.NavLink, {
                    className: ({ isActive }) => `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`,
                    to: note.id,
                    children: [
                      "\u{1F4DD} ",
                      note.title
                    ]
                  }, void 0, !0, {
                    fileName: "app/routes/notes.tsx",
                    lineNumber: 81,
                    columnNumber: 19
                  }, this)
                }, note.id, !1, {
                  fileName: "app/routes/notes.tsx",
                  lineNumber: 80,
                  columnNumber: 17
                }, this))
              }, void 0, !1, {
                fileName: "app/routes/notes.tsx",
                lineNumber: 78,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/notes.tsx",
            lineNumber: 68,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "flex-1 p-6",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react13.Outlet, {}, void 0, !1, {
              fileName: "app/routes/notes.tsx",
              lineNumber: 96,
              columnNumber: 11
            }, this)
          }, void 0, !1, {
            fileName: "app/routes/notes.tsx",
            lineNumber: 95,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/notes.tsx",
        lineNumber: 67,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/notes.tsx",
    lineNumber: 45,
    columnNumber: 5
  }, this);
}

// app/routes/join.tsx
var join_exports = {};
__export(join_exports, {
  action: () => action5,
  default: () => Join,
  loader: () => loader7,
  meta: () => meta3
});
var import_node8 = require("@remix-run/node"), import_react15 = require("@remix-run/react"), React3 = __toESM(require("react"));
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
async function loader7({ request }) {
  return await getUserId(request) ? (0, import_node8.redirect)("/") : (0, import_node8.json)({});
}
async function action5({ request }) {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  if (!validateEmail(email))
    return (0, import_node8.json)(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  if (typeof password != "string" || password.length === 0)
    return (0, import_node8.json)(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  if (password.length < 8)
    return (0, import_node8.json)(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  if (await getUserByEmail(email))
    return (0, import_node8.json)(
      {
        errors: {
          email: "A user already exists with this email",
          password: null
        }
      },
      { status: 400 }
    );
  let user = await createUser(email, password);
  return createUserSession({
    request,
    userId: user.id,
    remember: !1,
    redirectTo
  });
}
var meta3 = () => ({
  title: "Sign Up"
});
function Join() {
  var _a, _b, _c, _d;
  let [searchParams] = (0, import_react15.useSearchParams)(), redirectTo = searchParams.get("redirectTo") ?? void 0, actionData = (0, import_react15.useActionData)(), emailRef = React3.useRef(null), passwordRef = React3.useRef(null);
  return React3.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.email ? (_b2 = emailRef.current) == null || _b2.focus() : (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.password && ((_d2 = passwordRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    className: "flex min-h-full flex-col justify-center",
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
      className: "mx-auto w-full max-w-md px-8",
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react15.Form, {
        method: "post",
        className: "space-y-6",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                htmlFor: "email",
                className: "block text-sm font-medium text-gray-700",
                children: "Email address"
              }, void 0, !1, {
                fileName: "app/routes/join.tsx",
                lineNumber: 93,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "mt-1",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    ref: emailRef,
                    id: "email",
                    required: !0,
                    autoFocus: !0,
                    name: "email",
                    type: "email",
                    autoComplete: "email",
                    "aria-invalid": (_a = actionData == null ? void 0 : actionData.errors) != null && _a.email ? !0 : void 0,
                    "aria-describedby": "email-error",
                    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 100,
                    columnNumber: 15
                  }, this),
                  ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "pt-1 text-red-700",
                    id: "email-error",
                    children: actionData.errors.email
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 113,
                    columnNumber: 17
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/join.tsx",
                lineNumber: 99,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/join.tsx",
            lineNumber: 92,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
                htmlFor: "password",
                className: "block text-sm font-medium text-gray-700",
                children: "Password"
              }, void 0, !1, {
                fileName: "app/routes/join.tsx",
                lineNumber: 121,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                className: "mt-1",
                children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
                    id: "password",
                    ref: passwordRef,
                    name: "password",
                    type: "password",
                    autoComplete: "new-password",
                    "aria-invalid": (_c = actionData == null ? void 0 : actionData.errors) != null && _c.password ? !0 : void 0,
                    "aria-describedby": "password-error",
                    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 128,
                    columnNumber: 15
                  }, this),
                  ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
                    className: "pt-1 text-red-700",
                    id: "password-error",
                    children: actionData.errors.password
                  }, void 0, !1, {
                    fileName: "app/routes/join.tsx",
                    lineNumber: 139,
                    columnNumber: 17
                  }, this)
                ]
              }, void 0, !0, {
                fileName: "app/routes/join.tsx",
                lineNumber: 127,
                columnNumber: 13
              }, this)
            ]
          }, void 0, !0, {
            fileName: "app/routes/join.tsx",
            lineNumber: 120,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
            type: "hidden",
            name: "redirectTo",
            value: redirectTo
          }, void 0, !1, {
            fileName: "app/routes/join.tsx",
            lineNumber: 146,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
            type: "submit",
            className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
            children: "Create Account"
          }, void 0, !1, {
            fileName: "app/routes/join.tsx",
            lineNumber: 147,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
            className: "flex items-center justify-center",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
              className: "text-center text-sm text-gray-500",
              children: [
                "Already have an account?",
                " ",
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react15.Link, {
                  className: "text-blue-500 underline",
                  to: {
                    pathname: "/login",
                    search: searchParams.toString()
                  },
                  children: "Log in"
                }, void 0, !1, {
                  fileName: "app/routes/join.tsx",
                  lineNumber: 156,
                  columnNumber: 15
                }, this)
              ]
            }, void 0, !0, {
              fileName: "app/routes/join.tsx",
              lineNumber: 154,
              columnNumber: 13
            }, this)
          }, void 0, !1, {
            fileName: "app/routes/join.tsx",
            lineNumber: 153,
            columnNumber: 11
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/routes/join.tsx",
        lineNumber: 91,
        columnNumber: 9
      }, this)
    }, void 0, !1, {
      fileName: "app/routes/join.tsx",
      lineNumber: 90,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/join.tsx",
    lineNumber: 89,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "5ec522d5", entry: { module: "/build/entry.client-APLNITLP.js", imports: ["/build/_shared/chunk-SCXBQPXU.js", "/build/_shared/chunk-DF3EUDCN.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-LUSW7SIZ.js", imports: ["/build/_shared/chunk-4JY5OUUL.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/eat-with/$noteId": { id: "routes/eat-with/$noteId", parentId: "root", path: "eat-with/:noteId", index: void 0, caseSensitive: void 0, module: "/build/routes/eat-with/$noteId-NAIDH5XK.js", imports: ["/build/_shared/chunk-BOCVWV7G.js", "/build/_shared/chunk-UUXYXIFE.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !0, hasErrorBoundary: !0 }, "routes/eat-with/index": { id: "routes/eat-with/index", parentId: "root", path: "eat-with", index: !0, caseSensitive: void 0, module: "/build/routes/eat-with/index-MLOJQ36J.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/eat-with/new": { id: "routes/eat-with/new", parentId: "root", path: "eat-with/new", index: void 0, caseSensitive: void 0, module: "/build/routes/eat-with/new-4GK4S76T.js", imports: ["/build/_shared/chunk-BOCVWV7G.js", "/build/_shared/chunk-UUXYXIFE.js"], hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/healthcheck": { id: "routes/healthcheck", parentId: "root", path: "healthcheck", index: void 0, caseSensitive: void 0, module: "/build/routes/healthcheck-A5E2ZC62.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/index": { id: "routes/index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/index-C4HJ4B4T.js", imports: ["/build/_shared/chunk-SF2IJUPO.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/join": { id: "routes/join", parentId: "root", path: "join", index: void 0, caseSensitive: void 0, module: "/build/routes/join-UE6XSW4C.js", imports: ["/build/_shared/chunk-MMIEBQCH.js", "/build/_shared/chunk-UUXYXIFE.js", "/build/_shared/chunk-SF2IJUPO.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-BDPDBADW.js", imports: ["/build/_shared/chunk-MMIEBQCH.js", "/build/_shared/chunk-UUXYXIFE.js", "/build/_shared/chunk-SF2IJUPO.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-CG5UQZAS.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/notes": { id: "routes/notes", parentId: "root", path: "notes", index: void 0, caseSensitive: void 0, module: "/build/routes/notes-HLMB5NHU.js", imports: ["/build/_shared/chunk-BOCVWV7G.js", "/build/_shared/chunk-UUXYXIFE.js", "/build/_shared/chunk-SF2IJUPO.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, url: "/build/manifest-5EC522D5.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/eat-with/$noteId": {
    id: "routes/eat-with/$noteId",
    parentId: "root",
    path: "eat-with/:noteId",
    index: void 0,
    caseSensitive: void 0,
    module: noteId_exports
  },
  "routes/eat-with/index": {
    id: "routes/eat-with/index",
    parentId: "root",
    path: "eat-with",
    index: !0,
    caseSensitive: void 0,
    module: eat_with_exports
  },
  "routes/eat-with/new": {
    id: "routes/eat-with/new",
    parentId: "root",
    path: "eat-with/new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports
  },
  "routes/healthcheck": {
    id: "routes/healthcheck",
    parentId: "root",
    path: "healthcheck",
    index: void 0,
    caseSensitive: void 0,
    module: healthcheck_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/notes": {
    id: "routes/notes",
    parentId: "root",
    path: "notes",
    index: void 0,
    caseSensitive: void 0,
    module: notes_exports
  },
  "routes/join": {
    id: "routes/join",
    parentId: "root",
    path: "join",
    index: void 0,
    caseSensitive: void 0,
    module: join_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
