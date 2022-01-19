# CircleCI Environment Variables
Paramaters can be used when running CircleCI pipelines. One way to do this is via the `Project Settings` page. Once a parameter has been set, it can be used like this:

```yaml
version: 2.1

parameters:
  isRegression:
  type: boolean
  default: false
  
# define jobs here
# ...
  
workflows:
  ui:
    when:
      not: << pipeline.parameters.isRegression >>
    jobs:
      - ui
  regression:
    when: << pipeline.parameters.isRegression >>
    jobs:
      - regression
```