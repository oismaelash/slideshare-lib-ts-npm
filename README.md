# Slideshare lib
Get information about presentation or user

# Youtube

# NPM
https://www.npmjs.com/package/slideshare-ash

# Donate
**http://bit.ly/doeismaelnascimento**

# How to get

Using NPM

```
npm install slideshare-ash
```
Using Yarn 

```
yarn add slideshare-ash
```

## Sample
- https://github.com/ismaelash/slideshare-ash-lib-sample

```js
const Slideshare = require("slideshare-ash");

async function main() {
  const userData = await Slideshare.getUser("IsmaelNascimento5");
  console.log(userData);

  const presentations = await Slideshare.getAllPresentations("IsmaelNascimento5");
  console.log(presentations);

  const presentation = await Slideshare.getOnePresentation("https://pt.slideshare.net/IsmaelNascimento5/tecnologias-para-realidade-aumentadaar");
  console.log(presentation);
}

main();
```

## License
**MIT**
