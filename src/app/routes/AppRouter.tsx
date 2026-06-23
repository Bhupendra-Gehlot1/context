import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserProvider, useUser } from "../providers/UserProvider";
import { PresenceProvider } from "../providers/PresenceProvider";
import { ROUTES } from "../../core/constants/routes";
import JoinView from "../../features/chat/view/JoinView";
import ChatView from "../../features/chat/view/ChatView";

function ProtectedChatRoute() {
  const { userName } = useUser();

  if (!userName) {
    return <Navigate to={ROUTES.JOIN} replace />;
  }

  return (
    <PresenceProvider>
      <ChatView />
    </PresenceProvider>
  );
}

function JoinRoute() {
  const { userName } = useUser();

  if (userName) {
    return <Navigate to={ROUTES.CHAT} replace />;
  }

  return <JoinView />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.JOIN} element={<JoinRoute />} />
      <Route path={ROUTES.CHAT} element={<ProtectedChatRoute />} />
      <Route path="*" element={<Navigate to={ROUTES.JOIN} replace />} />
    </Routes>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}
