import { useEffect, useState } from "react";
import { CognitoUser, AuthenticationDetails, CognitoUserAttribute } from "amazon-cognito-identity-js";
import { userPool } from "./lib/cognitoClient";

export interface Session {
  user: { id: string; email: string };
}

const AUTH_EVENT = "codeless-auth-change";

function notifyAuthChange() {
  console.log("[auth] notifyAuthChange: disparando evento");
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function signIn(email: string, password: string): Promise<string | null> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const authDetails = new AuthenticationDetails({ Username: email, Password: password });
  return new Promise((resolve) => {
    user.authenticateUser(authDetails, {
      onSuccess: () => {
        console.log(
          "[auth] signIn onSuccess: chaves no sessionStorage agora =",
          Object.keys(window.sessionStorage).filter((k) => k.includes("Cognito")),
        );
        console.log("[auth] signIn onSuccess: user.getUsername() =", user.getUsername());
        notifyAuthChange();
        resolve(null);
      },
      onFailure: (err) => {
        console.error("[auth] signIn onFailure", err);
        resolve(err?.message || "Falha ao entrar.");
      },
      // Challenges que este app não suporta hoje — sem isso, a Promise nunca resolvia
      // e o botão ficava girando pra sempre sem erro nenhum aparecer.
      newPasswordRequired: () => resolve("Essa conta precisa definir uma senha nova — use 'Esqueci minha senha'."),
      mfaRequired: () => resolve("Essa conta exige verificação em duas etapas, não suportada neste painel."),
      totpRequired: () => resolve("Essa conta exige verificação em duas etapas, não suportada neste painel."),
      customChallenge: () => resolve("Essa conta exige uma verificação extra, não suportada neste painel."),
    });
  });
}

/** Cognito sempre exige confirmar um código enviado por e-mail antes do primeiro login. */
export function signUp(email: string, password: string): Promise<{ error: string | null; needsConfirmation: boolean }> {
  return new Promise((resolve) => {
    userPool.signUp(email, password, [new CognitoUserAttribute({ Name: "email", Value: email })], [], (err) => {
      if (err) return resolve({ error: err.message ?? "Falha ao criar conta.", needsConfirmation: false });
      resolve({ error: null, needsConfirmation: true });
    });
  });
}

export function confirmSignUp(email: string, code: string): Promise<string | null> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve) => {
    user.confirmRegistration(code, true, (err) => resolve(err ? err.message ?? "Código inválido." : null));
  });
}

export function resendConfirmationCode(email: string): Promise<string | null> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve) => {
    user.resendConfirmationCode((err) => resolve(err ? err.message ?? "Falha ao reenviar código." : null));
  });
}

/** Envia por e-mail um código pra redefinir a senha (fluxo "esqueci minha senha"). */
export function forgotPassword(email: string): Promise<string | null> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve) => {
    user.forgotPassword({
      onSuccess: () => resolve(null),
      onFailure: (err) => resolve(err.message ?? "Falha ao solicitar redefinição."),
    });
  });
}

export function confirmForgotPassword(email: string, code: string, newPassword: string): Promise<string | null> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve) => {
    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(null),
      onFailure: (err) => resolve(err.message ?? "Código inválido."),
    });
  });
}

export async function signOut(): Promise<void> {
  userPool.getCurrentUser()?.signOut();
  notifyAuthChange();
}

export function getSession(): Promise<Session | null> {
  const user = userPool.getCurrentUser();
  console.log("[auth] getSession: getCurrentUser() =", user?.getUsername?.() ?? null);
  if (!user) return Promise.resolve(null);
  return new Promise((resolve) => {
    user.getSession((err: Error | null, session: any) => {
      if (err) {
        console.error("[auth] getSession: user.getSession deu erro", err);
        return resolve(null);
      }
      if (!session?.isValid()) {
        console.warn("[auth] getSession: sessão presente mas inválida/expirada");
        return resolve(null);
      }
      const claims = session.getIdToken().payload;
      console.log("[auth] getSession: sessão válida para", claims.email);
      resolve({ user: { id: claims.sub, email: claims.email } });
    });
  });
}

export function onAuthChange(callback: (session: Session | null) => void): () => void {
  const handler = () => {
    console.log("[auth] onAuthChange: evento recebido, resolvendo sessão");
    getSession().then((s) => {
      console.log("[auth] onAuthChange: callback chamado com", s);
      callback(s);
    });
  };
  window.addEventListener(AUTH_EVENT, handler);
  return () => window.removeEventListener(AUTH_EVENT, handler);
}

/** undefined = ainda carregando a sessão inicial; null = sem sessão. */
export function useSession(): Session | null | undefined {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    getSession().then(setSession);
    return onAuthChange(setSession);
  }, []);

  console.log("[auth] useSession render, session =", session);
  return session;
}
