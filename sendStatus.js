const fetchServer = (statusJSON) => {
  fetch(
    "https://discord.com/api/webhooks/1431603474503827467/fTmwgjtnHRQ9r5HzB0xbQd7Z1hA1OiHfCB94L9lPgbsrxjwSYa8F9hFHNvG2fOf4gdmz",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statusJSON),
    },
  ).catch((error) => console.error("Error: ", error));
};

const offlineMessage = {
  content: "[SERVER] NetVerses is DOWN!",
  embeds: [
    {
      title: "Server Status",
      description: "The NetVerses server is offline.",
      color: 0xff0000,
      fields: [
        {
          name: "Status",
          value: "Offline",
          inline: true,
        },
      ],
    },
  ],
  timestamp: new Date(),
};

fetchServer(offlineMessage);
