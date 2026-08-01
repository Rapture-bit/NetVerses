import QRCodeStyling from "qr-code-styling";

const createQRCode = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        data: JSON.stringify(data),

        dotsOptions: {
          color: "#c3d3ff",
          type: "rounded",
        },

        backgroundOptions: {
          color: "#0e1526",
        },
      });

      qrCode.getRawData("png").then((buffer) => {
        const blob = new Blob([buffer], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        resolve(url);
      });
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

export default createQRCode;
