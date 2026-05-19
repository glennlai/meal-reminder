import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout";
import { HistoryPage } from "@/pages/history-page";
import { HomePage } from "@/pages/home-page";
import { LogMealPage } from "@/pages/log-meal-page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/meal-reminder/home" element={<HomePage />} />
          <Route path="/meal-reminder/log" element={<LogMealPage />} />
          <Route path="/meal-reminder/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/meal-reminder/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
