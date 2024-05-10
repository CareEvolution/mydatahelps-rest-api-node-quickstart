
# MyDataHelps REST API Node Quickstart

This app is a demonstration of how to access the [MyDataHelps REST API](https://developer.mydatahelps.org/) using [Node.js](https://nodejs.org/en/). It gives an example of obtaining an access token and making a simple query to the API. You can use this app for reference, or modify it to test out your own API requests in a development environment.

## Prerequisites

Before you begin, you will need three things:

* Your service account name, like “RKStudio.1234.test.”
* Your project ID, which is a GUID.
* The private key you associated with your service account.

For help finding this information, see the [MyDataHelps Developer Docs](https://developer.mydatahelps.org/api/quickstart.html).

## Using the App

This is a command-line app in Node.js. To run the app:

1. Install NodeJS and the Node Package Manager (npm).
2. Clone this repository.
3. Copy the file `dotenv.sample` and name the new copy `.env`.
4. Edit the `.env` file and fill in your project ID, service account name, and private key. See **Prerequisites** above for how to get this information. Be sure to include the begin/end tags “--BEGIN RSA PRIVATE KEY--“ and “--END RSA PRIVATE KEY--" in your private key, and use line breaks, looking something like this:

```
RKS_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n230703de230703de230703de\nb62b0e24b62b0e24b62b0e24\n...\n-----END RSA PRIVATE KEY-----"
```

5. From the application directory, install the necessary npm libraries: `npm install`.
6. Run the script: `node quickstart.js`.

If successful, the app will print out your token and number of participants in the console, like so:

```
Obtained service access token:
  YOUR TOKEN HERE

Total Participants: 5
```

The service access token is only valid for a few minutes, but you can copy/paste it into a REST query tool of your choice to try out advanced queries.

You can also edit the code to specify a participant identifier and get a participant access token for that participant. This token is only needed for [MyDataHelps Embeddables](https://developer.mydatahelps.org/embeddables), and is useful for testing with the [MyDataHelps Starter Kit](https://github.com/CareEvolution/MyDataHelpsStarterKit). 

## Troubleshooting

If you see an error when running the script, double-check the information in the Prerequisites, particularly the format of the private key.

If you have trouble getting the app to work, feel free to [contact MyDataHelps Support](https://developer.mydatahelps.org/help.html).
