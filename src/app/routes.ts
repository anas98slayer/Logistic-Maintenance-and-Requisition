import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { MaintenanceList } from "./components/MaintenanceList";
import { RequisitionList } from "./components/RequisitionList";
import { EquipmentList } from "./components/EquipmentList";
import { InventoryList } from "./components/InventoryList";
import { UserManagement } from "./components/UserManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "maintenance", Component: MaintenanceList },
      { path: "requisitions", Component: RequisitionList },
      { path: "equipment", Component: EquipmentList },
      { path: "inventory", Component: InventoryList },
      { path: "users", Component: UserManagement },
    ],
  },
]);
