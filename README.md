# SocialApe Application

Social media application built using:
`React` a framework to build component-based web applications and `Redux` as a state management. In addition to `Firebase` which a great Platform as a Service (PaaS). It's used here as a backend. Besides other services as `Cloud Firestore` as a realtime document-based (noSQL) database, `Cloud Functions`which are built in `Node.js`with the help of `Express`. `Authentication` that uses `Json Web Token`. `Material UI` to design the app which is based om React Components that implement Google's Material Design.

# To Start:

## Install the required packages by the following command:

```
npm run dependencies
```

## Create a project at the following link:

https://console.firebase.google.com/

## Create `config` folder in the following directory:

```
/socialape-functions/functions/
```

### In the `config` folder, create `firebaseConfig.js` file that contains the following:

```
module.exports = {
  apiKey: "<Your Api Key>",
  authDomain: "<Your Project Id or name>.firebaseapp.com",
  databaseURL: "<Your database URL>",
  projectId: "<Your Project Id>",
  storageBucket: "<Your Storage Bucket>",
  messagingSenderId: "<Your Messaging Sender Id>",
  appId: "<Your App Id>",
  measurementId: "<Your Measurement Id>"
};
```

`Tip:` You can find this config object in the Settings of your project on firebase.

### In the `config` folder, create also `serviceAccountKey.json` file that contains the following:

```
{
  "type": "service_account",
  "project_id": "<Your project id>",
  "private_key_id": "<Your projec's private key id>",
  "private_key": "<Your project's private key>",
  "client_email": "<Your client email>",
  "client_id": "Your client id",
  "auth_uri": "<Your Auth uri>",
  "token_uri": "<Your token uri>",
  "auth_provider_x509_cert_url": "<Your auth provider x509 cert url>",
  "client_x509_cert_url": "<Your client x509 cert url>"
}
```

`Tip:` You can generate this PRIVATE KEY in the Settings (service accounts) of your project on firebase.

## Run the following command to start the app in the development mode:

```
npm run dev
```

## Please, visit the following link to try the app:

https://socialape-ad195.firebaseapp.com/
