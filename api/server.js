// this moves the listener from index.js to here for testing 

import app from "./index.js";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});