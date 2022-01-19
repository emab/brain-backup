# CircleCI React Front-end Build
This uses the official **Node** orb to make use of its built in cache for `npm install`. There are some other commands available such as `node/run` however these must be used as `jobs`, which meant I was unable to change the `resource_class` value. It seemed to default to **Large (4vCPU, 8gb)** which is overkill for a simple build pipeline. By going for this more manual approach we can define a size for the resource.

```yaml
orbs:
 node: circleci/node@5.0.0

jobs:
  ui:
  working_directory: ui
  executor: node/default
  resource_class: small
  steps:
    - checkout:
      path: ~/project
    - node/install-packages
    - run: npm run lint
    - run: npm test
    - run: npm run build
	
workflows:
  ui:
    jobs:
	  - ui
```

If you're happy to use a larger resource, you can use the build in commands in your workflow:

```yaml
orbs:
 node: circleci/node@5.0.0
	
workflows:
  ui:
    jobs:
	  - ui