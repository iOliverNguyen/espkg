# espkg.vercel.app

## Directory structure

| source     | build     | usage                                    |
|------------|-----------|------------------------------------------|
| api        |           | api route, used by vercel                |
| deps       |           | extra command, executed by build process |
| src.api    | api.build | api code, imported by api/api.js         |
| src.app    | public    | homepage, built by snowpack              |
| src.public | public    | static files, built by snowpack          |

## Script

### Snowpack

Use snowpack for developing homepage

```bash
# build
yarn snowpack build

# dev
yarn snowpack dev

# build, after finishing homepage
```

### Vercel

Use vercel for developing /api and preparing for deployment

```bash
# login
yarn vercel login

# dev
yarn vercel dev

# deploy
yarn vercel deploy
```
