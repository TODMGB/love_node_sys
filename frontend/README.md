# Getting Started with Project Frontend

### Generated with [RadSystems](https://radsystems.io)

## Available Scripts
In the project directory:

### First run:
```bash
npm install
```

### After installation, then run: 
```bash
npm run serve
```

Open [http://localhost:8050](http://localhost:8050) to view it in your browser.

### Build for production
```bash
npm run build
```
Deploy generated files in `build folder` to your webserver

## Project Structure

- ```public/``` public resuources like images, icons, css, fonts
- ```src/assets/``` app resources such as: scss, themes, json.
- ```src/components/```  custom components
- ```src/composable/```  page stateful logic which encapsulate reusable functions
- ```src/i18n/```  language translation files
- ```src/pages/```  app page UI components and logic
- ```src/services/``` group of functions that perform specific task
- ```src/store/``` vuex store for each page
- ```src/App.vue``` app main layout
- ```src/main.js``` application entry point
- ```src/menus.js``` defines models for app menu items
- ```src/router.js``` define page routes
- ```src/utils.js``` helper functions
- ```src/.env``` app configurations


### For more info
See [RadSystems](https://radsystems.io/)
See [PrimeVue Framework](https://www.primefaces.org/primevue/)