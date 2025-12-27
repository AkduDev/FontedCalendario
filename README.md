# FontedCalendario

## Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages usando GitHub Actions. El workflow se encuentra en `.github/workflows/gh-pages.yml`.

### Configuración

1. Asegúrate de que tu repositorio tenga GitHub Pages habilitado en la configuración:
   - Ve a "Settings" > "Pages" en tu repositorio
   - Selecciona "Deploy from a branch" como fuente
   - Selecciona la rama `gh-pages` y carpeta `/ (root)`

2. El workflow de GitHub Actions se activará automáticamente cuando hagas push a la rama `main`

### Manual Build

Si deseas construir manualmente para GitHub Pages, usa:

```bash
ng build --base-href="/[NOMBRE-DE-TU-REPOSITORIO]/"
```

Luego puedes servir los archivos estáticos desde la carpeta `dist/FontedCalendario/browser`

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
