import fetch from "node-fetch";

async function run() {
  const headers = {
    'Content-Type': 'application/json',
    'CJ-Access-Token': 'garbage-token',
    'CJ-Api-Key': 'garbage-key'
  };

  const res2 = await fetch("http://localhost:3000/api/cj-proxy/product/getCategory", {
    method: 'GET',
    headers
  });
  console.log("category status:", res2.status);
  console.log("category response:", await res2.text().catch(e => e.message));
}
run();
