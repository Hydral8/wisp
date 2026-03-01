(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hackathons/yc/wisp/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
const API = "http://localhost:8001";
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
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
// ---------------------------------------------------------------------------
// ChatPane
// ---------------------------------------------------------------------------
function ChatPane({ messages, onSend, loading }) {
    _s();
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
            width: 340,
            minWidth: 340,
            borderRight: "1px solid var(--border)",
            background: "var(--bg)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-3 text-xs font-bold tracking-wider uppercase",
                style: {
                    color: "var(--text-dim)",
                    borderBottom: "1px solid var(--border)"
                },
                children: "Chat"
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto px-4 py-3 space-y-3",
                children: [
                    messages.map((m, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-fade-in-fast",
                            children: m.role === "user" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-3 py-2 rounded-lg text-xs max-w-[260px]",
                                    style: {
                                        background: "var(--accent-dim)",
                                        color: "#fff"
                                    },
                                    children: m.content
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                    lineNumber: 94,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, this) : m.role === "system" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs px-3 py-1.5 rounded",
                                style: {
                                    color: "var(--blue)",
                                    background: "rgba(96,165,250,0.08)"
                                },
                                children: m.content
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 102,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-3 py-2 rounded-lg text-xs",
                                style: {
                                    background: "var(--bg-card)",
                                    color: "var(--text)"
                                },
                                children: m.content
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 109,
                                columnNumber: 15
                            }, this)
                        }, i, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 91,
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
                                    background: "var(--accent)",
                                    animation: `pulse-dot 1s ease-in-out ${i * 0.2}s infinite`
                                }
                            }, i, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 121,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: endRef
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3",
                style: {
                    borderTop: "1px solid var(--border)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            className: "flex-1 px-3 py-2 rounded text-xs outline-none",
                            style: {
                                background: "var(--bg-surface)",
                                border: "1px solid var(--border)",
                                color: "var(--text)"
                            },
                            placeholder: "Follow up...",
                            value: input,
                            onChange: (e)=>setInput(e.target.value),
                            onKeyDown: (e)=>e.key === "Enter" && send(),
                            disabled: loading
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: send,
                            disabled: loading || !input.trim(),
                            className: "px-3 py-2 rounded text-xs font-medium transition-opacity",
                            style: {
                                background: "var(--accent)",
                                color: "#fff",
                                opacity: loading || !input.trim() ? 0.4 : 1
                            },
                            children: "Send"
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_s(ChatPane, "ZmVVq7bl6l+xuhuwgjExM2OyI90=");
_c = ChatPane;
// ---------------------------------------------------------------------------
// PipelineBar
// ---------------------------------------------------------------------------
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
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 198,
                        columnNumber: 13
                    }, this),
                    i < nodes.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-4 h-px",
                        style: {
                            background: "var(--border)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 203,
                        columnNumber: 15
                    }, this)
                ]
            }, n.id, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 197,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
_c1 = PipelineBar;
// ---------------------------------------------------------------------------
// ExecutionEntry
// ---------------------------------------------------------------------------
function ExecutionEntry({ node }) {
    _s1();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const statusColor = node.status === "complete" ? "var(--green)" : node.status === "running" ? "var(--blue)" : node.status === "error" ? "var(--red)" : "var(--text-dim)";
    const statusClass = node.status === "running" ? "node-active" : node.status === "complete" ? "node-complete" : node.status === "error" ? "node-error" : "";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg p-4 animate-fade-in transition-all cursor-pointer ${statusClass}`,
        style: {
            background: "var(--bg-card)",
            border: "1px solid var(--border)"
        },
        onClick: ()=>setExpanded(!expanded),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 h-2 rounded-full",
                                style: {
                                    background: statusColor,
                                    animation: node.status === "running" ? "pulse-dot 1s ease-in-out infinite" : "none"
                                }
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 245,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs font-medium",
                                        style: {
                                            color: "var(--text)"
                                        },
                                        children: node.step || node.tool_name
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 254,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs mt-0.5",
                                        style: {
                                            color: "var(--text-dim)"
                                        },
                                        children: [
                                            node.server_name,
                                            " / ",
                                            node.tool_name
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 257,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            node.elapsed !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                style: {
                                    color: "var(--text-dim)"
                                },
                                children: [
                                    node.elapsed,
                                    "s"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 264,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                style: {
                                    color: statusColor,
                                    transform: expanded ? "rotate(180deg)" : "none"
                                },
                                children: "v"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 262,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 space-y-2 animate-fade-in-fast",
                children: [
                    node.arguments && Object.keys(node.arguments).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs font-medium mb-1",
                                style: {
                                    color: "var(--blue)"
                                },
                                children: "Request"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 283,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "text-xs p-2 rounded overflow-x-auto",
                                style: {
                                    background: "var(--bg-surface)",
                                    color: "var(--text-dim)",
                                    maxHeight: 200
                                },
                                children: JSON.stringify(node.arguments, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 286,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 282,
                        columnNumber: 13
                    }, this),
                    node.result !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs font-medium mb-1",
                                style: {
                                    color: "var(--green)"
                                },
                                children: "Response"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 302,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "text-xs p-2 rounded overflow-x-auto",
                                style: {
                                    background: "var(--bg-surface)",
                                    color: "var(--text-dim)",
                                    maxHeight: 300
                                },
                                children: typeof node.result === "string" ? node.result : JSON.stringify(node.result, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 305,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 301,
                        columnNumber: 13
                    }, this),
                    node.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs font-medium mb-1",
                                style: {
                                    color: "var(--red)"
                                },
                                children: "Error"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 323,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "text-xs p-2 rounded",
                                style: {
                                    background: "rgba(248,113,113,0.08)",
                                    color: "var(--red)"
                                },
                                children: node.error
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 326,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 322,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 279,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 237,
        columnNumber: 5
    }, this);
}
_s1(ExecutionEntry, "DuL5jiiQQFgbn7gBKAyxwS/H4Ek=");
_c2 = ExecutionEntry;
// ---------------------------------------------------------------------------
// WorkflowPane
// ---------------------------------------------------------------------------
function WorkflowPane({ workflow, nodeStatuses, isExecuting, executionDone, onDeploy, onCreateWebhook, webhookUrl }) {
    const levels = getLevels(workflow.nodes);
    const showExecution = isExecuting || executionDone;
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
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm font-medium",
                                children: workflow.name
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs",
                                style: {
                                    color: "var(--text-dim)"
                                },
                                children: workflow.description
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 373,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 371,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            !isExecuting && !executionDone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onDeploy,
                                className: "px-4 py-1.5 rounded text-xs font-medium",
                                style: {
                                    background: "var(--green)",
                                    color: "#000"
                                },
                                children: "Deploy"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 379,
                                columnNumber: 13
                            }, this),
                            executionDone && !webhookUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onCreateWebhook,
                                className: "px-4 py-1.5 rounded text-xs font-medium",
                                style: {
                                    background: "var(--accent)",
                                    color: "#fff"
                                },
                                children: "Create Webhook"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 388,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 377,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 367,
                columnNumber: 7
            }, this),
            showExecution && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PipelineBar, {
                nodes: workflow.nodes,
                nodeStatuses: nodeStatuses
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 400,
                columnNumber: 25
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-4",
                children: showExecution ? /* Execution feed */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        workflow.nodes.filter((n)=>nodeStatuses.has(n.id)).map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ExecutionEntry, {
                                node: nodeStatuses.get(n.id)
                            }, n.id, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 410,
                                columnNumber: 17
                            }, this)),
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
                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                    lineNumber: 417,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                    style: {
                                        color: "var(--text-dim)"
                                    },
                                    children: [
                                        API,
                                        webhookUrl
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                    lineNumber: 420,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 413,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 406,
                    columnNumber: 11
                }, this) : /* DAG preview */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: levels.map((level, li)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs font-medium mb-2 uppercase tracking-wider",
                                    style: {
                                        color: "var(--text-dim)"
                                    },
                                    children: [
                                        "Level ",
                                        li + 1
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                    lineNumber: 429,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-2",
                                    style: {
                                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))"
                                    },
                                    children: level.map((node)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-3 rounded-lg",
                                            style: {
                                                background: "var(--bg-card)",
                                                border: "1px solid var(--border)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs font-medium",
                                                    children: node.step
                                                }, void 0, false, {
                                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                    lineNumber: 442,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs mt-1",
                                                    style: {
                                                        color: "var(--text-dim)"
                                                    },
                                                    children: [
                                                        node.server_name,
                                                        " / ",
                                                        node.tool_name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                    lineNumber: 443,
                                                    columnNumber: 23
                                                }, this),
                                                Object.keys(node.arguments).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                    className: "text-xs mt-2 p-2 rounded overflow-x-auto",
                                                    style: {
                                                        background: "var(--bg-surface)",
                                                        color: "var(--text-dim)",
                                                        fontSize: 10
                                                    },
                                                    children: JSON.stringify(node.arguments, null, 2)
                                                }, void 0, false, {
                                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                    lineNumber: 447,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, node.id, true, {
                                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                            lineNumber: 437,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                    lineNumber: 435,
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
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 463,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                    lineNumber: 462,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, li, true, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 428,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 426,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 403,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 365,
        columnNumber: 5
    }, this);
}
_c3 = WorkflowPane;
// ---------------------------------------------------------------------------
// Home (main page)
// ---------------------------------------------------------------------------
const PRESETS = [
    {
        label: "GitHub trending AI repos",
        prompt: "Search GitHub for trending AI repositories this week"
    },
    {
        label: "Crypto price check",
        prompt: "Get the current prices of Bitcoin, Ethereum, and Solana"
    },
    {
        label: "Web scrape + summarize",
        prompt: "Scrape the Hacker News front page and summarize the top 5 stories"
    },
    {
        label: "Weather comparison",
        prompt: "Compare the current weather in San Francisco, New York, and London"
    }
];
function Home() {
    _s2();
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [started, setStarted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sessionId, setSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [workflow, setWorkflow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [chatMessages, setChatMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [nodeStatuses, setNodeStatuses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Map());
    const [isExecuting, setIsExecuting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [executionDone, setExecutionDone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [webhookUrl, setWebhookUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handlePlan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Home.useCallback[handlePlan]": async (prompt)=>{
            setStarted(true);
            setLoading(true);
            setChatMessages({
                "Home.useCallback[handlePlan]": (prev)=>[
                        ...prev,
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
            }["Home.useCallback[handlePlan]"]);
            try {
                const res = await fetch(`${API}/plan`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        prompt
                    })
                });
                const data = await res.json();
                setSessionId(data.session_id);
                if (data.chat_messages) {
                    setChatMessages({
                        "Home.useCallback[handlePlan]": (prev)=>[
                                ...prev,
                                ...data.chat_messages
                            ]
                    }["Home.useCallback[handlePlan]"]);
                }
                if (data.workflow) {
                    setWorkflow(data.workflow);
                }
            } catch (err) {
                setChatMessages({
                    "Home.useCallback[handlePlan]": (prev)=>[
                            ...prev,
                            {
                                role: "assistant",
                                content: `Error: ${err}`
                            }
                        ]
                }["Home.useCallback[handlePlan]"]);
            } finally{
                setLoading(false);
            }
        }
    }["Home.useCallback[handlePlan]"], []);
    const handleChat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Home.useCallback[handleChat]": async (message)=>{
            if (!sessionId) return;
            setLoading(true);
            setChatMessages({
                "Home.useCallback[handleChat]": (prev)=>[
                        ...prev,
                        {
                            role: "user",
                            content: message
                        }
                    ]
            }["Home.useCallback[handleChat]"]);
            try {
                const res = await fetch(`${API}/chat`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_id: sessionId,
                        message
                    })
                });
                const data = await res.json();
                if (data.chat_messages) {
                    setChatMessages({
                        "Home.useCallback[handleChat]": (prev)=>[
                                ...prev,
                                ...data.chat_messages
                            ]
                    }["Home.useCallback[handleChat]"]);
                }
                if (data.workflow) {
                    setWorkflow(data.workflow);
                }
            } catch (err) {
                setChatMessages({
                    "Home.useCallback[handleChat]": (prev)=>[
                            ...prev,
                            {
                                role: "assistant",
                                content: `Error: ${err}`
                            }
                        ]
                }["Home.useCallback[handleChat]"]);
            } finally{
                setLoading(false);
            }
        }
    }["Home.useCallback[handleChat]"], [
        sessionId
    ]);
    const handleDeploy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Home.useCallback[handleDeploy]": async ()=>{
            if (!workflow) return;
            setIsExecuting(true);
            try {
                const res = await fetch(`${API}/deploy`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        workflow_id: workflow.id
                    })
                });
                const reader = res.body?.getReader();
                if (!reader) return;
                const decoder = new TextDecoder();
                let buffer = "";
                while(true){
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, {
                        stream: true
                    });
                    const lines = buffer.split("\n\n");
                    buffer = lines.pop() ?? "";
                    for (const line of lines){
                        if (!line.startsWith("data: ")) continue;
                        try {
                            const event = JSON.parse(line.slice(6));
                            if (event.type === "node_start") {
                                setNodeStatuses({
                                    "Home.useCallback[handleDeploy]": (prev)=>{
                                        const next = new Map(prev);
                                        next.set(event.node_id, {
                                            id: event.node_id,
                                            step: event.data.step,
                                            server_name: event.data.server_name,
                                            tool_name: event.data.tool_name,
                                            arguments: event.data.arguments,
                                            status: "running",
                                            level: event.data.level,
                                            progress: event.data.progress
                                        });
                                        return next;
                                    }
                                }["Home.useCallback[handleDeploy]"]);
                            } else if (event.type === "node_complete") {
                                setNodeStatuses({
                                    "Home.useCallback[handleDeploy]": (prev)=>{
                                        const next = new Map(prev);
                                        const existing = next.get(event.node_id);
                                        next.set(event.node_id, {
                                            ...existing,
                                            status: "complete",
                                            result: event.data.result,
                                            elapsed: event.data.elapsed,
                                            progress: event.data.progress
                                        });
                                        return next;
                                    }
                                }["Home.useCallback[handleDeploy]"]);
                            } else if (event.type === "node_error") {
                                setNodeStatuses({
                                    "Home.useCallback[handleDeploy]": (prev)=>{
                                        const next = new Map(prev);
                                        const existing = next.get(event.node_id);
                                        next.set(event.node_id, {
                                            ...existing,
                                            status: "error",
                                            error: event.data.error,
                                            progress: event.data.progress
                                        });
                                        return next;
                                    }
                                }["Home.useCallback[handleDeploy]"]);
                            }
                        } catch  {
                        // skip malformed events
                        }
                    }
                }
            } catch (err) {
                setChatMessages({
                    "Home.useCallback[handleDeploy]": (prev)=>[
                            ...prev,
                            {
                                role: "assistant",
                                content: `Deploy error: ${err}`
                            }
                        ]
                }["Home.useCallback[handleDeploy]"]);
            } finally{
                setIsExecuting(false);
                setExecutionDone(true);
            }
        }
    }["Home.useCallback[handleDeploy]"], [
        workflow
    ]);
    const handleCreateWebhook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Home.useCallback[handleCreateWebhook]": async ()=>{
            if (!workflow) return;
            try {
                const res = await fetch(`${API}/webhooks`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        workflow_id: workflow.id
                    })
                });
                const data = await res.json();
                setWebhookUrl(data.url);
            } catch (err) {
                console.error("Webhook error:", err);
            }
        }
    }["Home.useCallback[handleCreateWebhook]"], [
        workflow
    ]);
    // Initial state: centered input
    if (!started) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-screen flex flex-col items-center justify-center px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold mb-2 tracking-tight",
                    style: {
                        color: "var(--text)"
                    },
                    children: "Wisp Instant"
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 669,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs mb-8",
                    style: {
                        color: "var(--text-dim)"
                    },
                    children: "Describe a workflow — we'll find the right tools and run them."
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 675,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            className: "w-full p-4 rounded-lg text-sm outline-none resize-none",
                            style: {
                                background: "var(--bg-card)",
                                border: "1px solid var(--border)",
                                color: "var(--text)",
                                minHeight: 80
                            },
                            placeholder: "e.g. Search GitHub for trending AI repos this week...",
                            value: input,
                            onChange: (e)=>setInput(e.target.value),
                            onKeyDown: (e)=>{
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    if (input.trim()) handlePlan(input.trim());
                                }
                            }
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 680,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 mt-3 flex-wrap",
                            children: PRESETS.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handlePlan(p.prompt),
                                    className: "px-3 py-1.5 rounded text-xs transition-colors",
                                    style: {
                                        background: "var(--bg-surface)",
                                        border: "1px solid var(--border)",
                                        color: "var(--text-dim)"
                                    },
                                    children: p.label
                                }, p.label, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                    lineNumber: 700,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 698,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 679,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
            lineNumber: 668,
            columnNumber: 7
        }, this);
    }
    // Split-pane: chat left, workflow right
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen flex",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatPane, {
                messages: chatMessages,
                onSend: handleChat,
                loading: loading
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 722,
                columnNumber: 7
            }, this),
            workflow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkflowPane, {
                workflow: workflow,
                nodeStatuses: nodeStatuses,
                isExecuting: isExecuting,
                executionDone: executionDone,
                onDeploy: handleDeploy,
                onCreateWebhook: handleCreateWebhook,
                webhookUrl: webhookUrl
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 728,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1.5 justify-center",
                        children: [
                            0,
                            1,
                            2
                        ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 h-2 rounded-full",
                                style: {
                                    background: "var(--accent)",
                                    animation: `pulse-dot 1s ease-in-out ${i * 0.2}s infinite`
                                }
                            }, i, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 743,
                                columnNumber: 19
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 741,
                        columnNumber: 15
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs",
                        style: {
                            color: "var(--text-dim)"
                        },
                        children: "Waiting for workflow plan..."
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 754,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                    lineNumber: 739,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 738,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 721,
        columnNumber: 5
    }, this);
}
_s2(Home, "Avia7j/4u+2ner42Qh8kjINUVA4=");
_c4 = Home;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "ChatPane");
__turbopack_context__.k.register(_c1, "PipelineBar");
__turbopack_context__.k.register(_c2, "ExecutionEntry");
__turbopack_context__.k.register(_c3, "WorkflowPane");
__turbopack_context__.k.register(_c4, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=hackathons_yc_wisp_src_b8103529._.js.map