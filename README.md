# QSCORE-FE2.0

## Project Directory

    |-- node_modules/
    |-- public/
    |-- src/
    |   |-- asset/
    |   |-- components/
    |   |-- context/ 
    |   |-- hooks/ 
    |   |-- pages/ 
    |   |-- service/ 
    |   |-- utils/ 
    |   |-- App.css/
    |   |-- App.jsx/ 
    |   |-- index.css/ 
    |   |-- main.jsx/ 
    |-- .dockerignore 
    |-- .env
    |-- .eslintrc.cjs
    |--.gitignore
    |-- Dockerfile
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- postcss.configs.js
    |-- README.md
    |-- tailwind.config.js
    |-- vite.config.js
    |-- webpack.config.js
    |-- yarn.lock


## Build images

    docker build -t qscore-app .

## run container

    docker run -d -p 8000:8000 --name qscore-app-container qscore-app

    
## run app
    
    yarn dev
