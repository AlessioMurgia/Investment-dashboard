import {
  AuthBindings,
  Authenticated,
  Refine,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { 
  AccountCircle,  
  Factory,
  Public,
  PieChart,
  Dashboard,
  AccountTree
} from "@mui/icons-material";

import {
  ErrorComponent,
  RefineSnackbarProvider,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import axios from "axios";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { CredentialResponse } from "./interfaces/google";

import {
  AssetTypesList,
  AssetTypeCreate,
  AssetTypeEdit
} from "./pages/asset-types";

import {
  SectorsList,
  SectorCreate,
  SectorEdit
} from "./pages/sectors";

import {
  AreasList,
  AreaCreate,
  AreaEdit
} from "./pages/areas";

import {
  AssetsList,
  AssetCreate,
  AssetEdit
} from "./pages/assets";

import { 
  Login,
  Home,
  MyProfile,
} from "./pages";

import { parseJwt } from "./utils/parse-jwt";
import {ThemedLayoutV2} from "./components/layout/index"

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

function App() {
  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      if (profileObj) {
        const response = await fetch('http://localhost:8080/api/v1/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: profileObj.name,
            email: profileObj.email,
          })
        })

        const data = await response.json();

        if(response.status === 200){
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
              userid: data._id
            })
          );
        } else{
          return {
            success: false,
          };
        }
      }
      
      localStorage.setItem("token", `${credential}`);
      return {
        success: true,
        redirectTo: "/",
      };

    },
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        const { name, email } = JSON.parse(user);
        return { name, email };  

      }

      return null;
    },
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={{
                  default:  dataProvider("http://localhost:8080/api/v1"),
                  plotInterrogations: dataProvider("http://localhost:8080/api/v1/assets")
                }}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={[
                  {
                    name: "dashboard",
                    list:"/",
                    icon: <Dashboard />,
                  },
                  {
                    name: "assets",
                    list: "/assets",
                    create: "/assets/create",
                    edit: "/assets/edit/:id",
                    meta: {
                      canDelete: true,
                    },

                    icon:<PieChart/>,
                  },
                  {
                    name: "types",
                    list: "/types",
                    create: "/types/create",
                    edit: "/types/edit/:id",
                    meta: {
                      canDelete: true,
                    },

                    icon:<AccountTree/>,

                  },
                  {
                    name: "sectors",
                    list: "/sectors",
                    create: "/sectors/create",
                    edit: "/sectors/edit/:id",
                    meta: {
                      canDelete: true,
                    },

                    icon:<Factory/>,
                  },
                  {
                    name: "areas",
                    list: "/areas",
                    create: "/areas/create",
                    edit: "/areas/edit/:id",
                    meta: {
                      canDelete: true,
                    },

                    icon:<Public/>,

                  },
                  {
                    name: "my-profile",
                    options: {label: "My Profile"},
                    list: MyProfile,
                    icon:<AccountCircle/>,
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "UUCi0G-cBYjQw-4ZXqBx",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2 >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route path="/">  
                      <Route index element={<Home />} />  
                    </Route> 
                    
                    <Route index
                      element={<NavigateToResource resource="assets" />}
                    />
                    <Route path="/assets">  
                      <Route index element={<AssetsList />} />
                      <Route path="create" element={<AssetCreate />} />
                      <Route path="edit/:id" element={<AssetEdit />} />
                    </Route>

                    <Route path="/types">  
                      <Route index element={<AssetTypesList />} />
                      <Route path="create" element={<AssetTypeCreate />} />
                      <Route path="edit/:id" element={<AssetTypeEdit />} /> 
                    </Route>

                    <Route path="/sectors">  
                      <Route index element={<SectorsList />} />
                      <Route path="create" element={<SectorCreate />} />
                      <Route path="edit/:id" element={<SectorEdit />} />
                    </Route>

                    <Route path="/areas">  
                      <Route index element={<AreasList />} />
                      <Route path="create" element={<AreaCreate />} />
                      <Route path="edit/:id" element={<AreaEdit />} />
                    </Route>

                    <Route path="/my-profile">  
                      <Route index element={<MyProfile />} />
                    </Route>  

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
