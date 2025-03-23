import { Application, oakCors } from "./src/imports/imports.ts";
import routes from "./src/routes/routes.ts";

const PORT = Number(Deno.env.get("PORT")) || 8000;

// Setting up Oak application
const app = new Application();

//applying CORS middleware globally or to specific routes
app.use(oakCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Router middleware
app.use(routes.routes());
app.use(routes.allowedMethods());

// Default root route
app.use((ctx) => {
    ctx.response.body = "Exam Hive Backend";
});

console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
