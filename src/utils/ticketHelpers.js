// src/utils/ticketHelpers.js

export const generateTicketHTML = (logoBase64, nomorFinal, selectedQueue, waktuCetak) => `
  <html>
    <head>
      <style>
      @page {
        size: 65.5mm auto;
        margin: 0;
        padding: 0;
      }

      @media print {
        body {
          width: 65.5mm;
          margin: 0;
          padding: 0;
        }

        .ticket-box {
          border: 2px dashed #000;
          display: block !important;
        }

        .queue-number {
          font-size: 50px;
          font-weight: bold;
          margin: 10px 0;
        }

        .service-info {
          font-size: 14px;
          margin: 10px 0;
        }

        .timestamp {
          font-size: 12px;
          margin-top: 10px;
          color: #555;
        }
      }

      body {
        font-family: 'Poppins', sans-serif;
        text-align: center;
        padding: 20px;
      }
      </style>
    </head>
    <body>
      <div class="ticket-box">
        <h2>PANDAWA24JAM</h2>
        <div class="queue-number">${selectedQueue?.kd_identifikasi || "X"}-${nomorFinal}</div>
        <div class="service-info">Layanan: ${selectedQueue?.label || "Layanan"}</div>
        <div class="timestamp">Waktu Cetak: ${waktuCetak}</div>
      </div>
    </body>
  </html>
`;

// print & tampilkan modal
export const printTicketAndShowModal = async (ticketHTML, setModalState, reload = true) => {
  try {
    await window.electronAPI?.printTicket(ticketHTML);
    console.log("✅ Tiket berhasil dicetak.");
    setModalState(true);
    setTimeout(() => {
      setModalState(false);
      if (reload) window.location.reload();
    }, 3000);
  } catch (err) {
    console.error("❌ Gagal mencetak tiket:", err);
  }
};
