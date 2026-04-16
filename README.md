# Clasmera SPACE

A user-interface for watching videos on the Internet and creating home entertainment center devices.

<img width="800" alt="image" src="https://github.com/user-attachments/assets/7ffe2266-ec82-40a0-afbb-4cf3a7d16543" />
<img width="800" alt="image" src="https://github.com/user-attachments/assets/589166d3-0f5b-4cf7-b6f9-c27af91d00e7" />
<img width="800" alt="image" src="https://github.com/user-attachments/assets/32403d98-4a01-4454-ba14-6a7f256677f9" />

Made with clean class-based JavaScript and CSS code, designed to run on Electron. Designed for kiosk-like situations. Comes with basic "child-proof" account security features, as well as -- for developers -- a simple and easy-to-use interactions API for both mouse and button-pad devices, and the ability to add custom video sources or applications.

Will require a decent processor and/or GPU. The default GUI is not designed for the Raspberry Pi or other low-end hardware.

## Running / Development

Use a Linux or Git Bash terminal with Node.JS (`node`) and NPM (`npm`) installed. Please search the web for "how to install npm" if you need assistance with this step.

1. Clone this repository, or download it as a ZIP file
2. Open a terminal in the directory which contains `app.mjs` (this directory will likely be named ClasmeraSpace), then run `npm install`.
3. Run `sudo npm install -g electron`, or install the **latest version** of Electron from your system's package repository (important; versions released before or during early 2025 are unlikely to work properly)
   - If you are unable to install Electron via the above command, you should try:
   1. `npm install -g electron`
   2. Searching the web for instructions on installing Electron with whatever operating system you have.
4. Run `electron app.mjs` in the terminal.
5. If a window does not open, or you face issues viewing the login or home screen, please submit a GitHub issue.

Application and video source contributions are welcome. Documentation may be sparse at this time, but any higher-level UI code should be sightreadable. If you are unable to make sense of it, please create a GitHub issue, and I will do my best to help you.

## License

GNU Affero General Public License, version 3.0 or later.
