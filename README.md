# LEAK Tracker

[![Docker](https://github.com/PhoenixR49/leak-tracker/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/PhoenixR49/leak-tracker/actions/workflows/docker-publish.yml)

![GitHub License](https://img.shields.io/github/license/PhoenixR49/leak-tracker)
[![GitHub Release](https://img.shields.io/github/v/release/PhoenixR49/leak-tracker?logo=github)](https://github.com/PhoenixR49/leak-tracker/releases)

LEAK Tracker is a simple application built with Node.js and Express.js will enable you to create monitors for your passwords, email addresses and others which will warn you if some private information have leaked on the Web.

> See [here](/README.Docker.md) the Docker documentation

## How does it work?

LEAK Tracker searches search engines (Google and Bing) and the [Have I Been Pwned?](https://haveibeenpwned.com/) database for data leaks.

For example: if you create a monitor for the e-mail address "<johndoe@example.com>" which is updated every minute. LEAK Tracker will search Google, Bing and HIBP for this e-mail address to see if it appears.
In this case, you will be alerted by email and in the application by a red dot next to the site where the address has been disclosed.

## Pre-requisites

[![Git](https://img.shields.io/badge/Git-grey?style=for-the-badge&logo=git)](https://git-scm.com/downloads)
[![Node.js](https://img.shields.io/badge/Node.js-grey?style=for-the-badge&logo=node.js)](https://nodejs.org/download)

## Installation

To install LEAK Tracker, you can run this command :

```bash
git clone https://github.com/PhoenixR49/leak-tracker
cd leak-tracker
npm run setup
```

## Configuration

To configure the app, you can go to `.env` file to edit the app settings.

Key          | Value
---          | ---
`APP_NAME`   | Name of app
`PORT`       | Port of the Express server
`EMAIL_HOST` | Email host (smtp.gmail.com for Gmail)
`EMAIL_PORT` | Port used by server for sending emails (465 for a TLS/SSL connection)
`EMAIL_PASS` | Email password (use [an app password](https://myaccount.google.com/apppasswords) for Gmail)

> For email alerts, they may end up in your SPAM folder.

## Run the app

To start LEAK Tracker, you can run the following command :

```bash
npm start
```

> Make sure you are in the LEAK Tracker folder to run this command.
