import React, { Component } from "react";

class CldCustUploadLgRestApi extends Component {
  // Set your cloud name and unsigned upload preset here:
  YOUR_CLOUD_NAME = "YOUR_CLOUD_NAME";
  YOUR_UNSIGNED_UPLOAD_PRESET = "YOUR_UNSIGNED_UPLOAD_PRESET";

  processFile = async (e) => {
    const file = e.target.files[0];
    const XUniqueUploadId = +new Date();
    await this.processFileChunks(file, XUniqueUploadId);
  };

  processFileChunks = async (file, XUniqueUploadId) => {
    const size = file.size;
    const sliceSize = 20000000;
    let start = 0;

    const loop = async () => {
      let end = start + sliceSize;

      if (end > size) {
        end = size;
      }

      const piece = file.slice(start, end);
      await this.send(piece, start, end - 1, size, XUniqueUploadId);

      if (end < size) {
        start += sliceSize;
        setTimeout(loop, 3);
      }
    };

    setTimeout(loop, 3);
  };

  send = async (piece, start, end, size, XUniqueUploadId) => {
    const POST_URL = `https://api.cloudinary.com/v1_1/${this.YOUR_CLOUD_NAME}/auto/upload`;

    console.log("start", start);
    console.log("end", end);
    console.log("uploadId", XUniqueUploadId);

    const formdata = new FormData();

    formdata.append("file", piece);
    formdata.append("cloud_name", this.YOUR_CLOUD_NAME);
    formdata.append("upload_preset", this.YOUR_UNSIGNED_UPLOAD_PRESET);
    formdata.append("public_id", "myChunkedFile");

    try {
      const response = await fetch(POST_URL, {
        method: "POST",
        headers: {
          "X-Unique-Upload-Id": XUniqueUploadId,
          "Content-Range": `bytes ${start}-${end}/${size}`,
        },
        body: formdata,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  render() {
    return (
      <div>
        <h3>Upload:</h3>
        <p>
          Note: Before choosing a file, set your cloud name and unsigned upload
          preset in CldCustUploadLgRestApi.js:
        </p>
        <p>YOUR_CLOUD_NAME</p>
        <p>YOUR_UNSIGNED_UPLOAD_PRESET</p>
        <br />
        <h5>Test image/video upload</h5>
        <input type="file" onChange={this.processFile} />
      </div>
    );
  }
}

export default CldCustUploadLgRestApi;
