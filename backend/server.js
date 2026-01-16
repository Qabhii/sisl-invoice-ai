const app = require("./src/app");

const PORT = 5050;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
