# Invention Backend

## Table of Contents

- [Invention Backend](#invention-backend)
  - [Table of Contents](#table-of-contents)
  - [Migrations](#migrations)
    - [Create a new migration](#create-a-new-migration)
    - [Run migrations](#run-migrations)
    - [Revert migrations](#revert-migrations)

## Migrations

### Create a new migration

```bash
npm run migration:create ./database/migrations/<migration-name>
```

### Run migrations

```bash
npm run migration:run
```

### Revert migrations

```bash
npm run migration:revert
```
