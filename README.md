# Registers.js

JavaScript client for the GOV.UK Registers project

## Node

[TBC]

## Browser

[TBC]


## Development

### Todo

- Error handling o-o
- Validation
- Caching: Since Registers have a timestamp for when they were last updated, could we have a caching mode? This could also include adapters to allow for writing to memory, and also something more persistent
- Performance? Streaming?

### Testing

Run the tests with:

```bash
npm test
```

Under the hood this is running `jest`, so you can [pass any options it uses:](https://jestjs.io/docs/en/cli.html)

```bash
npm test -- --watch
```

### Thanks
This project was mainly made to learn but is in places inspired by [Octokit/rest.js](https://github.com/octokit/rest.js)
