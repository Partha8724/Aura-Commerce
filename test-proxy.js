import fetch from "node-fetch";

async function run() {
  const res = await fetch("http://localhost:3000/api/cj-proxy/health");
  console.log("health status:", res.status);
  console.log("health response:", await res.text());
  
  const res2 = await fetch("http://localhost:3000/api/cj-proxy/product/getCategory");
  console.log("category status:", res2.status);
  console.log("category response:", await res2.text().catch(e => e.message));
}
run();
