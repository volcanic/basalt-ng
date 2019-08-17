# Task Sorting Scenarios
The following table depicts each case that is being executed when tasks are being sorted. The scenario numbers are reflected in the respective unit tests in the TaskService-tests.

| Scenario | Due Time      | Calculated start | Start B < Due A | Start A < Due B | Priority | Result |
|----------|---------------|------------------|-----------------|-----------------|----------|--------|
| 1        | 1) A Before B | 1) A Before B    | No              | Always true     | ===      | A      |
| 2        | 1) A Before B | 1) A Before B    | No              | Always true     | A        | A      |
| 3        | 1) A Before B | 1) A Before B    | No              | Always true     | B        | A      |
| 4        | 1) A Before B | 1) A Before B    | Yes             | Always true     | ===      | A      |
| 5        | 1) A Before B | 1) A Before B    | Yes             | Always true     | A        | A      |
| 6        | 1) A Before B | 1) A Before B    | Yes             | Always true     | B        | B      |
| 7        | 1) A Before B | 2) A after B     | Always true     | Always true     | ===      | A      |
| 8        | 1) A Before B | 2) A after B     | Always true     | Always true     | A        | A      |
| 9        | 1) A Before B | 2) A after B     | Always true     | Always true     | B        | B      |
| 10       | 1) A Before B | 3) A equals B    | Always true     | Always true     | ===      | A      |
| 11       | 1) A Before B | 3) A equals B    | Always true     | Always true     | A        | A      |
| 12       | 1) A Before B | 3) A equals B    | Always true     | Always true     | B        | B      |
| 13       | 2) A after B  | 1) A Before B    | Always true     | Always true     | ===      | B      |
| 14       | 2) A after B  | 1) A Before B    | Always true     | Always true     | A        | A      |
| 15       | 2) A after B  | 1) A Before B    | Always true     | Always true     | B        | B      |
| 16       | 2) A after B  | 2) A after B     | Always true     | No              | ===      | B      |
| 17       | 2) A after B  | 2) A after B     | Always true     | No              | A        | B      |
| 18       | 2) A after B  | 2) A after B     | Always true     | No              | B        | B      |
| 19       | 2) A after B  | 2) A after B     | Always true     | Yes             | ===      | B      |
| 20       | 2) A after B  | 2) A after B     | Always true     | Yes             | A        | A      |
| 21       | 2) A after B  | 2) A after B     | Always true     | Yes             | B        | B      |
| 22       | 2) A after B  | 3) A equals B    | Always true     | Always true     | ===      | B      |
| 23       | 2) A after B  | 3) A equals B    | Always true     | Always true     | A        | A      |
| 24       | 2) A after B  | 3) A equals B    | Always true     | Always true     | B        | B      |
| 25       | 3) A equals B | 1) A Before B    | Always true     | Always true     | ===      | A      |
| 26       | 3) A equals B | 1) A Before B    | Always true     | Always true     | A        | A      |
| 27       | 3) A equals B | 1) A Before B    | Always true     | Always true     | B        | B      |
| 28       | 3) A equals B | 2) A after B     | Always true     | Always true     | ===      | A      |
| 29       | 3) A equals B | 2) A after B     | Always true     | Always true     | A        | A      |
| 30       | 3) A equals B | 2) A after B     | Always true     | Always true     | B        | B      |
| 31       | 3) A equals B | 3) A equals B    | Always true     | Always true     | ===      | A      |
| 32       | 3) A equals B | 3) A equals B    | Always true     | Always true     | A        | A      |
| 33       | 3) A equals B | 3) A equals B    | Always true     | Always true     | B        | B      |
