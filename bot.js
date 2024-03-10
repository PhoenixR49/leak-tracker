const axios = require("axios").default;
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const console = require("console");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

let mailCooldown = false;
async function sendNotification(service, monitor) {
  if (!mailCooldown) {
    const mailOptions = {
      from: `"${process.env.APP_NAME}" alert@localhost`,
      to: monitor.email,
      subject: `${process.env.APP_NAME} alert`,
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="/static/css/style.css" />
          <link rel="stylesheet" href="/static/libs/bootstrap/css/bootstrap.min.css" />
          <link rel="stylesheet" href="/static/libs/bootstrap-icons/bootstrap-icons.min.css" />
          <title>${process.env.APP_NAME} alert</title>
        </head>
        <body>
          <main>
            <h1>Data leak identified</h1>
            <p>We have just identified a <strong>data leak</strong> on <strong>${monitor.name} monitor</strong>, the keyword was found on <strong>${service.name}</strong>.</p>
            <a href="${service.url}" class="btn btn-primary">See on ${service.name}</a>
            <p>It is possible that this alert is a false positive due to one or more request blockings on the sites we analyze. Thank you for your understanding.</p>
          </main>
        </body>
      </html>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(
          `${new Date().toISOString()}: Error when sending the email alert: ${error}`
        );
      } else {
        mailCooldown = true;
        setTimeout(() => {
          mailCooldown = false;
        }, 1000 * 60 * 30);

        console.log(
          `${new Date().toISOString()}: Email alert successfully sent. Message ID: ${
            info.messageId
          }`
        );
      }
    });
  }
}

async function getGoogleLeaks(monitor) {
  console.log(
    `${new Date().toISOString()}: Getting Google leaks for ${monitor.name}`
  );
  try {
    const { data } = await axios({
      method: "GET",
      url: "https://www.google.com/search",
      params: {
        q: `"${monitor.keyword}"`,
        hl: "en",
      },
      responseType: "text",
    });

    if (monitor.mode === 0) {
      if (data.includes(monitor.keyword)) {
        console.log(`${new Date().toISOString()}: No leaks found on Google`);
        return "🟢";
      }
      console.log(
        `${new Date().toISOString()}: Alert! A leak was found on Google!`
      );
      return "🔴";
    }
    if (!data.includes(monitor.keyword)) {
      console.log(`${new Date().toISOString()}: No leaks found on Google`);
      return "🟢";
    }
    console.log(
      `${new Date().toISOString()}: Alert! A leak was found on Google!`
    );
    return "🔴";
  } catch (error) {
    if (error.response.status && error.response.statusText) {
      console.error(
        `${new Date().toISOString()}: An error occurred when searching for leaks on Google: ${
          error.response.statusText
        }`
      );
      return `Error ${error.response.status}: ${error.response.statusText}`;
    }
    console.error(
      `${new Date().toISOString()}: An unknown error occurred when searching for leaks on Google`
    );
    return "Unknown error";
  }
}

async function getBingLeaks(monitor) {
  console.log(
    `${new Date().toISOString()}: Getting Bing leaks for ${monitor.name}`
  );
  try {
    const { data } = await axios({
      method: "GET",
      url: "https://www.bing.com/search",
      params: {
        q: `"${monitor.keyword}"`,
        setlang: "en",
      },
      responseType: "text",
    });

    if (monitor.mode === 0) {
      if (data.includes(monitor.keyword)) {
        console.log(`${new Date().toISOString()}: No leaks found on Bing`);
        return "🟢";
      }
      console.log(
        `${new Date().toISOString()}: Alert! A leak was found on Bing!`
      );
      return "🔴";
    }
    if (!data.includes(monitor.keyword)) {
      console.log(`${new Date().toISOString()}: No leaks found on Google`);
      return "🟢";
    }
    console.log(
      `${new Date().toISOString()}: Alert! A leak was found on Bing!`
    );
    return "🔴";
  } catch (error) {
    if (error.response.status && error.response.statusText) {
      console.error(
        `${new Date().toISOString()}: An error occurred when searching for leaks on Bing: ${
          error.response.statusText
        }`
      );
      return `Error ${error.response.status}: ${error.response.statusText}`;
    }
    console.error(
      `${new Date().toISOString()}: An unknown error occurred when searching for leaks on Bing`
    );
    return "Unknown error";
  }
}

async function getHIBPLeaks(monitor) {
  console.log(
    `${new Date().toISOString()}: Getting HIBP leaks for ${monitor.name}`
  );
  if (parseInt(monitor.type, 10) === 0) {
    try {
      const { data } = await axios({
        method: "POST",
        url: "https://haveibeenpwned.com",
        data: {
          Account: monitor.keyword,
        },
        responseType: "text",
      });

      if (monitor.mode === 0) {
        if (data.includes("no pwnage found")) {
          console.log(`${new Date().toISOString()}: No leaks found on HIBP`);
          return "🟢";
        }
        console.log(
          `${new Date().toISOString()}: Alert! A leak was found on HIBP!`
        );
        return "🔴";
      }
      if (!data.includes("no pwnage found")) {
        console.log(`${new Date().toISOString()}: No leaks found on HIBP`);
        return "🟢";
      }
      console.log(
        `${new Date().toISOString()}: Alert! A leak was found on HIBP!`
      );
      return "🔴";
    } catch (error) {
      if (error.response.status && error.response.statusText) {
        console.error(
          `${new Date().toISOString()}: An error occurred when searching for leaks on HIBP: ${
            error.response.statusText
          }`
        );
        return `Error ${error.response.status}: ${error.response.statusText}`;
      }
      console.error(
        `${new Date().toISOString()}: An unknown error occurred when searching for leaks on HIBP`
      );
      return "Unknown error";
    }
  } else if (parseInt(monitor.type, 10) === 1) {
    try {
      const { data } = await axios({
        method: "POST",
        url: "https://haveibeenpwned.com/Passwords",
        data: {
          Password: monitor.keyword,
        },
        responseType: "text",
      });

      if (monitor.mode === 0) {
        if (data.includes("no pwnage found")) {
          return "🟢";
        }
        return "🔴";
      }
      if (!data.includes("no pwnage found")) {
        return "🟢";
      }
      return "🔴";
    } catch (error) {
      if (error.response.status && error.response.statusText) {
        return `Error ${error.response.status}: ${error.response.statusText}`;
      }
      console.log(
        `${new Date().toISOString()}: An error occurred when searching for leaks on HIBP`
      );
      return "Unknown error";
    }
  }
}

async function startMonitor(monitors, monitor) {
  const intervals = [
    60 * 1000,
    60 * 1000 * 5,
    60 * 1000 * 15,
    60 * 1000 * 30,
    60 * 1000 * 60,
    60 * 1000 * 60 * 3,
    60 * 1000 * 60 * 6,
    60 * 1000 * 60 * 12,
    60 * 1000 * 60 * 24,
  ];

  console.log(`${new Date().toISOString()}: Starting ${monitor.name}`);

  async function updateMonitor() {
    const google = await getGoogleLeaks(monitor);
    const bing = await getBingLeaks(monitor);
    const HIBP = await getHIBPLeaks(monitor);

    if (google === "🔴") {
      sendNotification(
        {
          name: "Google",
          url: `https://www.google.com/search?q="${monitor.keyword}"`,
        },
        monitor
      );
    }
    if (bing === "🔴") {
      sendNotification(
        {
          name: "Bing",
          url: `https://www.bing.com/search?q="${monitor.keyword}"`,
        },
        monitor
      );
    }
    if (HIBP === "🔴") {
      if (parseInt(monitor.type, 10) === 0) {
        sendNotification(
          {
            name: "Have I Been Pwned?",
            url: "https://haveibeenpwned.com",
          },
          monitor
        );
      } else if (parseInt(monitor.type, 10) === 1) {
        sendNotification(
          {
            name: "Have I Been Pwned?",
            url: "https://haveibeenpwned.com/Passwords",
          },
          monitor
        );
      }
    }

    // eslint-disable-next-line no-unreachable-loop
    for (let i = 0; i < monitors.length; i += 1) {
      const monitorObj = monitors[i];
      if (monitors[i].id === monitor.id) {
        monitorObj.status = {
          google,
          bing,
          HIBP,
        };
        monitorObj.updatedAt = Date.now();
      } else {
        monitorObj.status = "ERROR";
        monitorObj.updatedAt = Date.now();
      }
      Object.assign(monitors[i], monitor);
      fs.writeFileSync(
        path.join(__dirname, "monitors.json").toString("utf-8"),
        JSON.stringify(monitors)
      );
    }
  }

  updateMonitor();
  setInterval(async () => {
    updateMonitor();
  }, intervals[monitor.interval]);
}

async function startMonitors() {
  const monitors = JSON.parse(
    fs.readFileSync(path.join(__dirname, "monitors.json")).toString("utf-8")
  );

  for (const monitor of monitors) {
    await startMonitor(monitors, monitor);
  }
}

module.exports = { getGoogleLeaks, getBingLeaks, startMonitors, startMonitor };
