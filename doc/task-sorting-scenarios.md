# Task Sorting Scenarios
The following table depicts each case that is being executed when tasks are being sorted. The scenario numbers are reflected in the respective unit tests in the TaskService-tests.

| Scenario | Due Time      | Calculated start | Start B < Due A | Start A < Due B | Priority | Result |
|----------|---------------|------------------|-----------------|-----------------|----------|--------|
| 1        | A Before B | A Before B    | No              | Always true     | ===      | A      |
| 2        | A Before B | A Before B    | No              | Always true     | A        | A      |
| 3        | A Before B | A Before B    | No              | Always true     | B        | A      |
| 4        | A Before B | A Before B    | Yes             | Always true     | ===      | A      |
| 5        | A Before B | A Before B    | Yes             | Always true     | A        | A      |
| 6        | A Before B | A Before B    | Yes             | Always true     | B        | B      |
| 7        | A Before B | A after B     | Always true     | Always true     | ===      | A      |
| 8        | A Before B | A after B     | Always true     | Always true     | A        | A      |
| 9        | A Before B | A after B     | Always true     | Always true     | B        | B      |
| 10       | A Before B | A equals B    | Always true     | Always true     | ===      | A      |
| 11       | A Before B | A equals B    | Always true     | Always true     | A        | A      |
| 12       | A Before B | A equals B    | Always true     | Always true     | B        | B      |
| 13       | A after B  | A Before B    | Always true     | Always true     | ===      | B      |
| 14       | A after B  | A Before B    | Always true     | Always true     | A        | A      |
| 15       | A after B  | A Before B    | Always true     | Always true     | B        | B      |
| 16       | A after B  | A after B     | Always true     | No              | ===      | B      |
| 17       | A after B  | A after B     | Always true     | No              | A        | B      |
| 18       | A after B  | A after B     | Always true     | No              | B        | B      |
| 19       | A after B  | A after B     | Always true     | Yes             | ===      | B      |
| 20       | A after B  | A after B     | Always true     | Yes             | A        | A      |
| 21       | A after B  | A after B     | Always true     | Yes             | B        | B      |
| 22       | A after B  | A equals B    | Always true     | Always true     | ===      | B      |
| 23       | A after B  | A equals B    | Always true     | Always true     | A        | A      |
| 24       | A after B  | A equals B    | Always true     | Always true     | B        | B      |
| 25       | A equals B | A Before B    | Always true     | Always true     | ===      | A      |
| 26       | A equals B | A Before B    | Always true     | Always true     | A        | A      |
| 27       | A equals B | A Before B    | Always true     | Always true     | B        | B      |
| 28       | A equals B | A after B     | Always true     | Always true     | ===      | A      |
| 29       | A equals B | A after B     | Always true     | Always true     | A        | A      |
| 30       | A equals B | A after B     | Always true     | Always true     | B        | B      |
| 31       | A equals B | A equals B    | Always true     | Always true     | ===      | A      |
| 32       | A equals B | A equals B    | Always true     | Always true     | A        | A      |
| 33       | A equals B | A equals B    | Always true     | Always true     | B        | B      |
