(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hackathons/yc/wisp/src/convex/_generated/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "components",
    ()=>components,
    "internal",
    ()=>internal
]);
/* eslint-disable */ /**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/convex@1.32.0_react@19.2.3/node_modules/convex/dist/esm/server/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/convex@1.32.0_react@19.2.3/node_modules/convex/dist/esm/server/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$components$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/convex@1.32.0_react@19.2.3/node_modules/convex/dist/esm/server/components/index.js [app-client] (ecmascript) <locals>");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anyApi"];
const internal = __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anyApi"];
const components = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$components$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["componentsGeneric"])();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hackathons/yc/wisp/src/components/auth.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SignIn",
    ()=>SignIn,
    "UserMenu",
    ()=>UserMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f40$convex$2d$dev$2b$auth$40$0$2e$0$2e$91_$40$auth$2b$core$40$0$2e$37$2e$4_convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$convex$2d$dev$2f$auth$2f$dist$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/@convex-dev+auth@0.0.91_@auth+core@0.37.4_convex@1.32.0_react@19.2.3__react@19.2.3/node_modules/@convex-dev/auth/dist/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
function SignIn() {
    _s();
    const { signIn } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f40$convex$2d$dev$2b$auth$40$0$2e$0$2e$91_$40$auth$2b$core$40$0$2e$37$2e$4_convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$convex$2d$dev$2f$auth$2f$dist$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthActions"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "var(--bg)",
            gap: 16
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "18",
                    height: "18",
                    viewBox: "0 0 14 14",
                    fill: "none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M7 1L13 7L7 13L1 7L7 1Z",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: "-0.4px",
                    margin: "0 0 4px",
                    color: "var(--text)"
                },
                children: "Wisp"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontSize: 13,
                    color: "var(--text-dim)",
                    margin: "0 0 24px"
                },
                children: "Sign in to orchestrate your automations"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>void signIn("github"),
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 24px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg-card)",
                    color: "var(--text)",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    minWidth: 240,
                    justifyContent: "center",
                    transition: "border-color 0.12s"
                },
                onMouseEnter: (e)=>{
                    e.currentTarget.style.borderColor = "var(--text-muted)";
                },
                onMouseLeave: (e)=>{
                    e.currentTarget.style.borderColor = "var(--border)";
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 16 16",
                        fill: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    "Continue with GitHub"
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>void signIn("google"),
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 24px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg-card)",
                    color: "var(--text)",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    minWidth: 240,
                    justifyContent: "center",
                    transition: "border-color 0.12s"
                },
                onMouseEnter: (e)=>{
                    e.currentTarget.style.borderColor = "var(--text-muted)";
                },
                onMouseLeave: (e)=>{
                    e.currentTarget.style.borderColor = "var(--border)";
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 48 48",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                fill: "#EA4335",
                                d: "M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                fill: "#4285F4",
                                d: "M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                fill: "#FBBC05",
                                d: "M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                fill: "#34A853",
                                d: "M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    "Continue with Google"
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_s(SignIn, "9AZ+bwE57cG7aWHqAJb9DMjjJQM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f40$convex$2d$dev$2b$auth$40$0$2e$0$2e$91_$40$auth$2b$core$40$0$2e$37$2e$4_convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$convex$2d$dev$2f$auth$2f$dist$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthActions"]
    ];
});
_c = SignIn;
function UserMenu({ user }) {
    _s1();
    const { signOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f40$convex$2d$dev$2b$auth$40$0$2e$0$2e$91_$40$auth$2b$core$40$0$2e$37$2e$4_convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$convex$2d$dev$2f$auth$2f$dist$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthActions"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "8px 0"
        },
        children: [
            user.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: user.image,
                alt: "",
                style: {
                    width: 28,
                    height: 28,
                    borderRadius: "50%"
                }
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                lineNumber: 162,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#fff"
                },
                children: (user.name ?? user.email ?? "?")[0].toUpperCase()
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                lineNumber: 168,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>void signOut(),
                title: "Sign out",
                style: {
                    width: 40,
                    height: 24,
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    color: "var(--text-muted)",
                    fontSize: 9,
                    fontFamily: "inherit",
                    transition: "color 0.12s"
                },
                onMouseEnter: (e)=>{
                    e.currentTarget.style.color = "var(--red)";
                },
                onMouseLeave: (e)=>{
                    e.currentTarget.style.color = "var(--text-muted)";
                },
                children: "Out"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/auth.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
_s1(UserMenu, "AMcGkMacqons5ln5OwFCJKcd4O4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f40$convex$2d$dev$2b$auth$40$0$2e$0$2e$91_$40$auth$2b$core$40$0$2e$37$2e$4_convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f40$convex$2d$dev$2f$auth$2f$dist$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthActions"]
    ];
});
_c1 = UserMenu;
var _c, _c1;
__turbopack_context__.k.register(_c, "SignIn");
__turbopack_context__.k.register(_c1, "UserMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatPane",
    ()=>ChatPane,
    "ChatPlanningStep",
    ()=>ChatPlanningStep,
    "Collapsible",
    ()=>Collapsible,
    "ExecutionEntry",
    ()=>ExecutionEntry,
    "PRESETS",
    ()=>PRESETS,
    "PipelineBar",
    ()=>PipelineBar,
    "PlanningFeed",
    ()=>PlanningFeed,
    "WorkflowPane",
    ()=>WorkflowPane,
    "getLevels",
    ()=>getLevels
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/react-markdown/lib/index.js [app-client] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/remark-gfm/lib/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
"use client";
;
;
;
function getLevels(nodes) {
    const map = new Map(nodes.map((n)=>[
            n.id,
            n
        ]));
    const inDeg = new Map(nodes.map((n)=>[
            n.id,
            0
        ]));
    for (const n of nodes){
        for (const dep of n.depends_on){
            if (inDeg.has(n.id)) inDeg.set(n.id, (inDeg.get(n.id) ?? 0) + 1);
        }
    }
    const levels = [];
    const remaining = new Set(inDeg.keys());
    while(remaining.size > 0){
        const level = [
            ...remaining
        ].filter((id)=>(inDeg.get(id) ?? 0) === 0);
        if (level.length === 0) break;
        levels.push(level.map((id)=>map.get(id)));
        for (const id of level){
            remaining.delete(id);
            for (const n of nodes){
                if (n.depends_on.includes(id) && remaining.has(n.id)) {
                    inDeg.set(n.id, (inDeg.get(n.id) ?? 0) - 1);
                }
            }
        }
    }
    return levels;
}
function Collapsible({ label, meta, defaultOpen = true, onToggle, children }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultOpen);
    const toggle = ()=>{
        setOpen((v)=>{
            onToggle?.(!v);
            return !v;
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-fade-in-fast",
        style: {
            border: "1px solid var(--border)",
            borderRadius: 8,
            overflow: "hidden"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    cursor: "pointer",
                    userSelect: "none"
                },
                onClick: toggle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 12,
                                    color: "var(--text-dim)",
                                    fontWeight: 400
                                },
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            meta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11,
                                    color: "var(--text-muted)"
                                },
                                children: meta
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 90,
                                columnNumber: 20
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "12",
                        height: "12",
                        viewBox: "0 0 12 12",
                        fill: "none",
                        style: {
                            transition: "transform 0.15s",
                            transform: open ? "rotate(180deg)" : "none",
                            flexShrink: 0
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M2 4l4 4 4-4",
                            stroke: "var(--text-muted)",
                            strokeWidth: "1.5",
                            strokeLinecap: "round",
                            strokeLinejoin: "round"
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 99,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "0 12px 10px"
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 102,
                columnNumber: 16
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(Collapsible, "pG0khZI24VrkSmCZcWM9qqrVMh4=");
_c = Collapsible;
function ChatPlanningStep({ event }) {
    _s1();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    switch(event.type){
        case "tool_search_start":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1.5 animate-fade-in-fast",
                style: {
                    color: "var(--text-dim)",
                    fontSize: 12,
                    padding: "4px 0"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: "var(--text-muted)",
                            flexShrink: 0
                        }
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this),
                    "Searching: ",
                    event.query
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 117,
                columnNumber: 9
            }, this);
        case "tool_search_complete":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Collapsible, {
                label: `${event.count} tools found`,
                meta: `${event.elapsed}s`,
                defaultOpen: false,
                children: event.tool_names.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-1",
                    children: event.tool_names.map((name, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "px-1.5 py-0.5 rounded",
                            style: {
                                background: "var(--bg-surface)",
                                color: "var(--text-dim)",
                                fontSize: 10
                            },
                            children: name
                        }, i, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 134,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 132,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, this);
        case "planning_thinking":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Collapsible, {
                label: "Model response",
                defaultOpen: expanded,
                onToggle: setExpanded,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "markdown-body",
                    style: {
                        fontSize: 12,
                        lineHeight: 1.6,
                        color: "var(--text)",
                        maxHeight: 200,
                        overflow: "auto"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                        remarkPlugins: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                        ],
                        children: event.text || ""
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 148,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 147,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 146,
                columnNumber: 9
            }, this);
        case "planning_warnings":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-fade-in-fast",
                style: {
                    borderLeft: "2px solid var(--yellow)",
                    paddingLeft: 10,
                    paddingTop: 4,
                    paddingBottom: 4
                },
                children: event.warnings.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            color: "var(--text-dim)",
                            lineHeight: 1.5,
                            padding: "2px 0"
                        },
                        children: w
                    }, i, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 158,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 155,
                columnNumber: 9
            }, this);
        case "dag_complete":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1.5 text-xs px-3 py-1 animate-fade-in-fast",
                style: {
                    color: "var(--text)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-1.5 h-1.5 rounded-full",
                        style: {
                            background: "var(--text)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this),
                    "Workflow ready — ",
                    event.workflow.nodes.length,
                    " steps"
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 167,
                columnNumber: 9
            }, this);
        case "planning_error":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs px-3 py-1 animate-fade-in-fast",
                style: {
                    color: "var(--red)"
                },
                children: event.message.slice(0, 200)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 176,
                columnNumber: 9
            }, this);
        default:
            return null;
    }
}
_s1(ChatPlanningStep, "NZEs4N34I2vU569ODzuIjdsqMlo=");
_c1 = ChatPlanningStep;
function ChatPane({ messages, onSend, loading }) {
    _s2();
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const endRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPane.useEffect": ()=>{
            endRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }
    }["ChatPane.useEffect"], [
        messages
    ]);
    const send = ()=>{
        if (!input.trim() || loading) return;
        onSend(input.trim());
        setInput("");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-full animate-slide-left",
        style: {
            width: 420,
            minWidth: 420,
            borderRight: "1px solid var(--border)",
            background: "var(--bg)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--text-dim)",
                    borderBottom: "1px solid var(--border)",
                    padding: "10px 16px"
                },
                children: "Chat"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto px-4 py-3 space-y-2",
                children: [
                    messages.map((m, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-fade-in-fast",
                            children: m.planningEvent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatPlanningStep, {
                                event: m.planningEvent
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 233,
                                columnNumber: 15
                            }, this) : m.role === "user" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "8px 12px",
                                        borderRadius: 10,
                                        fontSize: 13,
                                        maxWidth: 240,
                                        background: "var(--accent-dim)",
                                        color: "#fff",
                                        lineHeight: 1.5
                                    },
                                    children: m.content
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 236,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 235,
                                columnNumber: 15
                            }, this) : m.role === "system" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    color: "var(--blue)",
                                    paddingLeft: 10,
                                    borderLeft: "2px solid rgba(96,165,250,0.4)"
                                },
                                children: m.content
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 243,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 13,
                                    color: "var(--text)",
                                    lineHeight: 1.6
                                },
                                children: m.content
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 249,
                                columnNumber: 15
                            }, this)
                        }, i, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 231,
                            columnNumber: 11
                        }, this)),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1 px-3 py-2",
                        children: [
                            0,
                            1,
                            2
                        ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-1.5 h-1.5 rounded-full",
                                style: {
                                    background: "var(--text-dim)",
                                    opacity: 0.4
                                }
                            }, i, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 260,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 258,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: endRef
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "10px 12px",
                    borderTop: "1px solid var(--border)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        gap: 8
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            style: {
                                flex: 1,
                                padding: "7px 12px",
                                borderRadius: 8,
                                fontSize: 13,
                                outline: "none",
                                border: "1px solid var(--border)",
                                background: "transparent",
                                color: "var(--text)",
                                fontFamily: "inherit"
                            },
                            placeholder: "Follow up...",
                            value: input,
                            onChange: (e)=>setInput(e.target.value),
                            onKeyDown: (e)=>e.key === "Enter" && send(),
                            disabled: loading
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 273,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: send,
                            disabled: loading || !input.trim(),
                            style: {
                                padding: "7px 14px",
                                borderRadius: 8,
                                fontSize: 13,
                                fontWeight: 500,
                                border: "none",
                                cursor: "pointer",
                                fontFamily: "inherit",
                                background: "var(--accent)",
                                color: "#fff",
                                opacity: loading || !input.trim() ? 0.4 : 1,
                                transition: "opacity 0.15s"
                            },
                            children: "Send"
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 285,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 272,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
_s2(ChatPane, "ZmVVq7bl6l+xuhuwgjExM2OyI90=");
_c2 = ChatPane;
function PlanningFeed({ events, onConvertToWorkflow }) {
    _s3();
    const endRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isDone = events.some((e)=>e.type === "agent_done" || e.type === "dag_complete" || e.type === "planning_error");
    // Active live_url: show when browser_task returns a live_url,
    // hide when monitor_task completes (is_success is set), reshow on new browser_task.
    const liveUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PlanningFeed.useMemo[liveUrl]": ()=>{
            for(let i = events.length - 1; i >= 0; i--){
                const e = events[i];
                if (e.type !== "tool_exec_complete") continue;
                const tn = e.tool_name;
                const r = e.result;
                const obj = r && typeof r === "object" && !Array.isArray(r) ? r : null;
                // monitor_task finished → session is done, hide iframe
                if (tn === "monitor_task" && obj && obj.is_success !== undefined && obj.is_success !== null) {
                    return null;
                }
                // browser_task returned a live_url → session is active
                if (tn === "browser_task" && obj && typeof obj.live_url === "string" && obj.live_url.startsWith("http")) {
                    return obj.live_url;
                }
            }
            return null;
        }
    }["PlanningFeed.useMemo[liveUrl]"], [
        events
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlanningFeed.useEffect": ()=>{
            endRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }
    }["PlanningFeed.useEffect"], [
        events
    ]);
    const visible = events.filter((e)=>e.type === "tool_search_complete" || e.type === "planning_thinking" || e.type === "planning_warnings" || e.type === "dag_complete" || e.type === "planning_error" || e.type === "tool_exec_start" || e.type === "tool_exec_complete" || e.type === "agent_done");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 flex flex-col h-full overflow-hidden animate-slide-right",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-4 py-3",
                style: {
                    borderBottom: "1px solid var(--border)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            fontWeight: 500,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--text-dim)"
                        },
                        children: "Agent"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 356,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            !isDone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-1.5 h-1.5 rounded-full",
                                        style: {
                                            background: "var(--text-dim)",
                                            opacity: 0.6
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 362,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs",
                                        style: {
                                            color: "var(--text-dim)"
                                        },
                                        children: "Working..."
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 363,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true),
                            isDone && onConvertToWorkflow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onConvertToWorkflow,
                                style: {
                                    padding: "5px 14px",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    border: "none",
                                    background: "var(--accent)",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontFamily: "inherit"
                                },
                                children: "Convert to Workflow"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 367,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 359,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 352,
                columnNumber: 7
            }, this),
            liveUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    borderBottom: "1px solid var(--border)",
                    padding: 12
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BrowserLiveView, {
                    liveUrl: liveUrl,
                    isRunning: !isDone
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 389,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 388,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-4 space-y-2",
                children: [
                    visible.map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlanningFeedCard, {
                            event: e
                        }, i, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 394,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: endRef
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 396,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 392,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 351,
        columnNumber: 5
    }, this);
}
_s3(PlanningFeed, "b3Dla0gqqcogZWb0d0ik/2qS7js=");
_c3 = PlanningFeed;
function PlanningFeedCard({ event }) {
    switch(event.type){
        case "tool_search_complete":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Collapsible, {
                label: `"${event.query}"`,
                meta: `${event.count} tools · ${event.elapsed}s`,
                defaultOpen: true,
                children: event.tool_names.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 4
                    },
                    children: event.tool_names.map((name, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                padding: "2px 8px",
                                borderRadius: 12,
                                border: "1px solid var(--border)",
                                color: "var(--text-dim)",
                                fontSize: 11
                            },
                            children: name
                        }, i, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 414,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 412,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 406,
                columnNumber: 9
            }, this);
        case "planning_thinking":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Collapsible, {
                label: "Model response",
                defaultOpen: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "markdown-body",
                    style: {
                        fontSize: 12,
                        lineHeight: 1.6,
                        color: "var(--text)",
                        maxHeight: 300,
                        overflow: "auto"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                        remarkPlugins: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                        ],
                        children: event.text || ""
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 431,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 430,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 429,
                columnNumber: 9
            }, this);
        case "planning_warnings":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-fade-in",
                style: {
                    borderLeft: "2px solid var(--yellow)",
                    paddingLeft: 10,
                    paddingTop: 4,
                    paddingBottom: 4
                },
                children: event.warnings.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            color: "var(--text-dim)",
                            padding: "2px 0",
                            lineHeight: 1.5
                        },
                        children: w
                    }, i, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 441,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 438,
                columnNumber: 9
            }, this);
        case "dag_complete":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-fade-in",
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 0"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--green)",
                            flexShrink: 0
                        }
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 452,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 12,
                            color: "var(--text)"
                        },
                        children: [
                            "Workflow ready — ",
                            event.workflow.nodes.length,
                            " steps"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 453,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 450,
                columnNumber: 9
            }, this);
        case "planning_error":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-fade-in",
                style: {
                    borderLeft: "2px solid var(--red)",
                    paddingLeft: 10,
                    paddingTop: 4,
                    paddingBottom: 4
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize: 12,
                        color: "var(--red)"
                    },
                    children: event.message.slice(0, 300)
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 463,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 461,
                columnNumber: 9
            }, this);
        case "tool_exec_start":
            {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1.5 animate-fade-in-fast",
                    style: {
                        padding: "4px 0"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-1.5 h-1.5 rounded-full animate-pulse",
                            style: {
                                background: "var(--blue, #3b82f6)"
                            }
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 472,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: 12,
                                color: "var(--text)"
                            },
                            children: [
                                "Executing: ",
                                event.server_name,
                                " / ",
                                event.tool_name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 473,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 471,
                    columnNumber: 9
                }, this);
            }
        case "tool_exec_complete":
            {
                const result = event.result;
                const resultObj = result && typeof result === "object" && !Array.isArray(result) ? result : null;
                const liveUrl = resultObj && typeof resultObj.live_url === "string" ? resultObj.live_url : undefined;
                const preview = JSON.stringify(result, null, 2);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Collapsible, {
                    label: `${event.server_name} / ${event.tool_name}`,
                    meta: `${event.success ? "OK" : "FAIL"} · ${event.elapsed}s`,
                    defaultOpen: !event.success,
                    children: [
                        liveUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 8
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: liveUrl,
                                target: "_blank",
                                rel: "noreferrer",
                                style: {
                                    fontSize: 11,
                                    color: "var(--blue)",
                                    textDecoration: "underline"
                                },
                                children: "Open live browser view"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 494,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 493,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            style: {
                                fontSize: 10,
                                lineHeight: 1.4,
                                color: "var(--text-dim)",
                                margin: 0,
                                maxHeight: 200,
                                overflow: "auto",
                                whiteSpace: "pre-wrap"
                            },
                            children: preview.length > 2000 ? preview.slice(0, 2000) + "\n..." : preview
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 500,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 487,
                    columnNumber: 9
                }, this);
            }
        case "agent_done":
            {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-fade-in",
                    style: {
                        padding: "8px 0"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5",
                            style: {
                                marginBottom: 6
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        background: "var(--green)",
                                        flexShrink: 0
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 511,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 12,
                                        color: "var(--text)",
                                        fontWeight: 500
                                    },
                                    children: "Agent complete"
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 512,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 510,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "markdown-body",
                            style: {
                                fontSize: 13,
                                lineHeight: 1.6,
                                color: "var(--text)",
                                margin: 0
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                                remarkPlugins: [
                                    __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                                ],
                                children: event.text || ""
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 515,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 514,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 509,
                    columnNumber: 9
                }, this);
            }
        default:
            return null;
    }
}
_c4 = PlanningFeedCard;
function PipelineBar({ nodes, nodeStatuses }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1 px-4 py-2 overflow-x-auto",
        style: {
            borderBottom: "1px solid var(--border)",
            background: "var(--bg)"
        },
        children: nodes.map((n, i)=>{
            const st = nodeStatuses.get(n.id);
            const status = st?.status ?? "pending";
            const color = status === "complete" ? "var(--green)" : status === "running" ? "var(--blue)" : status === "error" ? "var(--red)" : "var(--border)";
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-2.5 h-2.5 rounded-full transition-all",
                        style: {
                            background: color
                        }
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 555,
                        columnNumber: 13
                    }, this),
                    i < nodes.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-4 h-px",
                        style: {
                            background: "var(--border)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 560,
                        columnNumber: 15
                    }, this)
                ]
            }, n.id, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 554,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 538,
        columnNumber: 5
    }, this);
}
_c5 = PipelineBar;
// ---------------------------------------------------------------------------
// Result formatting helpers
// ---------------------------------------------------------------------------
function isLLMNode(node) {
    return node.server_name === "__llm__";
}
function friendlyLabel(node) {
    if (isLLMNode(node)) return node.step || "AI Analysis";
    return node.step || node.tool_name;
}
function friendlySubtitle(node) {
    if (isLLMNode(node)) return "Language model";
    return `${node.server_name} / ${node.tool_name}`;
}
/** Extract a human-readable string from a result object. */ function formatResult(result) {
    if (result == null) return "";
    if (typeof result === "string") return result;
    // { result: "..." } from LLM nodes
    if (typeof result === "object" && !Array.isArray(result)) {
        const obj = result;
        // If it has a single "result" key with a string, surface that
        if (typeof obj.result === "string") return obj.result;
        // If it has a "text" or "content" key
        if (typeof obj.text === "string") return obj.text;
        if (typeof obj.content === "string") return obj.content;
        // If it has "_truncated" flag, show preview
        if (obj._truncated && typeof obj.preview === "string") return obj.preview;
    }
    // Fallback: pretty JSON
    return JSON.stringify(result, null, 2);
}
// ---------------------------------------------------------------------------
// BrowserLiveView — embedded browser view via iframe
// ---------------------------------------------------------------------------
function BrowserLiveView({ liveUrl, isRunning }) {
    _s4();
    const [maximized, setMaximized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const iframeContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-fade-in-fast",
        style: {
            position: "relative",
            background: "#000",
            borderRadius: maximized ? 0 : 8,
            overflow: "hidden",
            border: maximized ? "none" : "1px solid var(--border)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    background: "var(--bg-surface)",
                    borderBottom: "1px solid var(--border)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            minWidth: 0
                        },
                        children: [
                            isRunning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    flexShrink: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-1.5 h-1.5 rounded-full",
                                        style: {
                                            background: "var(--green)",
                                            animation: "pulse-dot 1s ease-in-out infinite"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 644,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 10,
                                            color: "var(--green)",
                                            fontWeight: 500
                                        },
                                        children: "LIVE"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 648,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 643,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11,
                                    color: "var(--text-dim)"
                                },
                                children: "Browser session"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 651,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 641,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 4,
                            flexShrink: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setMaximized(!maximized),
                                style: {
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                    color: "var(--text-dim)",
                                    fontSize: 11
                                },
                                title: maximized ? "Minimize" : "Maximize",
                                children: maximized ? "↙" : "↗"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 654,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: liveUrl,
                                target: "_blank",
                                rel: "noreferrer",
                                style: {
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                    color: "var(--text-dim)",
                                    fontSize: 11,
                                    textDecoration: "none"
                                },
                                title: "Open in new tab",
                                children: "↗ Open"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 669,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 653,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 631,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                src: liveUrl,
                style: {
                    width: "100%",
                    height: maximized ? "calc(100vh - 80px)" : 400,
                    border: "none",
                    display: "block",
                    background: "#111"
                },
                allow: "clipboard-read; clipboard-write"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 691,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 620,
        columnNumber: 5
    }, this);
    // Maximized: render as fixed overlay
    if (maximized) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                position: "fixed",
                inset: 0,
                zIndex: 999,
                background: "rgba(0,0,0,0.85)",
                display: "flex",
                flexDirection: "column",
                padding: 16
            },
            onClick: (e)=>{
                if (e.target === e.currentTarget) setMaximized(false);
            },
            children: iframeContent
        }, void 0, false, {
            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
            lineNumber: 708,
            columnNumber: 7
        }, this);
    }
    return iframeContent;
}
_s4(BrowserLiveView, "bj39BNlWYy3MX6x+h+LXeQz0sY0=");
_c6 = BrowserLiveView;
/** Trim long text for a preview line. */ function previewText(text, maxLen = 120) {
    const oneLine = text.replace(/\n/g, " ").trim();
    if (oneLine.length <= maxLen) return oneLine;
    return oneLine.slice(0, maxLen) + "…";
}
function ExecutionEntry({ node, isFinal }) {
    _s5();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!!isFinal);
    const statusColor = node.status === "complete" ? "var(--green)" : node.status === "running" ? "var(--blue)" : node.status === "error" ? "var(--red)" : "var(--text-dim)";
    const statusClass = node.status === "running" ? "node-active" : node.status === "complete" ? "node-complete" : node.status === "error" ? "node-error" : "";
    const resultText = node.result !== undefined ? formatResult(node.result) : "";
    const hasResult = resultText.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `animate-fade-in transition-all ${statusClass}`,
        style: {
            background: "var(--bg-card)",
            border: isFinal ? "1px solid var(--accent)" : "1px solid var(--border)",
            borderRadius: 10
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between p-4 cursor-pointer",
                onClick: ()=>setExpanded(!expanded),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 h-2 rounded-full flex-shrink-0",
                                style: {
                                    background: statusColor,
                                    animation: node.status === "running" ? "pulse-dot 1s ease-in-out infinite" : "none"
                                }
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 779,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    minWidth: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: "var(--text)",
                                            lineHeight: 1.3
                                        },
                                        children: isFinal ? "Final Result" : friendlyLabel(node)
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 788,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 11,
                                            marginTop: 2,
                                            color: "var(--text-dim)"
                                        },
                                        children: isFinal ? friendlyLabel(node) : friendlySubtitle(node)
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 791,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 787,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 778,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexShrink: 0
                        },
                        children: [
                            node.status === "running" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11,
                                    color: "var(--text-dim)"
                                },
                                children: "Running..."
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 798,
                                columnNumber: 13
                            }, this),
                            node.elapsed !== undefined && node.status !== "running" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11,
                                    color: "var(--text-dim)",
                                    fontVariantNumeric: "tabular-nums"
                                },
                                children: [
                                    node.elapsed,
                                    "s"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 801,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "12",
                                height: "12",
                                viewBox: "0 0 12 12",
                                fill: "none",
                                style: {
                                    transition: "transform 0.15s",
                                    transform: expanded ? "rotate(180deg)" : "none",
                                    flexShrink: 0
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M2 4l4 4 4-4",
                                    stroke: "var(--text-muted)",
                                    strokeWidth: "1.5",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 809,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 805,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 796,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 774,
                columnNumber: 7
            }, this),
            !expanded && hasResult && node.status === "complete" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "0 16px 12px",
                    marginTop: -2,
                    fontSize: 12,
                    color: "var(--text-dim)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                },
                children: previewText(resultText)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 816,
                columnNumber: 9
            }, this),
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-fade-in-fast",
                style: {
                    padding: "12px 16px 16px",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12
                },
                children: [
                    node.actionRequired && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: 8,
                            borderRadius: 6,
                            background: "rgba(251,191,36,0.12)",
                            border: "1px solid rgba(251,191,36,0.4)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: "#f59e0b",
                                    marginBottom: 4
                                },
                                children: "User action required in browser"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 832,
                                columnNumber: 15
                            }, this),
                            node.actionMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    color: "var(--text-dim)"
                                },
                                children: node.actionMessage
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 836,
                                columnNumber: 17
                            }, this),
                            node.actionUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: node.actionUrl,
                                target: "_blank",
                                rel: "noreferrer",
                                style: {
                                    fontSize: 12,
                                    color: "var(--blue)",
                                    textDecoration: "underline"
                                },
                                children: "Open browser view"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 839,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 831,
                        columnNumber: 13
                    }, this),
                    node.browserSteps && node.browserSteps.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Collapsible, {
                        label: "Browser steps",
                        meta: `${node.browserSteps.length} steps`,
                        defaultOpen: false,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: 4
                            },
                            children: node.browserSteps.map((step, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 11,
                                        color: "var(--text-dim)",
                                        padding: "4px 0"
                                    },
                                    children: [
                                        "Step ",
                                        step.number,
                                        ": ",
                                        step.next_goal,
                                        step.url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: step.url,
                                            target: "_blank",
                                            rel: "noreferrer",
                                            style: {
                                                color: "var(--blue)",
                                                textDecoration: "underline",
                                                marginLeft: 6
                                            },
                                            children: step.url
                                        }, void 0, false, {
                                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                            lineNumber: 854,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, `${step.number}-${idx}`, true, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 851,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 849,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 848,
                        columnNumber: 13
                    }, this),
                    (node.browserLiveUrl || node.browserShareUrl) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 12,
                            fontSize: 12
                        },
                        children: [
                            node.browserLiveUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: node.browserLiveUrl,
                                target: "_blank",
                                rel: "noreferrer",
                                style: {
                                    color: "var(--blue)",
                                    textDecoration: "underline"
                                },
                                children: "Live view"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 868,
                                columnNumber: 17
                            }, this),
                            node.browserShareUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: node.browserShareUrl,
                                target: "_blank",
                                rel: "noreferrer",
                                style: {
                                    color: "var(--blue)",
                                    textDecoration: "underline"
                                },
                                children: "Share link"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 873,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 866,
                        columnNumber: 13
                    }, this),
                    hasResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            margin: 0,
                            fontSize: 13,
                            lineHeight: 1.65,
                            color: "var(--text)",
                            whiteSpace: "pre-wrap",
                            maxHeight: isFinal ? 480 : 280,
                            overflow: "auto"
                        },
                        children: resultText
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 882,
                        columnNumber: 13
                    }, this),
                    node.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            borderLeft: "2px solid var(--red)",
                            paddingLeft: 10
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 12,
                                color: "var(--red)"
                            },
                            children: node.error
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 900,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 899,
                        columnNumber: 13
                    }, this),
                    node.arguments && Object.keys(node.arguments).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Collapsible, {
                        label: "Technical details",
                        defaultOpen: false,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 11,
                                        color: "var(--text-dim)"
                                    },
                                    children: [
                                        node.server_name,
                                        " / ",
                                        node.tool_name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 910,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    className: "font-mono",
                                    style: {
                                        margin: 0,
                                        fontSize: 11,
                                        color: "var(--text-dim)",
                                        maxHeight: 150,
                                        overflow: "auto",
                                        borderLeft: "2px solid var(--border)",
                                        paddingLeft: 10,
                                        lineHeight: 1.5
                                    },
                                    children: JSON.stringify(node.arguments, null, 2)
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 913,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 909,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 908,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 825,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 765,
        columnNumber: 5
    }, this);
}
_s5(ExecutionEntry, "s0HdKtUuYYxuW5nlUgpv8BxsKrI=");
_c7 = ExecutionEntry;
function WorkflowPane({ workflow, nodeStatuses, phase, runMode, browserUseMode, onChangeBrowserUseMode, onRun, onCreateWebhook, webhookUrl, onFreeze, onPublish, freezing }) {
    const levels = getLevels(workflow.nodes);
    const showExecution = phase === "executing" || phase === "done";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 flex flex-col h-full overflow-hidden animate-slide-right",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "var(--text)"
                                },
                                children: workflow.name
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 977,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    color: "var(--text-dim)",
                                    marginTop: 2,
                                    lineHeight: 1.4
                                },
                                children: workflow.description
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 978,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 976,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 8,
                            alignItems: "center"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 11,
                                            color: "var(--text-dim)"
                                        },
                                        children: "Browser"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 984,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        style: {
                                            padding: "4px 8px",
                                            borderRadius: 6,
                                            fontSize: 11,
                                            outline: "none",
                                            background: "var(--bg-surface)",
                                            border: "1px solid var(--border)",
                                            color: "var(--text)",
                                            fontFamily: "inherit"
                                        },
                                        value: browserUseMode,
                                        onChange: (e)=>onChangeBrowserUseMode(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "local",
                                                children: "Local"
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                                lineNumber: 999,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "remote",
                                                children: "Remote"
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                                lineNumber: 1000,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 985,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 983,
                                columnNumber: 11
                            }, this),
                            phase === "preview" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onRun("test"),
                                        style: {
                                            padding: "6px 14px",
                                            borderRadius: 8,
                                            fontSize: 12,
                                            fontWeight: 500,
                                            border: "1px solid var(--border)",
                                            background: "transparent",
                                            color: "var(--text)",
                                            cursor: "pointer",
                                            fontFamily: "inherit"
                                        },
                                        children: "Test Run"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 1005,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onRun("deploy"),
                                        style: {
                                            padding: "6px 14px",
                                            borderRadius: 8,
                                            fontSize: 12,
                                            fontWeight: 500,
                                            border: "none",
                                            background: "var(--accent)",
                                            color: "#fff",
                                            cursor: "pointer",
                                            fontFamily: "inherit"
                                        },
                                        children: "Deploy"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 1011,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true),
                            phase === "done" && runMode === "test" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onRun("test"),
                                        style: {
                                            padding: "6px 14px",
                                            borderRadius: 8,
                                            fontSize: 12,
                                            fontWeight: 500,
                                            border: "1px solid var(--border)",
                                            background: "transparent",
                                            color: "var(--text)",
                                            cursor: "pointer",
                                            fontFamily: "inherit"
                                        },
                                        children: "Re-run"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 1021,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onRun("deploy"),
                                        style: {
                                            padding: "6px 14px",
                                            borderRadius: 8,
                                            fontSize: 12,
                                            fontWeight: 500,
                                            border: "none",
                                            background: "var(--accent)",
                                            color: "#fff",
                                            cursor: "pointer",
                                            fontFamily: "inherit"
                                        },
                                        children: "Deploy"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 1027,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true),
                            phase === "done" && runMode === "deploy" && !webhookUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onCreateWebhook,
                                style: {
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    border: "none",
                                    background: "var(--accent)",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontFamily: "inherit"
                                },
                                children: "Create Webhook"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 1036,
                                columnNumber: 13
                            }, this),
                            onFreeze && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onFreeze,
                                disabled: freezing,
                                style: {
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    border: "1px solid var(--border)",
                                    background: "transparent",
                                    color: freezing ? "var(--text-muted)" : "var(--text)",
                                    cursor: freezing ? "not-allowed" : "pointer",
                                    fontFamily: "inherit",
                                    opacity: freezing ? 0.6 : 1
                                },
                                children: freezing ? "Freezing..." : "Freeze"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 1044,
                                columnNumber: 13
                            }, this),
                            onPublish && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onPublish,
                                style: {
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    border: "none",
                                    background: "var(--green, #22c55e)",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontFamily: "inherit"
                                },
                                children: "Publish"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 1059,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 982,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 973,
                columnNumber: 7
            }, this),
            showExecution && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PipelineBar, {
                nodes: workflow.nodes,
                nodeStatuses: nodeStatuses
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 1073,
                columnNumber: 25
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-4",
                children: showExecution ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        (()=>{
                            const visibleNodes = workflow.nodes.filter((n)=>nodeStatuses.has(n.id));
                            const lastIdx = visibleNodes.length - 1;
                            const allDone = phase === "done";
                            return visibleNodes.map((n, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ExecutionEntry, {
                                    node: nodeStatuses.get(n.id),
                                    isFinal: allDone && i === lastIdx
                                }, n.id, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 1083,
                                    columnNumber: 17
                                }, this));
                        })(),
                        webhookUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 rounded-lg text-xs animate-fade-in",
                            style: {
                                background: "rgba(124,107,240,0.1)",
                                border: "1px solid var(--accent)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-medium mb-1",
                                    style: {
                                        color: "var(--accent)"
                                    },
                                    children: "Webhook Created"
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 1095,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                    style: {
                                        color: "var(--text-dim)"
                                    },
                                    children: webhookUrl
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 1098,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 1091,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 1077,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        gap: 20
                    },
                    children: levels.map((level, li)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 10,
                                        fontWeight: 500,
                                        letterSpacing: "0.07em",
                                        textTransform: "uppercase",
                                        color: "var(--text-muted)",
                                        marginBottom: 8
                                    },
                                    children: [
                                        "Level ",
                                        li + 1
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 1106,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-2",
                                    style: {
                                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))"
                                    },
                                    children: level.map((node)=>{
                                        const isLlm = node.server_name === "__llm__";
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: "12px 14px",
                                                borderRadius: 8,
                                                border: "1px solid var(--border)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: 13,
                                                        fontWeight: 500,
                                                        color: "var(--text)"
                                                    },
                                                    children: node.step
                                                }, void 0, false, {
                                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                                    lineNumber: 1119,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: 11,
                                                        marginTop: 3,
                                                        color: "var(--text-dim)"
                                                    },
                                                    children: isLlm ? "Language model" : `${node.server_name} / ${node.tool_name}`
                                                }, void 0, false, {
                                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                                    lineNumber: 1120,
                                                    columnNumber: 25
                                                }, this),
                                                isLlm && typeof node.arguments.prompt === "string" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: 12,
                                                        marginTop: 8,
                                                        marginBottom: 0,
                                                        color: "var(--text-dim)",
                                                        lineHeight: 1.5
                                                    },
                                                    children: node.arguments.prompt
                                                }, void 0, false, {
                                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                                    lineNumber: 1124,
                                                    columnNumber: 27
                                                }, this),
                                                !isLlm && Object.keys(node.arguments).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                    className: "font-mono",
                                                    style: {
                                                        marginTop: 8,
                                                        marginBottom: 0,
                                                        fontSize: 11,
                                                        color: "var(--text-dim)",
                                                        borderLeft: "2px solid var(--border)",
                                                        paddingLeft: 8,
                                                        lineHeight: 1.5,
                                                        overflow: "auto"
                                                    },
                                                    children: JSON.stringify(node.arguments, null, 2)
                                                }, void 0, false, {
                                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                                    lineNumber: 1129,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, node.id, true, {
                                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                            lineNumber: 1115,
                                            columnNumber: 23
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 1111,
                                    columnNumber: 17
                                }, this),
                                li < levels.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-center py-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-px h-6",
                                        style: {
                                            background: "var(--border)"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 1151,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 1150,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, li, true, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 1105,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 1103,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 1075,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 972,
        columnNumber: 5
    }, this);
}
_c8 = WorkflowPane;
const PRESETS = [
    {
        label: "Competitive analysis pipeline",
        prompt: "Scrape the homepages of Stripe, Square, and Adyen, then compare their product offerings side-by-side and generate a competitive analysis summary with strengths and weaknesses"
    },
    {
        label: "Multi-source research report",
        prompt: "Search GitHub for the top 5 trending AI repositories this week, fetch each repo's README, then synthesize a research briefing that covers what each project does, their tech stacks, and which problems they solve"
    },
    {
        label: "Job market snapshot",
        prompt: "Search for senior backend engineer job postings on LinkedIn and Indeed, extract salary ranges and required skills, then produce a summary table comparing compensation across companies"
    },
    {
        label: "News digest + sentiment",
        prompt: "Scrape the front pages of Hacker News, TechCrunch, and The Verge, identify overlapping stories, then run sentiment analysis on coverage of the top 3 topics and generate a briefing with takeaways"
    },
    {
        label: "UML diagram on draw.io",
        prompt: "Go to draw.io (https://app.diagrams.net) and create a UML class diagram for a simple e-commerce application with entities for User, Product, Order, and OrderItem — including their attributes, methods, and relationships (associations, multiplicities). Save the diagram and take a screenshot."
    },
    {
        label: "Star today's trending GitHub repos",
        prompt: "Fetch today's top trending repositories on GitHub, then for each one check whether I have already starred it and, if not, star it on my behalf. Report which repos were newly starred and which were already starred."
    }
];
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "Collapsible");
__turbopack_context__.k.register(_c1, "ChatPlanningStep");
__turbopack_context__.k.register(_c2, "ChatPane");
__turbopack_context__.k.register(_c3, "PlanningFeed");
__turbopack_context__.k.register(_c4, "PlanningFeedCard");
__turbopack_context__.k.register(_c5, "PipelineBar");
__turbopack_context__.k.register(_c6, "BrowserLiveView");
__turbopack_context__.k.register(_c7, "ExecutionEntry");
__turbopack_context__.k.register(_c8, "WorkflowPane");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hackathons/yc/wisp/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/convex@1.32.0_react@19.2.3/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$ConvexAuthState$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/convex@1.32.0_react@19.2.3/node_modules/convex/dist/esm/react/ConvexAuthState.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/convex@1.32.0_react@19.2.3/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/convex/_generated/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$components$2f$auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/components/auth.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$components$2f$workflow$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
// ─── Icons ────────────────────────────────────────────────────────────────────
function IconCompose() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 18 18",
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 3H3.75A1.5 1.5 0 0 0 2.25 4.5v9.75A1.5 1.5 0 0 0 3.75 15.75H13.5A1.5 1.5 0 0 0 15 14.25V9",
                stroke: "currentColor",
                strokeWidth: "1.4",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13.875 2.625a1.5 1.5 0 0 1 2.121 2.122L9.75 11 6.75 11.75l.75-3 6.375-6.125z",
                stroke: "currentColor",
                strokeWidth: "1.4",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = IconCompose;
function IconAutomations() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 18 18",
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 9a6 6 0 1 0 12 0A6 6 0 0 0 3 9z",
                stroke: "currentColor",
                strokeWidth: "1.4"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 6v3l2 2",
                stroke: "currentColor",
                strokeWidth: "1.4",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c1 = IconAutomations;
function IconMarketplace() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 18 18",
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2.25 3.75h13.5l-1.5 6H3.75l-1.5-6z",
                stroke: "currentColor",
                strokeWidth: "1.4",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "6",
                cy: "14.25",
                r: "0.75",
                fill: "currentColor"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "14.25",
                r: "0.75",
                fill: "currentColor"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3.75 9.75v4.5",
                stroke: "currentColor",
                strokeWidth: "1.4",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M14.25 9.75v4.5",
                stroke: "currentColor",
                strokeWidth: "1.4",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_c2 = IconMarketplace;
function IconCredentials() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 18 18",
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "2.25",
                y: "6.75",
                width: "13.5",
                height: "8.25",
                rx: "1.5",
                stroke: "currentColor",
                strokeWidth: "1.4"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5.25 6.75V5.25a3.75 3.75 0 0 1 7.5 0v1.5",
                stroke: "currentColor",
                strokeWidth: "1.4",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "11.25",
                r: "1.125",
                fill: "currentColor"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_c3 = IconCredentials;
function IconSettings() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 18 18",
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "9",
                r: "2.25",
                stroke: "currentColor",
                strokeWidth: "1.4"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 2.25v1.5M9 14.25v1.5M2.25 9h1.5M14.25 9h1.5M4.4 4.4l1.06 1.06M12.54 12.54l1.06 1.06M4.4 13.6l1.06-1.06M12.54 5.46l1.06-1.06",
                stroke: "currentColor",
                strokeWidth: "1.4",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_c4 = IconSettings;
function IconSend() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "15",
        height: "15",
        viewBox: "0 0 15 15",
        fill: "none",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M2 7.5h11M7.5 2l5.5 5.5-5.5 5.5",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
            lineNumber: 64,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_c5 = IconSend;
// ─── Sidebar ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    {
        id: "compose",
        label: "Compose",
        Icon: IconCompose
    },
    {
        id: "automations",
        label: "Automations",
        Icon: IconAutomations
    },
    {
        id: "credentials",
        label: "Credentials",
        Icon: IconCredentials
    },
    {
        id: "marketplace",
        label: "Marketplace",
        Icon: IconMarketplace
    }
];
function Sidebar({ active, onChange, user }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: 56,
            minWidth: 56,
            height: "100vh",
            background: "var(--bg-sidebar)",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 16,
            paddingBottom: 16,
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 10,
            gap: 2
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    flexShrink: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "14",
                    height: "14",
                    viewBox: "0 0 14 14",
                    fill: "none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M7 1L13 7L7 13L1 7L7 1Z",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 115,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                    width: "100%"
                },
                children: NAV_ITEMS.map(({ id, label, Icon })=>{
                    const isActive = active === id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        title: label,
                        onClick: ()=>onChange(id),
                        style: {
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isActive ? "var(--bg-surface)" : "transparent",
                            color: isActive ? "var(--text)" : "var(--text-muted)",
                            transition: "background 0.12s, color 0.12s",
                            fontFamily: "inherit"
                        },
                        onMouseEnter: (e)=>{
                            if (!isActive) {
                                e.currentTarget.style.color = "var(--text-dim)";
                                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                            }
                        },
                        onMouseLeave: (e)=>{
                            if (!isActive) {
                                e.currentTarget.style.color = "var(--text-muted)";
                                e.currentTarget.style.background = "transparent";
                            }
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {}, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 156,
                            columnNumber: 15
                        }, this)
                    }, id, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 125,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$components$2f$auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserMenu"], {
                user: user
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 164,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                title: "Settings",
                style: {
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    color: "var(--text-muted)",
                    transition: "background 0.12s, color 0.12s",
                    fontFamily: "inherit"
                },
                onMouseEnter: (e)=>{
                    e.currentTarget.style.color = "var(--text-dim)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                },
                onMouseLeave: (e)=>{
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.background = "transparent";
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconSettings, {}, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 191,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 166,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
_c6 = Sidebar;
// ─── Compose (home) ──────────────────────────────────────────────────────────
function ComposePane() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComposePane.useEffect": ()=>{
            const el = textareaRef.current;
            if (!el) return;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        }
    }["ComposePane.useEffect"], [
        input
    ]);
    const handleSubmit = ()=>{
        if (!input.trim()) return;
        router.push(`/workflow/new?prompt=${encodeURIComponent(input.trim())}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px 80px",
            minHeight: "100vh"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: "100%",
                maxWidth: 620
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    style: {
                        fontSize: 28,
                        fontWeight: 600,
                        letterSpacing: "-0.4px",
                        margin: "0 0 8px",
                        color: "var(--text)"
                    },
                    children: "What do you want to automate?"
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 230,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: 14,
                        color: "var(--text-dim)",
                        margin: "0 0 28px",
                        fontWeight: 400
                    },
                    children: "Describe your goal — Wisp finds the right tools and runs them."
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 233,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: 14,
                        padding: "14px 14px 10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            ref: textareaRef,
                            rows: 1,
                            style: {
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                resize: "none",
                                width: "100%",
                                fontSize: 14,
                                lineHeight: "1.65",
                                color: "var(--text)",
                                fontFamily: "inherit",
                                overflow: "hidden",
                                minHeight: 28,
                                padding: 0
                            },
                            placeholder: "e.g. Search GitHub for trending AI repos and summarize them...",
                            value: input,
                            onChange: (e)=>setInput(e.target.value),
                            onKeyDown: (e)=>{
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 249,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 11,
                                        color: "var(--text-muted)"
                                    },
                                    children: "Shift + Enter for new line"
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                    lineNumber: 277,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSubmit,
                                    disabled: !input.trim(),
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: "6px 14px",
                                        borderRadius: 8,
                                        border: "none",
                                        cursor: input.trim() ? "pointer" : "not-allowed",
                                        fontSize: 13,
                                        fontWeight: 500,
                                        fontFamily: "inherit",
                                        background: input.trim() ? "var(--accent)" : "var(--border)",
                                        color: input.trim() ? "#fff" : "var(--text-muted)",
                                        transition: "background 0.15s, color 0.15s"
                                    },
                                    children: [
                                        "Run ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconSend, {}, void 0, false, {
                                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                            lineNumber: 297,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                    lineNumber: 278,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 276,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 238,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginTop: 16
                    },
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$components$2f$workflow$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRESETS"].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setInput(p.prompt);
                                textareaRef.current?.focus();
                            },
                            style: {
                                padding: "6px 14px",
                                borderRadius: 20,
                                border: "1px solid var(--border)",
                                background: "none",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 400,
                                fontFamily: "inherit",
                                color: "var(--text-dim)",
                                transition: "border-color 0.12s, color 0.12s"
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.color = "var(--text)";
                                e.currentTarget.style.borderColor = "var(--text-muted)";
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.color = "var(--text-dim)";
                                e.currentTarget.style.borderColor = "var(--border)";
                            },
                            children: p.label
                        }, p.label, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 305,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 303,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
            lineNumber: 229,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 218,
        columnNumber: 5
    }, this);
}
_s(ComposePane, "JBtnmzwwPwsYbDQegWV4aVbnuJ4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c7 = ComposePane;
// ─── Automations ─────────────────────────────────────────────────────────────
const STATUS_COLOR = {
    completed: "var(--green)",
    running: "var(--blue)",
    planned: "var(--text-dim)"
};
function AutomationsPane() {
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const rawWorkflows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].workflows.list);
    const loading = rawWorkflows === undefined;
    const workflows = (rawWorkflows ?? []).map((wf)=>({
            id: wf._id,
            name: wf.name,
            description: wf.description,
            status: wf.status,
            nodes: wf.nodes.map((n)=>({
                    id: n.id
                }))
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            flex: 1,
            padding: "48px 40px",
            minHeight: "100vh",
            maxWidth: 900,
            width: "100%"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 28
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            fontSize: 22,
                            fontWeight: 600,
                            letterSpacing: "-0.3px",
                            margin: "0 0 4px",
                            color: "var(--text)"
                        },
                        children: "My Automations"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 365,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: 13,
                            color: "var(--text-dim)",
                            margin: 0
                        },
                        children: "Your saved and deployed workflows"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 368,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 364,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 5,
                    paddingTop: 40,
                    justifyContent: "center"
                },
                children: [
                    0,
                    1,
                    2
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "var(--text-muted)",
                            animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`
                        }
                    }, i, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 376,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 374,
                columnNumber: 9
            }, this) : workflows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: "center",
                    paddingTop: 80
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: "var(--text-dim)",
                            fontSize: 14,
                            margin: "0 0 4px"
                        },
                        children: "No automations yet"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 381,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: "var(--text-muted)",
                            fontSize: 12,
                            margin: 0
                        },
                        children: "Create one from the Compose tab"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 382,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 380,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginBottom: 12,
                            fontWeight: 500
                        },
                        children: [
                            workflows.length,
                            " automation",
                            workflows.length !== 1 ? "s" : ""
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 386,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gap: 10,
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
                        },
                        children: workflows.map((wf)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push(`/workflow/${wf.id}`),
                                className: "animate-fade-in",
                                style: {
                                    textAlign: "left",
                                    padding: "16px 18px",
                                    borderRadius: 10,
                                    border: "1px solid var(--border)",
                                    background: "var(--bg-card)",
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    transition: "border-color 0.12s"
                                },
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.borderColor = "var(--text-muted)";
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.borderColor = "var(--border)";
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            marginBottom: 6,
                                            gap: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                    color: "var(--text)",
                                                    lineHeight: 1.4
                                                },
                                                children: wf.name
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 409,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 5,
                                                    flexShrink: 0
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: "50%",
                                                            background: STATUS_COLOR[wf.status] ?? "var(--text-muted)"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                        lineNumber: 413,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 11,
                                                            color: "var(--text-dim)"
                                                        },
                                                        children: wf.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                        lineNumber: 414,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 412,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 408,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 12,
                                            color: "var(--text-dim)",
                                            margin: "0 0 12px",
                                            lineHeight: 1.5,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden"
                                        },
                                        children: wf.description
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 417,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 11,
                                                    color: "var(--text-dim)"
                                                },
                                                children: [
                                                    wf.nodes.length,
                                                    " steps"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 421,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: "var(--border)"
                                                },
                                                children: "·"
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 422,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 11,
                                                    color: "var(--text-muted)",
                                                    fontFamily: "'Roboto Mono', monospace"
                                                },
                                                children: wf.id.slice(0, 8)
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 423,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 420,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, wf.id, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 391,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 389,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 363,
        columnNumber: 5
    }, this);
}
_s1(AutomationsPane, "Sgw4ths/yVQ8Qju67W4b9p6JVo4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c8 = AutomationsPane;
// ─── Credentials ─────────────────────────────────────────────────────────────
const APPS_PER_PAGE = 24;
function IntegrationsSection() {
    _s2();
    const composioApps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].composio.getApps) ?? [];
    const connections = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].composio.getConnections) ?? [];
    const syncApps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAction"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].composio.syncApps);
    const initiate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAction"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].composio.initiateConnection);
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].composio.removeConnection);
    const save = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].composio.saveConnection);
    const [connecting, setConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [syncing, setSyncing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const handleSync = async ()=>{
        setSyncing(true);
        try {
            await syncApps({});
        } catch (err) {
            console.error("Sync error:", err);
        } finally{
            setSyncing(false);
        }
    };
    // Auto-fetch apps on first mount if table is empty
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IntegrationsSection.useEffect": ()=>{
            if (composioApps.length === 0) {
                handleSync();
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["IntegrationsSection.useEffect"], []);
    // Listen for OAuth callback postMessage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IntegrationsSection.useEffect": ()=>{
            const handler = {
                "IntegrationsSection.useEffect.handler": (e)=>{
                    if (e.data?.type === "composio_callback" && connecting) {
                        save({
                            provider: connecting,
                            composioEntityId: e.data.connectedAccountId || "",
                            status: e.data.status || "active"
                        });
                        setConnecting(null);
                    }
                }
            }["IntegrationsSection.useEffect.handler"];
            window.addEventListener("message", handler);
            return ({
                "IntegrationsSection.useEffect": ()=>window.removeEventListener("message", handler)
            })["IntegrationsSection.useEffect"];
        }
    }["IntegrationsSection.useEffect"], [
        connecting,
        save
    ]);
    const connectedProviders = new Map(connections.map((c)=>[
            c.provider,
            c
        ]));
    // Connected apps first, then filter by search
    const sortedApps = [
        ...composioApps
    ].sort((a, b)=>{
        const aConn = connectedProviders.has(a.key) ? 0 : 1;
        const bConn = connectedProviders.has(b.key) ? 0 : 1;
        return aConn - bConn;
    });
    const filtered = search.trim() ? sortedApps.filter((app)=>app.name.toLowerCase().includes(search.toLowerCase()) || app.key.toLowerCase().includes(search.toLowerCase())) : sortedApps;
    const totalPages = Math.ceil(filtered.length / APPS_PER_PAGE);
    const currentPage = Math.min(page, Math.max(0, totalPages - 1));
    const pageApps = filtered.slice(currentPage * APPS_PER_PAGE, (currentPage + 1) * APPS_PER_PAGE);
    // Reset page when search changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IntegrationsSection.useEffect": ()=>{
            setPage(0);
        }
    }["IntegrationsSection.useEffect"], [
        search
    ]);
    const handleConnect = async (appKey)=>{
        setConnecting(appKey);
        try {
            const callbackUrl = `${window.location.origin}/api/composio/callback`;
            const result = await initiate({
                appName: appKey,
                callbackUrl
            });
            if (result.redirectUrl) {
                window.open(result.redirectUrl, "composio_oauth", "width=600,height=700");
            }
        } catch (err) {
            console.error("Composio connect error:", err);
            setConnecting(null);
        }
    };
    const handleDisconnect = async (appKey)=>{
        try {
            await disconnect({
                provider: appKey
            });
        } catch (err) {
            console.error("Composio disconnect error:", err);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            marginBottom: 28
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 14,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "var(--text)",
                                    margin: "0 0 4px"
                                },
                                children: "Integrations"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 534,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 12,
                                    color: "var(--text-dim)",
                                    margin: 0
                                },
                                children: composioApps.length > 0 ? `${composioApps.length} apps available \u00b7 ${connections.length} connected` : "Connect apps via OAuth \u2014 no API keys needed"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 537,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 533,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSync,
                        disabled: syncing,
                        style: {
                            padding: "4px 12px",
                            borderRadius: 6,
                            border: "1px solid var(--border)",
                            background: "transparent",
                            color: "var(--text-dim)",
                            fontSize: 11,
                            fontFamily: "inherit",
                            cursor: syncing ? "not-allowed" : "pointer",
                            opacity: syncing ? 0.5 : 1
                        },
                        children: syncing ? "Syncing..." : "Refresh"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 543,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 532,
                columnNumber: 7
            }, this),
            composioApps.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: "center",
                    padding: "20px 0"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: "var(--text-dim)",
                        fontSize: 12,
                        margin: 0
                    },
                    children: "Loading integrations..."
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 564,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 563,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        placeholder: "Search apps...",
                        value: search,
                        onChange: (e)=>setSearch(e.target.value),
                        style: {
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "var(--bg-surface)",
                            color: "var(--text)",
                            fontSize: 12,
                            fontFamily: "inherit",
                            outline: "none",
                            marginBottom: 12,
                            boxSizing: "border-box"
                        }
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 571,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gap: 8,
                            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))"
                        },
                        children: pageApps.map((app)=>{
                            const conn = connectedProviders.get(app.key);
                            const isActive = conn?.status === "active";
                            const isConnecting = connecting === app.key;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "10px 12px",
                                    borderRadius: 8,
                                    border: `1px solid ${isActive ? "rgba(74,222,128,0.3)" : "var(--border)"}`,
                                    background: isActive ? "rgba(74,222,128,0.05)" : "var(--bg-card)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            minWidth: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 7,
                                                    height: 7,
                                                    borderRadius: "50%",
                                                    background: isActive ? "var(--green)" : "var(--border)",
                                                    flexShrink: 0
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 613,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    color: "var(--text)",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap"
                                                },
                                                children: app.name
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 622,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 612,
                                        columnNumber: 19
                                    }, this),
                                    isActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleDisconnect(app.key),
                                        style: {
                                            padding: "3px 8px",
                                            borderRadius: 5,
                                            border: "1px solid rgba(248,113,113,0.3)",
                                            background: "rgba(248,113,113,0.08)",
                                            color: "var(--red)",
                                            fontSize: 10,
                                            fontFamily: "inherit",
                                            cursor: "pointer",
                                            flexShrink: 0
                                        },
                                        children: "Disconnect"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 627,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleConnect(app.key),
                                        disabled: isConnecting,
                                        style: {
                                            padding: "3px 8px",
                                            borderRadius: 5,
                                            border: "1px solid var(--border)",
                                            background: isConnecting ? "var(--border)" : "transparent",
                                            color: "var(--text-dim)",
                                            fontSize: 10,
                                            fontWeight: 500,
                                            fontFamily: "inherit",
                                            cursor: isConnecting ? "not-allowed" : "pointer",
                                            flexShrink: 0
                                        },
                                        children: isConnecting ? "..." : "Connect"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 644,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, app.key, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 599,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 592,
                        columnNumber: 11
                    }, this),
                    totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            marginTop: 14
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setPage((p)=>Math.max(0, p - 1)),
                                disabled: currentPage === 0,
                                style: {
                                    padding: "4px 10px",
                                    borderRadius: 6,
                                    border: "1px solid var(--border)",
                                    background: "transparent",
                                    color: currentPage === 0 ? "var(--text-muted)" : "var(--text-dim)",
                                    fontSize: 11,
                                    fontFamily: "inherit",
                                    cursor: currentPage === 0 ? "not-allowed" : "pointer"
                                },
                                children: "Prev"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 671,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11,
                                    color: "var(--text-dim)"
                                },
                                children: [
                                    currentPage + 1,
                                    " / ",
                                    totalPages
                                ]
                            }, void 0, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 687,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setPage((p)=>Math.min(totalPages - 1, p + 1)),
                                disabled: currentPage >= totalPages - 1,
                                style: {
                                    padding: "4px 10px",
                                    borderRadius: 6,
                                    border: "1px solid var(--border)",
                                    background: "transparent",
                                    color: currentPage >= totalPages - 1 ? "var(--text-muted)" : "var(--text-dim)",
                                    fontSize: 11,
                                    fontFamily: "inherit",
                                    cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer"
                                },
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 690,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 670,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 530,
        columnNumber: 5
    }, this);
}
_s2(IntegrationsSection, "pa7Wu6+rmniyTD60ju7IaogXMIg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c9 = IntegrationsSection;
const CREDENTIAL_FIELDS = [
    {
        key: "appId",
        placeholder: "App id (e.g. github)",
        disabled: "editing"
    },
    {
        key: "displayName",
        placeholder: "Display name"
    },
    {
        key: "username",
        placeholder: "Username"
    },
    {
        key: "email",
        placeholder: "Email"
    },
    {
        key: "password",
        placeholder: "Password",
        type: "password"
    },
    {
        key: "apiKey",
        placeholder: "API key"
    },
    {
        key: "token",
        placeholder: "Token"
    },
    {
        key: "notes",
        placeholder: "Notes"
    }
];
function CredentialsPane() {
    _s3();
    const rawProfiles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].credentials.list);
    const profiles = rawProfiles ?? [];
    const upsertCredential = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].credentials.upsert);
    const removeCredential = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].credentials.remove);
    const loading = rawProfiles === undefined;
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingAppId, setEditingAppId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        appId: "",
        displayName: "",
        username: "",
        email: "",
        password: "",
        apiKey: "",
        token: "",
        notes: ""
    });
    const resetForm = ()=>{
        setEditingAppId(null);
        setForm({
            appId: "",
            displayName: "",
            username: "",
            email: "",
            password: "",
            apiKey: "",
            token: "",
            notes: ""
        });
    };
    const handleSave = async ()=>{
        const appId = form.appId.trim().toLowerCase();
        if (!appId) return;
        setSaving(true);
        try {
            await upsertCredential({
                appId,
                displayName: form.displayName,
                username: form.username,
                email: form.email,
                password: form.password,
                apiKey: form.apiKey,
                token: form.token,
                notes: form.notes
            });
            resetForm();
        } catch  {} finally{
            setSaving(false);
        }
    };
    const handleEdit = (p)=>{
        setEditingAppId(p.appId);
        setForm({
            appId: p.appId,
            displayName: p.displayName ?? "",
            username: p.username ?? "",
            email: p.email ?? "",
            password: p.password ?? "",
            apiKey: p.apiKey ?? "",
            token: p.token ?? "",
            notes: p.notes ?? ""
        });
    };
    const handleDelete = async (appId)=>{
        try {
            await removeCredential({
                appId
            });
            if (editingAppId === appId) resetForm();
        } catch  {}
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            flex: 1,
            padding: "48px 40px",
            minHeight: "100vh",
            width: "100%"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 28
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            fontSize: 22,
                            fontWeight: 600,
                            letterSpacing: "-0.3px",
                            margin: "0 0 4px",
                            color: "var(--text)"
                        },
                        children: "Credentials"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 782,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: 13,
                            color: "var(--text-dim)",
                            margin: 0
                        },
                        children: "API keys and login profiles for your automations"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 785,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 781,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IntegrationsSection, {}, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 791,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: 18,
                    marginBottom: 20
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gap: 8,
                            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))"
                        },
                        children: CREDENTIAL_FIELDS.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                style: {
                                    padding: "8px 12px",
                                    borderRadius: 6,
                                    border: "1px solid var(--border)",
                                    background: "var(--bg-surface)",
                                    color: "var(--text)",
                                    fontSize: 12,
                                    fontFamily: "inherit",
                                    outline: "none"
                                },
                                type: "type" in f && f.type || "text",
                                placeholder: f.placeholder,
                                value: form[f.key],
                                onChange: (e)=>setForm((prev)=>({
                                            ...prev,
                                            [f.key]: e.target.value
                                        })),
                                disabled: "disabled" in f && f.disabled === "editing" && Boolean(editingAppId)
                            }, f.key, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 805,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 803,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSave,
                                disabled: saving || !form.appId.trim(),
                                style: {
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    border: "none",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    fontFamily: "inherit",
                                    cursor: saving || !form.appId.trim() ? "not-allowed" : "pointer",
                                    background: "var(--accent)",
                                    color: "#fff",
                                    opacity: saving || !form.appId.trim() ? 0.5 : 1,
                                    transition: "opacity 0.15s"
                                },
                                children: editingAppId ? "Update" : "Save"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 826,
                                columnNumber: 11
                            }, this),
                            editingAppId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: resetForm,
                                style: {
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "transparent",
                                    color: "var(--text-dim)",
                                    fontSize: 12,
                                    fontFamily: "inherit",
                                    cursor: "pointer"
                                },
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 846,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 825,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 794,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 5,
                    paddingTop: 40,
                    justifyContent: "center"
                },
                children: [
                    0,
                    1,
                    2
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "var(--text-muted)",
                            animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`
                        }
                    }, i, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 869,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 867,
                columnNumber: 9
            }, this) : profiles.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: "center",
                    paddingTop: 40
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: "var(--text-dim)",
                        fontSize: 13,
                        margin: 0
                    },
                    children: "No credential profiles yet"
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 874,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 873,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginBottom: 12,
                            fontWeight: 500
                        },
                        children: [
                            profiles.length,
                            " profile",
                            profiles.length !== 1 ? "s" : ""
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 878,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gap: 10,
                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))"
                        },
                        children: profiles.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "14px 16px",
                                    borderRadius: 10,
                                    border: "1px solid var(--border)",
                                    background: "var(--bg-card)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                    color: "var(--text)"
                                                },
                                                children: p.displayName || p.appId
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 893,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 10,
                                                    color: "var(--text-muted)",
                                                    fontFamily: "'Roboto Mono', monospace"
                                                },
                                                children: p.appId
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 896,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 892,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 3,
                                            fontSize: 12,
                                            color: "var(--text-dim)"
                                        },
                                        children: [
                                            p.username && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Username: ",
                                                    p.username
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 901,
                                                columnNumber: 34
                                            }, this),
                                            p.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Email: ",
                                                    p.email
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 902,
                                                columnNumber: 31
                                            }, this),
                                            p.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: "Password: --------"
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 903,
                                                columnNumber: 34
                                            }, this),
                                            p.apiKey && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: "API key: --------"
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 904,
                                                columnNumber: 32
                                            }, this),
                                            p.token && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: "Token: --------"
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 905,
                                                columnNumber: 31
                                            }, this),
                                            p.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Notes: ",
                                                    p.notes
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 906,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 900,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: 8,
                                            marginTop: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleEdit(p),
                                                style: {
                                                    padding: "4px 12px",
                                                    borderRadius: 6,
                                                    border: "1px solid var(--border)",
                                                    background: "transparent",
                                                    color: "var(--text-dim)",
                                                    fontSize: 11,
                                                    fontFamily: "inherit",
                                                    cursor: "pointer"
                                                },
                                                children: "Edit"
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 909,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleDelete(p.appId),
                                                style: {
                                                    padding: "4px 12px",
                                                    borderRadius: 6,
                                                    border: "1px solid rgba(248,113,113,0.3)",
                                                    background: "rgba(248,113,113,0.08)",
                                                    color: "var(--red)",
                                                    fontSize: 11,
                                                    fontFamily: "inherit",
                                                    cursor: "pointer"
                                                },
                                                children: "Delete"
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 924,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 908,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, p.appId, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 883,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 881,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 780,
        columnNumber: 5
    }, this);
}
_s3(CredentialsPane, "ZSxDnKJTSDu3M4wR8UCsK0zz3do=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c10 = CredentialsPane;
// ─── Marketplace ─────────────────────────────────────────────────────────────
const FALLBACK_MARKETPLACE = [
    {
        name: "GitHub Intelligence",
        description: "Search repos, read READMEs, analyze trends and generate reports.",
        tags: [
            "GitHub",
            "Research"
        ]
    },
    {
        name: "Competitive Analysis",
        description: "Scrape company homepages, compare features, output structured briefs.",
        tags: [
            "Web",
            "Analysis"
        ]
    },
    {
        name: "Job Market Scanner",
        description: "Search job boards, extract salaries & skills, build comparison tables.",
        tags: [
            "LinkedIn",
            "Data"
        ]
    },
    {
        name: "News Digest",
        description: "Aggregate top stories from multiple sources with sentiment analysis.",
        tags: [
            "News",
            "AI"
        ]
    }
];
function MarketplacePane() {
    _s4();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const rawItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].marketplace.list, {});
    const useMarketplaceItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].marketplace.use);
    const loading = rawItems === undefined;
    const items = rawItems ?? [];
    const [usingId, setUsingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleUse = async (itemId)=>{
        setUsingId(itemId);
        try {
            const workflowId = await useMarketplaceItem({
                marketplaceId: itemId
            });
            router.push(`/workflow/${workflowId}`);
        } catch (err) {
            console.error("Use marketplace item error:", err);
        } finally{
            setUsingId(null);
        }
    };
    // Show Convex items if available, otherwise show fallback
    const displayItems = items.length > 0 ? items.map((item)=>({
            _id: item._id,
            name: item.name,
            description: item.description,
            tags: item.tags ?? [],
            publisherName: item.publisherName,
            usageCount: item.usageCount ?? 0
        })) : FALLBACK_MARKETPLACE.map((item, i)=>({
            _id: null,
            name: item.name,
            description: item.description,
            tags: item.tags,
            publisherName: null,
            usageCount: 0
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            flex: 1,
            padding: "48px 40px",
            minHeight: "100vh",
            maxWidth: 900,
            width: "100%"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 28
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            fontSize: 22,
                            fontWeight: 600,
                            letterSpacing: "-0.3px",
                            margin: "0 0 4px",
                            color: "var(--text)"
                        },
                        children: "Marketplace"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 1000,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: 13,
                            color: "var(--text-dim)",
                            margin: 0
                        },
                        children: "Pre-built automation templates — one click to run"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 1003,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 999,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 5,
                    paddingTop: 40,
                    justifyContent: "center"
                },
                children: [
                    0,
                    1,
                    2
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "var(--text-muted)",
                            animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`
                        }
                    }, i, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 1011,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 1009,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))"
                },
                children: displayItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: "18px 18px",
                            borderRadius: 10,
                            border: "1px solid var(--border)",
                            background: "var(--bg-card)",
                            cursor: item._id ? "pointer" : "default",
                            transition: "border-color 0.12s",
                            display: "flex",
                            flexDirection: "column",
                            gap: 10
                        },
                        onMouseEnter: (e)=>{
                            e.currentTarget.style.borderColor = "var(--text-muted)";
                        },
                        onMouseLeave: (e)=>{
                            e.currentTarget.style.borderColor = "var(--border)";
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: "var(--text)"
                                        },
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 1034,
                                        columnNumber: 17
                                    }, this),
                                    item._id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleUse(item._id),
                                        disabled: usingId === item._id,
                                        style: {
                                            padding: "4px 12px",
                                            borderRadius: 6,
                                            border: "1px solid var(--border)",
                                            background: usingId === item._id ? "var(--border)" : "transparent",
                                            color: "var(--text-dim)",
                                            fontSize: 11,
                                            fontWeight: 500,
                                            cursor: usingId === item._id ? "not-allowed" : "pointer",
                                            fontFamily: "inherit",
                                            transition: "background 0.12s, color 0.12s"
                                        },
                                        onMouseEnter: (e)=>{
                                            if (usingId !== item._id) {
                                                e.currentTarget.style.background = "var(--accent)";
                                                e.currentTarget.style.color = "#fff";
                                                e.currentTarget.style.borderColor = "var(--accent)";
                                            }
                                        },
                                        onMouseLeave: (e)=>{
                                            if (usingId !== item._id) {
                                                e.currentTarget.style.background = "transparent";
                                                e.currentTarget.style.color = "var(--text-dim)";
                                                e.currentTarget.style.borderColor = "var(--border)";
                                            }
                                        },
                                        children: usingId === item._id ? "Cloning..." : "Use"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 1038,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 1033,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 12,
                                    color: "var(--text-dim)",
                                    margin: 0,
                                    lineHeight: 1.5
                                },
                                children: item.description
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 1072,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: 6,
                                            flexWrap: "wrap",
                                            flex: 1
                                        },
                                        children: item.tags.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 10,
                                                    padding: "2px 8px",
                                                    borderRadius: 12,
                                                    border: "1px solid var(--border)",
                                                    color: "var(--text-muted)"
                                                },
                                                children: t
                                            }, t, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 1078,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 1076,
                                        columnNumber: 17
                                    }, this),
                                    item.publisherName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 10,
                                            color: "var(--text-muted)"
                                        },
                                        children: [
                                            "by ",
                                            item.publisherName
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 1093,
                                        columnNumber: 19
                                    }, this),
                                    item.usageCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 10,
                                            color: "var(--text-muted)"
                                        },
                                        children: [
                                            item.usageCount,
                                            " use",
                                            item.usageCount !== 1 ? "s" : ""
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 1098,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 1075,
                                columnNumber: 15
                            }, this)
                        ]
                    }, item._id ?? item.name, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 1017,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 1015,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 998,
        columnNumber: 5
    }, this);
}
_s4(MarketplacePane, "EtlgwJn6WyM5LcOnref4Ez6Ypas=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c11 = MarketplacePane;
function Dashboard() {
    _s5();
    const { isAuthenticated, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$ConvexAuthState$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConvexAuth"])();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].users.currentUser, isAuthenticated ? {} : "skip");
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("compose");
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                background: "var(--bg)"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 5
                },
                children: [
                    0,
                    1,
                    2
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "var(--text-muted)",
                            animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`
                        }
                    }, i, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 1126,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 1124,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
            lineNumber: 1123,
            columnNumber: 7
        }, this);
    }
    if (!isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$components$2f$auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SignIn"], {}, void 0, false, {
            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
            lineNumber: 1134,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            minHeight: "100vh"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Sidebar, {
                active: active,
                onChange: setActive,
                user: user
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 1139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginLeft: 56,
                    flex: 1,
                    display: "flex"
                },
                children: [
                    active === "compose" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ComposePane, {}, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 1141,
                        columnNumber: 34
                    }, this),
                    active === "automations" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AutomationsPane, {}, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 1142,
                        columnNumber: 38
                    }, this),
                    active === "credentials" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CredentialsPane, {}, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 1143,
                        columnNumber: 38
                    }, this),
                    active === "marketplace" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MarketplacePane, {}, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 1144,
                        columnNumber: 38
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 1140,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 1138,
        columnNumber: 5
    }, this);
}
_s5(Dashboard, "Z48WxjWHVeAq8qT4S9fce1NC90w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$ConvexAuthState$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConvexAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$convex$40$1$2e$32$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c12 = Dashboard;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "IconCompose");
__turbopack_context__.k.register(_c1, "IconAutomations");
__turbopack_context__.k.register(_c2, "IconMarketplace");
__turbopack_context__.k.register(_c3, "IconCredentials");
__turbopack_context__.k.register(_c4, "IconSettings");
__turbopack_context__.k.register(_c5, "IconSend");
__turbopack_context__.k.register(_c6, "Sidebar");
__turbopack_context__.k.register(_c7, "ComposePane");
__turbopack_context__.k.register(_c8, "AutomationsPane");
__turbopack_context__.k.register(_c9, "IntegrationsSection");
__turbopack_context__.k.register(_c10, "CredentialsPane");
__turbopack_context__.k.register(_c11, "MarketplacePane");
__turbopack_context__.k.register(_c12, "Dashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=hackathons_yc_wisp_src_c6f6d357._.js.map