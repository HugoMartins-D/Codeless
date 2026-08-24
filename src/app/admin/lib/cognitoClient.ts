import { CognitoUserPool, type ICognitoStorage } from "amazon-cognito-identity-js";

const userPoolId = (import.meta.env.VITE_COGNITO_USER_POOL_ID as string | undefined) || "sa-east-1_00PXPGtFm";
const clientId = (import.meta.env.VITE_COGNITO_CLIENT_ID as string | undefined) || "39b4eii51pvi5erg5eaadep2lv";

if (!import.meta.env.VITE_COGNITO_USER_POOL_ID || !import.meta.env.VITE_COGNITO_CLIENT_ID) {
  console.error(
    "Cognito não configurado explicitamente: defina VITE_COGNITO_USER_POOL_ID e VITE_COGNITO_CLIENT_ID (usando os valores padrão do projeto por enquanto).",
  );
}

// sessionStorage (não localStorage) — mesma decisão que existia para o Supabase Auth:
// isola a sessão por aba e reduz a janela de roubo de token entre abas do mesmo navegador.
const storage: ICognitoStorage = window.sessionStorage;

export const userPool = new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId, Storage: storage });
