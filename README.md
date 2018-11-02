# Greetings ReactNative App for MongoDB Stitch

This is a simple (trivial) React-Native app to demonstrate how to use the [MongoDB Stitch React-Native SDK](https://www.npmjs.com/package/mongodb-stitch-react-native-sdk).

[MongoDB Stitch](https://www.mongodb.com/cloud/stitch) is the serverless platformm from MongoDB.

To create the Stitch app, use the [MongoDB Stitch CLI](https://www.npmjs.com/package/mongodb-stitch-cli) to import the app contained in the `StitchApp` folder after making the following changes:

- Edit the value of `appId` in `stitch.json`; replacing greeting-xxxxx with the value for your Stitch app (find in the Clients tab in the Stitch console after creating your MongoDB Stitch app).
- Edit the value of `clusterName` in `services/mongodb-atlas/config.json` (get this from the MongoDB Atlas UI).

Before running the ReactNative app, replace `greeting-xxxx` in `src/App.js`.

