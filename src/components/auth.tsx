"use client";

import { useAuthActions } from "@convex-dev/auth/react";

export function SignIn() {
  const { signIn } = useAuthActions();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--bg)",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
          <path d="M7 1L13 7L7 13L1 7L7 1Z" fill="white" />
        </svg>
      </div>

      <h1
        style={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-0.4px",
          margin: "0 0 4px",
          color: "var(--text)",
        }}
      >
        Wisp
      </h1>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-dim)",
          margin: "0 0 24px",
        }}
      >
        Sign in to orchestrate your automations
      </p>

      <button
        onClick={() => void signIn("google")}
        style={{
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
          transition: "border-color 0.12s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--text-muted)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--border)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}

export function UserMenu({
  user,
}: {
  user: { name?: string; image?: string; email?: string };
}) {
  const { signOut } = useAuthActions();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "8px 0",
      }}
    >
      {user.image ? (
        <img
          src={user.image}
          alt=""
          style={{ width: 28, height: 28, borderRadius: "50%" }}
        />
      ) : (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          {(user.name ?? user.email ?? "?")[0].toUpperCase()}
        </div>
      )}
      <button
        onClick={() => void signOut()}
        title="Sign out"
        style={{
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
          transition: "color 0.12s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--red)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color =
            "var(--text-muted)";
        }}
      >
        Out
      </button>
    </div>
  );
}
