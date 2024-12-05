# MendelsonApp

Mendelson is a new FOSS that wants to replace music apps dedicated to organize your local library music for an full open source entirely local approach. No cloud services are provided, no APIs, servers or music in someone else's computer. Your music, your culture, your take.

We use [Angular](https://angular.dev/) for the frontend and [Tauri](https://v2.tauri.app/) for the backend.

## Get started

Clone the repo and run:

```bash
npm install
```

Now you need to install Tauri dependencies. For that you can check what's missing running:

```bash
npx tauti info
```

That will list all the dependencies missing, probably rust and environment specific dependencies according to your OS. You can see an extended better-curated guide on the [Tauri website](https://v2.tauri.app/start/prerequisites/).

## Development server

To start a local development server with development config, just run:

```bash
npm run start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Build and run the app

To build the app with Tauri and Angular just run:

```bash
npx tauri build
```

This will build the Angular app and then it will build and launch the Desktop application.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
