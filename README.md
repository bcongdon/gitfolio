# Gitfolio

> :octocat: A simple Github explorer written with React Native

## Building / Running

Install dependencies:

```
npm install
```

Copy `secrets.template.js` to `secrets.js`. Then, [generate a Github OAuth token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) and add it to `secrets.js`.

Start the app in development mode via Expo:

```
npm start
```

Then, either scan the QR code with the Expo app on a physical device, or press the `i` key to launch the iOS simulator.

## Screenshots

<p align="center">
  <a href="https://github.com/bcongdon/gitfolio/raw/master/screenshots/profile.png">
    <img width="40%" src="https://github.com/bcongdon/gitfolio/raw/master/screenshots/profile.png"></img>
  </a>
  <a href="https://github.com/bcongdon/gitfolio/raw/master/screenshots/search.png">
    <img width="40%" src="https://github.com/bcongdon/gitfolio/raw/master/screenshots/search.png"></img>
  </a>
</p>

<p align="center">
  <a href="https://github.com/bcongdon/gitfolio/raw/master/screenshots/notifications.png">
    <img width="40%" src="https://github.com/bcongdon/gitfolio/raw/master/screenshots/notifications.png"></img>
  </a>
  <a href="https://github.com/bcongdon/gitfolio/raw/master/screenshots/repo_visualization.png">
    <img width="40%" src="https://github.com/bcongdon/gitfolio/raw/master/screenshots/repo_visualization.png"></img>
  </a>
</p>

## Todo / Further Enhancements

* OAuth Sign-in Screen
* Paginated loading of Repos/Users/Search Results
* Cache timeout for data stored in AsyncStorage

## Acknowledgements

* This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).
* This project makes heavy use of the awesome [NativeBase](https://nativebase.io/) component library
