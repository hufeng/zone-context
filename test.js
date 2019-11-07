const { ZoneContext, getContext, setContext } = require('./index');
function testAsync() {
  return new Promise(resolve => {
    setContext({
      test: 'test111'
    });
    setTimeout(() => {
      setTimeout(() => {
        setContext({
          hello: 'hello111'
        });
        Promise.resolve().then(() => {
          console.log(getContext('hello'));
          console.log(getContext('test'));
          resolve();
        });
      });
    });
  });
}

let count = 1;
function testSync() {
  setContext({
    hello: 'testSync' + count++
  });
  console.log(getContext('hello'));
}

function main() {
  ZoneContext(() => {
    return testAsync();
  });
  ZoneContext(() => {
    return testAsync();
  });
  ZoneContext(testSync);
  ZoneContext(testSync);
}

main();
