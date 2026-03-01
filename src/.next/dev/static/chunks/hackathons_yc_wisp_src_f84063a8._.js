(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API",
    ()=>API,
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
    "consumeSSE",
    ()=>consumeSSE,
    "getLevels",
    ()=>getLevels
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
"use client";
;
const API = "http://localhost:8001";
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
async function consumeSSE(response, onEvent) {
    const reader = response.body?.getReader();
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
                onEvent(JSON.parse(line.slice(6)));
            } catch  {
            // skip malformed events
            }
        }
    }
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
        className: "text-xs animate-fade-in-fast rounded",
        style: {
            background: "var(--bg-card)",
            border: "1px solid var(--border)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-3 py-1.5 cursor-pointer select-none",
                onClick: toggle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: "var(--text-dim)"
                                },
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            meta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: "var(--text-dim)",
                                    opacity: 0.5
                                },
                                children: meta
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 108,
                                columnNumber: 20
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: "var(--text-dim)",
                            fontSize: 10,
                            display: "inline-block",
                            transition: "transform 0.15s",
                            transform: open ? "rotate(180deg)" : "none"
                        },
                        children: "v"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pb-2",
                children: children
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 115,
                columnNumber: 16
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 98,
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
                className: "flex items-center gap-1.5 text-xs px-3 py-1 animate-fade-in-fast",
                style: {
                    color: "var(--text-dim)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-1 h-1 rounded-full",
                        style: {
                            background: "var(--text-dim)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this),
                    "Searching: ",
                    event.query
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 130,
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
                            lineNumber: 147,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 145,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 139,
                columnNumber: 9
            }, this);
        case "planning_thinking":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Collapsible, {
                label: "Model response",
                defaultOpen: expanded,
                onToggle: setExpanded,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                    className: "text-xs whitespace-pre-wrap",
                    style: {
                        color: "var(--text)",
                        maxHeight: 200,
                        overflow: "auto"
                    },
                    children: event.text
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 160,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 159,
                columnNumber: 9
            }, this);
        case "planning_warnings":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs px-3 py-1.5 rounded animate-fade-in-fast",
                style: {
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)"
                },
                children: event.warnings.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-1.5 py-0.5",
                        style: {
                            color: "var(--text-dim)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.5
                                },
                                children: "!"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 174,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: w
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 175,
                                columnNumber: 15
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 172,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 169,
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
                        lineNumber: 185,
                        columnNumber: 11
                    }, this),
                    "Workflow ready — ",
                    event.workflow.nodes.length,
                    " steps"
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 183,
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
                lineNumber: 192,
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
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 239,
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
                                lineNumber: 250,
                                columnNumber: 15
                            }, this) : m.role === "user" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-3 py-2 rounded-lg text-xs max-w-[260px]",
                                    style: {
                                        background: "var(--accent-dim)",
                                        color: "#fff"
                                    },
                                    children: m.content
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 253,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 252,
                                columnNumber: 15
                            }, this) : m.role === "system" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs px-3 py-1.5 rounded",
                                style: {
                                    color: "var(--blue)",
                                    background: "rgba(96,165,250,0.08)"
                                },
                                children: m.content
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 261,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-3 py-2 rounded-lg text-xs",
                                style: {
                                    background: "var(--bg-card)",
                                    color: "var(--text)"
                                },
                                children: m.content
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 268,
                                columnNumber: 15
                            }, this)
                        }, i, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 248,
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
                                lineNumber: 280,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: endRef
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 288,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 246,
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
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 293,
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
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 306,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 292,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 230,
        columnNumber: 5
    }, this);
}
_s2(ChatPane, "ZmVVq7bl6l+xuhuwgjExM2OyI90=");
_c2 = ChatPane;
function PlanningFeed({ events }) {
    _s3();
    const endRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isDone = events.some((e)=>e.type === "dag_complete" || e.type === "planning_error");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlanningFeed.useEffect": ()=>{
            endRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }
    }["PlanningFeed.useEffect"], [
        events
    ]);
    const visible = events.filter((e)=>e.type === "tool_search_complete" || e.type === "planning_thinking" || e.type === "planning_warnings" || e.type === "dag_complete" || e.type === "planning_error");
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
                        className: "text-xs font-bold tracking-wider uppercase",
                        style: {
                            color: "var(--text-dim)"
                        },
                        children: "Planning"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 347,
                        columnNumber: 9
                    }, this),
                    !isDone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-1.5 h-1.5 rounded-full",
                                style: {
                                    background: "var(--text-dim)",
                                    opacity: 0.6
                                }
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 352,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                style: {
                                    color: "var(--text-dim)"
                                },
                                children: "Thinking..."
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 353,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 351,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 343,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-4 space-y-2",
                children: [
                    visible.map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlanningFeedCard, {
                            event: e
                        }, i, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 359,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: endRef
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 361,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 357,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 342,
        columnNumber: 5
    }, this);
}
_s3(PlanningFeed, "wkzjRsewh8pSmp35FLqjNBWGCLs=");
_c3 = PlanningFeed;
function PlanningFeedCard({ event }) {
    switch(event.type){
        case "tool_search_complete":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Collapsible, {
                label: `"${event.query}"`,
                meta: `${event.count} tools · ${event.elapsed}s`,
                defaultOpen: true,
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
                            lineNumber: 379,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 377,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 371,
                columnNumber: 9
            }, this);
        case "planning_thinking":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Collapsible, {
                label: "Model response",
                defaultOpen: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                    className: "text-xs whitespace-pre-wrap",
                    style: {
                        color: "var(--text-dim)",
                        maxHeight: 200,
                        overflow: "auto"
                    },
                    children: event.text
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 392,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 391,
                columnNumber: 9
            }, this);
        case "planning_warnings":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 rounded-lg text-xs animate-fade-in",
                style: {
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)"
                },
                children: event.warnings.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-1.5 py-0.5",
                        style: {
                            color: "var(--text-dim)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.5
                                },
                                children: "!"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 406,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: w
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 407,
                                columnNumber: 15
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 404,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 401,
                columnNumber: 9
            }, this);
        case "dag_complete":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 rounded-lg text-xs animate-fade-in",
                style: {
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-1.5 h-1.5 rounded-full",
                            style: {
                                background: "var(--text)"
                            }
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 418,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: "var(--text)"
                            },
                            children: [
                                "Workflow ready — ",
                                event.workflow.nodes.length,
                                " steps"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 419,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 417,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 415,
                columnNumber: 9
            }, this);
        case "planning_error":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 rounded-lg text-xs animate-fade-in",
                style: {
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        color: "var(--red)"
                    },
                    children: event.message.slice(0, 300)
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 430,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 428,
                columnNumber: 9
            }, this);
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
                        lineNumber: 470,
                        columnNumber: 13
                    }, this),
                    i < nodes.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-4 h-px",
                        style: {
                            background: "var(--border)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 475,
                        columnNumber: 15
                    }, this)
                ]
            }, n.id, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 469,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 453,
        columnNumber: 5
    }, this);
}
_c5 = PipelineBar;
function ExecutionEntry({ node }) {
    _s4();
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
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 516,
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
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 525,
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
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 528,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 524,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 515,
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
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 535,
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
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 539,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 533,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 514,
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
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 552,
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
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 555,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 551,
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
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 569,
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
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 572,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 568,
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
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 588,
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
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 591,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 587,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 549,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 509,
        columnNumber: 5
    }, this);
}
_s4(ExecutionEntry, "DuL5jiiQQFgbn7gBKAyxwS/H4Ek=");
_c6 = ExecutionEntry;
function WorkflowPane({ workflow, nodeStatuses, phase, runMode, onRun, onCreateWebhook, webhookUrl }) {
    const levels = getLevels(workflow.nodes);
    const showExecution = phase === "executing" || phase === "done";
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
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 636,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs",
                                style: {
                                    color: "var(--text-dim)"
                                },
                                children: workflow.description
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 637,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 635,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            phase === "preview" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onRun("test"),
                                        className: "px-4 py-1.5 rounded text-xs font-medium",
                                        style: {
                                            background: "var(--blue)",
                                            color: "#fff"
                                        },
                                        children: "Test Run"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 644,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onRun("deploy"),
                                        className: "px-4 py-1.5 rounded text-xs font-medium",
                                        style: {
                                            background: "var(--green)",
                                            color: "#000"
                                        },
                                        children: "Deploy"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 651,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true),
                            phase === "done" && runMode === "test" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onRun("test"),
                                        className: "px-4 py-1.5 rounded text-xs font-medium",
                                        style: {
                                            background: "var(--blue)",
                                            color: "#fff"
                                        },
                                        children: "Re-run"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 662,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onRun("deploy"),
                                        className: "px-4 py-1.5 rounded text-xs font-medium",
                                        style: {
                                            background: "var(--green)",
                                            color: "#000"
                                        },
                                        children: "Deploy"
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                        lineNumber: 669,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true),
                            phase === "done" && runMode === "deploy" && !webhookUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onCreateWebhook,
                                className: "px-4 py-1.5 rounded text-xs font-medium",
                                style: {
                                    background: "var(--accent)",
                                    color: "#fff"
                                },
                                children: "Create Webhook"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 679,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                        lineNumber: 641,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 631,
                columnNumber: 7
            }, this),
            showExecution && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PipelineBar, {
                nodes: workflow.nodes,
                nodeStatuses: nodeStatuses
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 690,
                columnNumber: 25
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-4",
                children: showExecution ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        workflow.nodes.filter((n)=>nodeStatuses.has(n.id)).map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ExecutionEntry, {
                                node: nodeStatuses.get(n.id)
                            }, n.id, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                lineNumber: 698,
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
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 705,
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
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 708,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 701,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 694,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 716,
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
                                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                                    lineNumber: 729,
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
                                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                                    lineNumber: 730,
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
                                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                                    lineNumber: 734,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, node.id, true, {
                                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                            lineNumber: 724,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 722,
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
                                        lineNumber: 750,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                                    lineNumber: 749,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, li, true, {
                            fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                            lineNumber: 715,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                    lineNumber: 713,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
                lineNumber: 692,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx",
        lineNumber: 630,
        columnNumber: 5
    }, this);
}
_c7 = WorkflowPane;
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
    }
];
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "Collapsible");
__turbopack_context__.k.register(_c1, "ChatPlanningStep");
__turbopack_context__.k.register(_c2, "ChatPane");
__turbopack_context__.k.register(_c3, "PlanningFeed");
__turbopack_context__.k.register(_c4, "PlanningFeedCard");
__turbopack_context__.k.register(_c5, "PipelineBar");
__turbopack_context__.k.register(_c6, "ExecutionEntry");
__turbopack_context__.k.register(_c7, "WorkflowPane");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$components$2f$workflow$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathons/yc/wisp/src/components/workflow-ui.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function Dashboard() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$components$2f$workflow$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRESETS"][0].prompt);
    const [workflows, setWorkflows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingList, setLoadingList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Fetch all workflows on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$components$2f$workflow$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API"]}/workflows`).then({
                "Dashboard.useEffect": (r)=>r.json()
            }["Dashboard.useEffect"]).then({
                "Dashboard.useEffect": (data)=>{
                    setWorkflows(data.workflows ?? []);
                }
            }["Dashboard.useEffect"]).catch({
                "Dashboard.useEffect": ()=>{}
            }["Dashboard.useEffect"]).finally({
                "Dashboard.useEffect": ()=>setLoadingList(false)
            }["Dashboard.useEffect"]);
        }
    }["Dashboard.useEffect"], []);
    const handleSubmit = ()=>{
        if (!input.trim()) return;
        router.push(`/workflow/new?prompt=${encodeURIComponent(input.trim())}`);
    };
    const statusColor = (status)=>{
        switch(status){
            case "completed":
                return "var(--green)";
            case "running":
                return "var(--blue)";
            case "planned":
                return "var(--text-dim)";
            default:
                return "var(--text-dim)";
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center pt-16 pb-12 px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold mb-2 tracking-tight",
                        style: {
                            color: "var(--text)"
                        },
                        children: "Wisp Instant"
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 52,
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
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                ref: textareaRef,
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
                                        handleSubmit();
                                    }
                                }
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 mt-3 flex-wrap",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$components$2f$workflow$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRESETS"].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setInput(p.prompt);
                                            textareaRef.current?.focus();
                                        },
                                        className: "px-3 py-1.5 rounded text-xs transition-colors",
                                        style: {
                                            background: "var(--bg-surface)",
                                            border: "1px solid var(--border)",
                                            color: "var(--text-dim)"
                                        },
                                        children: p.label
                                    }, p.label, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 84,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 px-4 pb-12 max-w-4xl mx-auto w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4 pb-2",
                        style: {
                            borderBottom: "1px solid var(--border)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xs font-bold tracking-wider uppercase",
                                style: {
                                    color: "var(--text-dim)"
                                },
                                children: "Your Workflows"
                            }, void 0, false, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                style: {
                                    color: "var(--text-dim)"
                                },
                                children: [
                                    workflows.length,
                                    " total"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    loadingList ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center py-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-1",
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
                                    fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                    lineNumber: 122,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 120,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this) : workflows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center py-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs",
                            style: {
                                color: "var(--text-dim)"
                            },
                            children: "No workflows yet. Create one above to get started."
                        }, void 0, false, {
                            fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                            lineNumber: 132,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 131,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-3",
                        style: {
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
                        },
                        children: workflows.map((wf)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push(`/workflow/${wf.id}`),
                                className: "text-left p-4 rounded-lg transition-all hover:scale-[1.01]",
                                style: {
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm font-medium",
                                                style: {
                                                    color: "var(--text)"
                                                },
                                                children: wf.name
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 149,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-1.5 h-1.5 rounded-full",
                                                        style: {
                                                            background: statusColor(wf.status)
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs",
                                                        style: {
                                                            color: "var(--text-dim)"
                                                        },
                                                        children: wf.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                        lineNumber: 157,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 152,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 148,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs mb-3 line-clamp-2",
                                        style: {
                                            color: "var(--text-dim)"
                                        },
                                        children: wf.description
                                    }, void 0, false, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 162,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs px-2 py-0.5 rounded",
                                                style: {
                                                    background: "var(--bg-surface)",
                                                    color: "var(--text-dim)"
                                                },
                                                children: [
                                                    wf.nodes.length,
                                                    " steps"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 169,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs",
                                                style: {
                                                    color: "var(--text-dim)",
                                                    opacity: 0.5
                                                },
                                                children: wf.id
                                            }, void 0, false, {
                                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                                lineNumber: 175,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                        lineNumber: 168,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, wf.id, true, {
                                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                                lineNumber: 139,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/hackathons/yc/wisp/src/app/page.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(Dashboard, "N8NmIzmlHPBdljt4OkXW0b+ylEg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hackathons$2f$yc$2f$wisp$2f$src$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Dashboard;
var _c;
__turbopack_context__.k.register(_c, "Dashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=hackathons_yc_wisp_src_f84063a8._.js.map