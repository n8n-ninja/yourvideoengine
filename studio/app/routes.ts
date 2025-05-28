import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/login", "routes/login.tsx"),
  route("/client/:client_slug/*", "routes/protected.tsx"),
  index("routes/home.tsx"),
] satisfies RouteConfig;
