import { useEffect, useState } from "react";
import { CognitoUser, AuthenticationDetails, CognitoUserAttribute } from "amazon-cognito-identity-js";
import { userPool } from "./lib/cognitoClient";

export interface Session {
  user: { id: string; email: string };
}

const AUTH_EVENT = "codeless-auth-change";

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function signIn(email: string, password: string): Promise<string | null> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const authDetails = new AuthenticationDetails({ Username: email, Password: password });
  return new Promise((resolve) => {
    user.authenticateUser(authDetails, {
      onSuccess: () => {
        notifyAuthChange();
        resolve(null);
      },
      onFailure: (err) => resolve(err.message ?? "Falha ao entrar."),
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
  if (!user) return Promise.resolve(null);
  return new Promise((resolve) => {
    user.getSession((err: Error | null, session: any) => {
      if (err || !session?.isValid()) return resolve(null);
      const claims = session.getIdToken().payload;
      resolve({ user: { id: claims.sub, email: claims.email } });
    });
  });
}

export function onAuthChange(callback: (session: Session | null) => void): () => void {
  const handler = () => {
    getSession().then(callback);
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

  return session;
}
