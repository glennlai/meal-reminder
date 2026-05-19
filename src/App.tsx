import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout";
import { HistoryPage } from "@/pages/history-page";
import { HomePage } from "@/pages/home-page";
import { AddMealPage } from "@/pages/add-meal-page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/meal-reminder/" element={<HomePage />} />
          <Route path="/meal-reminder/add" element={<AddMealPage />} />
          <Route path="/meal-reminder/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/meal-reminder/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
