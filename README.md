### Node Admin Api


Set Env Variables to your `.bashrc` or `.zshrc`
```sh
export FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
export FIREBASE_DATABASE_EMULATOR_HOST="127.0.0.1:9000"
export FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
```

Then

```sh
cd src
npm install
npm run start

```

Run firabase Local Emulator

```sh
npm i -g firebase-tools
firebase login
firebase emulators:start --import=./export --export-on-exit
```