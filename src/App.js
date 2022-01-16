import CldCustUploadLgRestApi from "./CldCustUploadLgRestApi";

import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Client-Side Upload Large File Demo</h1>
      <p>
        Upload a large file from your local storage to your Cloudinary account.
      </p>
      <CldCustUploadLgRestApi />
    </div>
  );
}
